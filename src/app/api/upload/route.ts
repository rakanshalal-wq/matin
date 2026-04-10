import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import { getUserFromRequest } from '@/lib/auth';
import { guardFileUpload } from '@/lib/quota-guard';
import { incrementStorageQuota } from '@/lib/tenant';

export async function POST(request: Request) {
  try {
    // التحقق من المصادقة أولاً — لا يُسمح برفع ملفات بدون تسجيل دخول
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'غير مصرح — يجب تسجيل الدخول أولاً' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const category = formData.get('category') as string || 'general';

    if (!file) {
      return NextResponse.json({ error: 'لم يتم اختيار ملف' }, { status: 400 });
    }

    // أنواع الملفات المسموحة حسب الفئة
    const allowedTypes: Record<string, string[]> = {
      images: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'],
      videos: ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'],
      documents: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                  'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                  'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
                  'text/plain', 'text/csv'],
      audio: ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp4'],
      general: [] // يقبل كل شيء
    };

    // حدود الحجم حسب النوع (بالبايت)
    const sizeLimits: Record<string, number> = {
      images: 10 * 1024 * 1024,      // 10MB
      videos: 500 * 1024 * 1024,     // 500MB
      documents: 50 * 1024 * 1024,   // 50MB
      audio: 100 * 1024 * 1024,      // 100MB
      general: 100 * 1024 * 1024,    // 100MB
      posts: 10 * 1024 * 1024        // 10MB
    };

    // التحقق من نوع الملف
    const allowed = allowedTypes[category] || [];
    if (allowed.length > 0 && !allowed.includes(file.type)) {
      return NextResponse.json({ error: `نوع الملف غير مسموح: ${file.type}` }, { status: 400 });
    }

    // التحقق من الحجم
    const maxSize = sizeLimits[category] || sizeLimits.general;
    if (file.size > maxSize) {
      const maxMB = Math.round(maxSize / (1024 * 1024));
      return NextResponse.json({ error: `حجم الملف يجب أن يكون أقل من ${maxMB}MB` }, { status: 400 });
    }

    // ✅ فحص حصة التخزين قبل الرفع
    const schoolId = user.school_id || null;
    if (schoolId) {
      const guard = await guardFileUpload(schoolId, file.size);
      if (!guard.allowed) {
        return NextResponse.json(
          { error: guard.error, upgrade_url: guard.upgrade_url },
          { status: 402 }
        );
      }
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // تحديد مجلد الحفظ
    const uploadDir = join(process.cwd(), 'public', 'uploads', category);
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // إنشاء اسم فريد
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    const ext = file.name.split('.').pop() || 'bin';
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_').substring(0, 50);
    const fileName = `${timestamp}_${random}_${safeName}`;
    const filePath = join(uploadDir, fileName);

    await writeFile(filePath, buffer);

    // تحديث عداد التخزين في tenant_quotas
    if (schoolId) {
      incrementStorageQuota(schoolId, file.size).catch((err) => {
        console.error('[Quota] فشل تحديث عداد التخزين:', err);
      });
    }

    const fileUrl = `/uploads/${category}/${fileName}`;

    return NextResponse.json({
      success: true,
      url: fileUrl,
      imageUrl: fileUrl, // backward compatibility
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      category
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ error: 'حدث خطأ في رفع الملف' }, { status: 500 });
  }
}

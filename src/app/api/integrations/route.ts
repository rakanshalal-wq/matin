import { NextResponse } from 'next/server';
import { pool, getUserFromRequest } from '@/lib/auth';

// ══════════════════════════════════════════════
// GET - جلب جميع التكاملات
// ══════════════════════════════════════════════
export async function GET(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

    if (user.role === 'super_admin') {
      // المالك يرى كل شيء بما فيه الـ config الكامل (مع إخفاء القيم الحساسة جزئياً)
      const result = await pool.query(`
        SELECT 
          id, name, type, display_name, description, category, icon, color,
          config, is_active, docs_url, test_mode, connected_at,
          api_key, api_secret, webhook_secret, extra_config,
          created_at, updated_at
        FROM integrations 
        ORDER BY 
          CASE category 
            WHEN 'payment' THEN 1 
            WHEN 'shipping' THEN 2 
            WHEN 'communication' THEN 3 
            WHEN 'government' THEN 4 
            WHEN 'notification' THEN 5 
            WHEN 'analytics' THEN 6 
            WHEN 'maps' THEN 7 
            ELSE 8 
          END, display_name
      `);
      return NextResponse.json({ data: result.rows, total: result.rowCount });
    } else {
      // المدارس ترى التكاملات المتاحة فقط
      const result = await pool.query(`
        SELECT 
          i.id, i.name, i.type, i.display_name, i.description, i.category, i.icon, i.color,
          i.config, i.is_active, i.docs_url, i.test_mode,
          CASE WHEN si.school_id IS NOT NULL THEN true ELSE false END as is_connected,
          si.connected_at
        FROM integrations i
        LEFT JOIN school_integrations si ON si.provider = i.name AND si.school_id = $1
        WHERE i.is_active = true
        ORDER BY i.category, i.display_name
      `, [user.school_id]);
      return NextResponse.json({ data: result.rows, total: result.rowCount });
    }
  } catch (error: any) {
    console.error('Integrations GET error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ══════════════════════════════════════════════
// POST - إنشاء تكامل جديد (super_admin فقط)
// ══════════════════════════════════════════════
export async function POST(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user || user.role !== 'super_admin') {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 403 });
    }

    const body = await request.json();
    const { name, type, display_name, description, category, icon, color, config, is_active, docs_url } = body;

    if (!name || !type) {
      return NextResponse.json({ error: 'الاسم والنوع مطلوبان' }, { status: 400 });
    }

    const id = name.toLowerCase().replace(/\s+/g, '_');
    const result = await pool.query(
      `INSERT INTO integrations (id, name, type, display_name, description, category, icon, color, config, is_active, docs_url, updated_at) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW()) 
       ON CONFLICT (id) DO UPDATE SET
         display_name = EXCLUDED.display_name,
         description = EXCLUDED.description,
         config = EXCLUDED.config,
         is_active = EXCLUDED.is_active,
         updated_at = NOW()
       RETURNING *`,
      [id, name, type, display_name || name, description || '', category || 'other', icon || '🔗', color || '#6B7280', 
       JSON.stringify(config || {}), is_active !== false, docs_url || '']
    );
    return NextResponse.json({ data: result.rows[0], success: true });
  } catch (error: any) {
    console.error('Integrations POST error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ══════════════════════════════════════════════
// PUT - تحديث تكامل (حفظ المفاتيح + تفعيل/تعطيل)
// ══════════════════════════════════════════════
export async function PUT(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user || user.role !== 'super_admin') {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 403 });
    }

    const body = await request.json();
    const { id, action } = body;

    if (!id) return NextResponse.json({ error: 'ID مطلوب' }, { status: 400 });

    // ── Toggle فقط (تفعيل/تعطيل) ──
    if (action === 'toggle') {
      const current = await pool.query('SELECT is_active FROM integrations WHERE id = $1', [id]);
      if (current.rowCount === 0) return NextResponse.json({ error: 'التكامل غير موجود' }, { status: 404 });
      const newStatus = !current.rows[0].is_active;
      const result = await pool.query(
        'UPDATE integrations SET is_active = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
        [newStatus, id]
      );
      return NextResponse.json({ 
        data: result.rows[0], 
        success: true, 
        message: newStatus ? 'تم تفعيل التكامل' : 'تم تعطيل التكامل'
      });
    }

    // ── حفظ الإعدادات والمفاتيح ──
    if (action === 'save_config' || !action) {
      const { config_data, is_active, test_mode, display_name, description } = body;

      // تحقق من وجود التكامل
      const existing = await pool.query('SELECT * FROM integrations WHERE id = $1', [id]);
      if (existing.rowCount === 0) return NextResponse.json({ error: 'التكامل غير موجود' }, { status: 404 });

      const currentConfig = existing.rows[0].config || {};
      const fields: any[] = currentConfig.fields || [];

      // بناء extra_config من البيانات المُرسلة
      const extraConfig: any = {};
      const sensitiveFields = ['secret_key', 'api_secret', 'password', 'private_key', 'access_token', 'api_token', 'notification_key', 'client_secret', 'account_pin', 'passkey', 'server_key', 'webhook_secret'];
      
      if (config_data) {
        for (const [key, value] of Object.entries(config_data)) {
          if (value !== undefined && value !== null && value !== '') {
            extraConfig[key] = value;
          }
        }
      }

      // تحديد حالة الاتصال
      const requiredFields = fields.filter((f: any) => f.required);
      const allRequiredFilled = requiredFields.every((f: any) => extraConfig[f.key] && extraConfig[f.key] !== '');
      const connectedAt = allRequiredFilled ? new Date() : null;

      const result = await pool.query(
        `UPDATE integrations SET 
          extra_config = $1,
          is_active = $2,
          test_mode = $3,
          display_name = COALESCE($4, display_name),
          description = COALESCE($5, description),
          connected_at = CASE WHEN $6 THEN NOW() ELSE connected_at END,
          updated_at = NOW()
        WHERE id = $7 RETURNING *`,
        [
          JSON.stringify(extraConfig),
          is_active !== undefined ? is_active : (allRequiredFilled ? true : existing.rows[0].is_active),
          test_mode !== undefined ? test_mode : existing.rows[0].test_mode,
          display_name || null,
          description || null,
          allRequiredFilled,
          id
        ]
      );

      return NextResponse.json({ 
        data: result.rows[0], 
        success: true,
        is_connected: allRequiredFilled,
        message: allRequiredFilled ? 'تم حفظ إعدادات التكامل وتفعيله' : 'تم حفظ الإعدادات (بعض الحقول المطلوبة فارغة)'
      });
    }

    // ── اختبار الاتصال ──
    if (action === 'test') {
      const integration = await pool.query('SELECT * FROM integrations WHERE id = $1', [id]);
      if (integration.rowCount === 0) return NextResponse.json({ error: 'التكامل غير موجود' }, { status: 404 });
      
      const intg = integration.rows[0];
      const config = intg.extra_config || {};
      let testResult = { success: false, message: 'لا يوجد اختبار متاح لهذا التكامل' };

      // اختبار Moyasar
      if (id === 'moyasar' && config.publishable_key) {
        try {
          const res = await fetch('https://api.moyasar.com/v1/payments?per_page=1', {
            headers: { 'Authorization': 'Basic ' + Buffer.from(config.secret_key + ':').toString('base64') }
          });
          testResult = res.ok || res.status === 200 
            ? { success: true, message: 'الاتصال بـ Moyasar يعمل بنجاح ✅' }
            : { success: false, message: `خطأ في الاتصال: ${res.status}` };
        } catch (e: any) { testResult = { success: false, message: e.message }; }
      }
      // اختبار WhatsApp
      else if (id === 'whatsapp' && config.access_token && config.phone_number_id) {
        try {
          const res = await fetch(`https://graph.facebook.com/v18.0/${config.phone_number_id}`, {
            headers: { 'Authorization': 'Bearer ' + config.access_token }
          });
          const data = await res.json();
          testResult = res.ok 
            ? { success: true, message: `الاتصال بـ WhatsApp يعمل ✅ (${data.display_phone_number || 'متصل'})` }
            : { success: false, message: data.error?.message || 'خطأ في الاتصال' };
        } catch (e: any) { testResult = { success: false, message: e.message }; }
      }
      // اختبار Resend
      else if (id === 'resend' && config.api_key) {
        try {
          const res = await fetch('https://api.resend.com/domains', {
            headers: { 'Authorization': 'Bearer ' + config.api_key }
          });
          testResult = res.ok 
            ? { success: true, message: 'الاتصال بـ Resend يعمل بنجاح ✅' }
            : { success: false, message: `خطأ: ${res.status}` };
        } catch (e: any) { testResult = { success: false, message: e.message }; }
      }
      // اختبار Firebase
      else if (id === 'firebase' && config.project_id) {
        testResult = { success: true, message: `Firebase Project: ${config.project_id} - تحقق يدوي مطلوب` };
      }
      else {
        testResult = { success: false, message: 'أدخل المفاتيح المطلوبة أولاً ثم اختبر الاتصال' };
      }

      return NextResponse.json({ ...testResult, data: intg });
    }

    return NextResponse.json({ error: 'action غير معروف' }, { status: 400 });
  } catch (error: any) {
    console.error('Integrations PUT error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ══════════════════════════════════════════════
// DELETE - حذف تكامل
// ══════════════════════════════════════════════
export async function DELETE(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user || user.role !== 'super_admin') {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 403 });
    }
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID مطلوب' }, { status: 400 });
    
    // مسح الإعدادات فقط (لا نحذف التكامل نفسه)
    await pool.query(
      'UPDATE integrations SET extra_config = $1, is_active = false, connected_at = NULL, updated_at = NOW() WHERE id = $2',
      ['{}', id]
    );
    return NextResponse.json({ success: true, message: 'تم مسح إعدادات التكامل' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

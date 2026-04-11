/**
 * /api/cron/offboarding — يُشغَّل يومياً بواسطة Vercel Cron أو أي Scheduler
 *
 * يرسل تنبيهات للمؤسسات التي تقترب من موعد الحذف،
 * ويحذف Schemas المؤسسات التي انتهت فترة سماحها.
 *
 * يُؤمَّن بـ CRON_SECRET لمنع الاستدعاء العشوائي.
 */

import { NextRequest, NextResponse } from 'next/server';
import { processOffboardingQueue } from '@/lib/offboarding';

export async function GET(request: NextRequest): Promise<NextResponse> {
  // التحقق من الـ secret
  const secret = request.headers.get('x-cron-secret');
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const result = await processOffboardingQueue();
    console.info('[Cron/Offboarding]', result);
    return NextResponse.json({ success: true, ...result });
  } catch (err) {
    console.error('[Cron/Offboarding] خطأ:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

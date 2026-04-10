/**
 * /api/cron/quota-alerts — يُشغَّل يومياً بواسطة Vercel Cron أو أي Scheduler
 *
 * يفحص نسبة استهلاك كل مؤسسة ويرسل تنبيهات عند 80% و95%.
 *
 * يُؤمَّن بـ CRON_SECRET لمنع الاستدعاء العشوائي.
 */

import { NextRequest, NextResponse } from 'next/server';
import { processQuotaAlerts } from '@/lib/quota-alerts';

export async function GET(request: NextRequest): Promise<NextResponse> {
  const secret = request.headers.get('x-cron-secret');
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const result = await processQuotaAlerts();
    console.log('[Cron/QuotaAlerts]', result);
    return NextResponse.json({ success: true, ...result });
  } catch (err) {
    console.error('[Cron/QuotaAlerts] خطأ:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

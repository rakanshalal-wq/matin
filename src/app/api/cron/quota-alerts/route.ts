import { NextRequest, NextResponse } from 'next/server';
import { processQuotaAlerts } from '@/lib/quota-alerts';
import { logger } from '@/lib/logger';

export async function GET(request: NextRequest): Promise<NextResponse> {
  const secret = request.headers.get('x-cron-secret');
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const result = await processQuotaAlerts();
    logger.info('Cron/QuotaAlerts', result);
    return NextResponse.json({ success: true, ...result });
  } catch (err) {
    logger.error('Cron/QuotaAlerts', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

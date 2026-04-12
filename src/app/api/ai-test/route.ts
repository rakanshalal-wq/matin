import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { testAIProvider } from '@/lib/ai';

async function getUser(req: NextRequest) {
  try {
    const token = req.cookies.get('token')?.value || req.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) return null;
    return await verifyToken(token);
  } catch { return null; }
}

export async function POST(req: NextRequest) {
  const user = await getUser(req);
  if (!user || user.role !== 'super_admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { provider, api_key, model } = await req.json();
  if (!provider || !api_key) {
    return NextResponse.json({ error: 'provider و api_key مطلوبان' }, { status: 400 });
  }

  const result = await testAIProvider(provider, api_key, model || 'gpt-4.1-mini');
  return NextResponse.json(result);
}

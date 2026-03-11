import { NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    
    if (!user) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        school_id: user.school_id,
        owner_id: user.owner_id,
        package: user.package,
        status: user.status,
      }
    });
  } catch (error) {
    return NextResponse.json({ error: 'خطأ في السيرفر' }, { status: 500 });
  }
}

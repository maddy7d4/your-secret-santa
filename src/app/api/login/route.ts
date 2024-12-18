import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { db } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { userId } = await request.json();
    const user = await db.getUser(userId);

    if (user) {
        const cookieStore = await cookies();
        cookieStore.set('userId', userId);
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ success: false }, { status: 401 });
    }
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}


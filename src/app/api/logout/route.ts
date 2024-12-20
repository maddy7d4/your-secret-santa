import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { db } from '@/lib/db';

export async function POST() {
    const cookieStore = await cookies();    
    const userId = cookieStore.get('userId')?.value;
    if (userId) {
        await db.addLog(userId, `logged out`);
    }
    cookieStore.delete('userId');
    return NextResponse.json({ success: true });
}


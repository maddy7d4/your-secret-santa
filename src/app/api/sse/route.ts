import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { db } from '@/lib/db';
import { addClient, removeClient } from '@/lib/notifications';

export async function GET() {
    const cookieStore = await cookies();
    const userId = cookieStore.get('userId')?.value;
    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await db.getUser(userId);
    if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 400 });
    }

    const stream = new ReadableStream<string>({
        start(controller) {
            addClient(controller);
            controller.enqueue('data: connected\n\n');
        },
        cancel(controller) {
            removeClient(controller);
        },
    });

    return new NextResponse(stream, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
        },
    });
}


import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { db } from '@/lib/db';


const encrypt = (text: string) => {
    const encoded = btoa(text);
    return encoded;
};

export async function GET() {
    const cookieStore = await cookies();
    const userId = cookieStore.get('userId')?.value;

    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized: No user ID in cookies' }, { status: 401 });
    }

    try {
        const user = await db.getUser(userId);
        if (!user || !user.partnerId) {
            return NextResponse.json({ error: 'User not found or no partner assigned' }, { status: 400 });
        }

        const messages = await db.getMessages(userId, user.partnerId);
        messages.forEach((message) => (message.receiverId = encrypt(message.receiverId)));
        return NextResponse.json(messages.reverse());
    } catch (error) {
        console.error('Error fetching messages:', error);
        return NextResponse.json({ error: 'Internal server error while fetching messages' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    const cookieStore = await cookies();
    const userId = cookieStore.get('userId')?.value;

    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized: No user ID in cookies' }, { status: 401 });
    }

    try {
        const user = await db.getUser(userId);
        if (!user || !user.partnerId) {
            return NextResponse.json({ error: 'User not found or no partner assigned' }, { status: 400 });
        }

        const { content } = await request.json();

        if (!content || typeof content !== 'string' || content.trim().length === 0) {
            return NextResponse.json({ error: 'Invalid message content' }, { status: 400 });
        }

        const message = {
            id: Date.now().toString(),
            senderId: userId,
            receiverId: user.partnerId,
            content: content.trim(),
            timestamp: Date.now(),
        };

        await db.addMessage(message); // Ensure db.addMessage is async
        message.receiverId = encrypt(message.receiverId);
        return NextResponse.json({ success: true, message });
    } catch (error) {
        console.error('Error processing message:', error);
        return NextResponse.json({ error: 'Internal server error while sending message' }, { status: 500 });
    }
}

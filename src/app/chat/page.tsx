import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import ChatInterface from '../components/ChatInterface';
import Footer from '../components/Footer';

export default async function ChatPage() {
    const cookieStore = await cookies();
    const userId = cookieStore.get('userId')?.value;

    if (!userId) {
        redirect('/');
    }

    const user = await db.getUser(userId);

    if (!user) {
        redirect('/');
    }

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="w-full max-w-4xl p-4">
                <h1 className="text-3xl font-bold text-red-600 mb-4 text-center">
                    Talk to your {user.role != 'santa' ? 'Santa' : 'Child'}!
                </h1>
                <ChatInterface userId={userId} user={user.role} />
            </div>
        </div>
    );
}


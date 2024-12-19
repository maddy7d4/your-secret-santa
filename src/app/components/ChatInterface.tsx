'use client'
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { db } from '@/lib/db';

type Message = {
    id: string;
    content: string;
    senderId: string;
    timestamp: number;
};

export default function ChatInterface({ userId }: { userId: string }) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const [isUserAtBottom, setIsUserAtBottom] = useState(true);
    const user = await db.getUser(userId);



    // Scroll to the bottom of the chat when new messages are added
    useEffect(() => {
        fetchMessages();
        const interval = setInterval(fetchMessages, 3000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (isUserAtBottom && messagesEndRef.current) {
            scrollToBottom();
        }
    }, [messages]);

        useEffect(() => {
        const handleScroll = () => {
            if (chatContainerRef.current) {
                const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
                // Check if user is near the bottom (e.g., within 10px)
                setIsUserAtBottom(scrollHeight - scrollTop - clientHeight <= 10);
            }
        };
    
        const chatContainer = chatContainerRef.current;
        if (chatContainer) {
            chatContainer.addEventListener('scroll', handleScroll);
        }
    
        return () => {
            if (chatContainer) {
                chatContainer.removeEventListener('scroll', handleScroll);
            }
        };
    }, []);

        const scrollToBottom = () => {
            if (messagesEndRef.current) {
                messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
            }
        };

    const fetchMessages = async () => {
        try {
            const response = await fetch('/api/messages');
            if (response.ok) {
                const data = await response.json();
                setMessages(data); // Assuming messages are returned in reverse order
            } else {
                console.error('Failed to fetch messages');
            }
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || isLoading) return;

        setIsLoading(true);
        try {
            const response = await fetch('/api/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: newMessage }),
            });

            if (response.ok) {
                if(!isUserAtBottom){
                    scrollToBottom()
                }
                setNewMessage(''); // Clear the message input
                await fetchMessages();  // Re-fetch messages to include the new one
            } else {
                console.error('Failed to send message');
            }
        } catch (error) {
            console.error('Error sending message:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = async () => {
        await fetch('/api/logout', { method: 'POST' });
        router.push('/');
    };

    return (
        <div className="bg-white shadow-xl rounded-lg overflow-hidden flex flex-col h-[80vh]">
            <div className="p-4 border-b bg-red-500 text-white flex justify-between items-center">
                <h2 className="text-xl font-semibold">Secret Santa Chat - {user.role === 'santa' ? 'Santa' : 'Child'}</h2>
                <button
                    onClick={handleLogout}
                    className="px-4 py-2 bg-white text-red-500 rounded hover:bg-red-100 transition-colors"
                >
                    Logout
                </button>
            </div>
            <div ref={chatContainerRef} className="flex-grow overflow-y-auto p-4 space-y-4">
                {messages.length === 0 ? (
                    <p className="text-center text-gray-500">No messages yet. Start chatting!</p>
                ) : (
                    messages.map((message) => (
                        <div
                            key={Math.random()} // Use message.id for unique key
                            className={`p-3 rounded-lg ${message.senderId === userId
                                ? 'bg-red-100 text-red-800 ml-auto'
                                : 'bg-green-100 text-green-800'
                                } max-w-xs`}
                        >
                            <p>{message.content}</p>
                            <p className="text-xs text-gray-500 mt-1">
                                {new Date(message.timestamp).toLocaleTimeString()}
                            </p>
                        </div>
                    ))
                )}
                <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleSubmit} className="p-4 border-t bg-gray-50">
                <div className="flex space-x-2">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        className="flex-grow p-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-800"
                        placeholder="Type your message..."
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        className={`px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Sending...' : 'Send'}
                    </button>
                </div>
            </form>
        </div>
    );
}

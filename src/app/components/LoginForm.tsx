'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function LoginForm() {
    const [userId, setUserId] = useState('');
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: userId.toLowerCase() }),
        });

        if (response.ok) {
            router.push('/chat');
            toast.success('Login successful');
        } else {
            // alert('Login failed');
            toast.error('Login failed');
        }
        setLoading(false);
    
    };

    return (
        <form onSubmit={handleSubmit} className="mt-8 space-y-6 relative">
            <div className="absolute inset-0 flex justify-center items-center bg-white bg-opacity-50 backdrop-blur-md" style={{display: loading ? 'flex' : 'none'}}>
                <div className="animate-spin rounded-full h-8 w-8 border-b-4 border-red-500"></div>
            </div>
            <div>
                <label htmlFor="userId" className="sr-only">
                    Unique ID
                </label>
                <input
                    id="userId"
                    name="userId"
                    type="text"
                    required
                    className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm"
                    placeholder="User ID"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    disabled={loading}
                />
            </div>

            <div>
                <button
                    type="submit"
                    className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    disabled={loading}
                >
                    {loading ? 'Loading...' : 'Talk Now'}
                </button>
            </div>
        </form>
    );
}


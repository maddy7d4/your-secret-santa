import Footer from './components/Footer';
import LoginForm from './components/LoginForm';
import { db } from '@/lib/db';

export default async function Home() {
  try {
    await db.initializeUsers();
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-red-600">
            Secret Santa Chat
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your User ID to start chatting
          </p>
        </div>
        <LoginForm />
      <Footer /> 
      </div>
    </div>
  );
}


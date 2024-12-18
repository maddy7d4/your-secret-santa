import { db } from '../lib/db';

async function initDB() {
    try {
        await db.initializeUsers();
        console.log('Database initialized successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error initializing database:', error);
        process.exit(1);
    }
}

initDB();


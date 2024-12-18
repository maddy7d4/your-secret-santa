import { getDb } from './mongodb';
import { ObjectId } from 'mongodb';

export type User = {
    _id?: ObjectId;
    id: string;
    name: string;
    role: 'santa' | 'child';
    partnerId: string;
};

export type Message = {
    _id?: ObjectId;
    senderId: string;
    receiverId: string;
    content: string;
    timestamp: number;
};

export class DB {
    async getUser(id: string): Promise<User | null> {
        const db = await getDb();
        return db.collection<User>('users').findOne({ id });
    }

    async addMessage(message: Message): Promise<void> {
        const db = await getDb();
        await db.collection<Message>('messages').insertOne(message);
    }

    async getMessages(userId: string, partnerId: string, page: number = 1, pageSize: number = 50): Promise<Message[]> {
        const db = await getDb();
        return db.collection<Message>('messages')
            .find({
                $or: [
                    { senderId: userId, receiverId: partnerId },
                    { senderId: partnerId, receiverId: userId }
                ]
            })
            .sort({ timestamp: -1 })
            .skip((page - 1) * pageSize)
            .limit(pageSize)
            .toArray();
    }

    async initializeUsers(): Promise<void> {
        const db = await getDb();
        const users = [
            { id: 'santa1', name: 'Santa 1', role: 'santa' as 'santa', partnerId: 'child1' },
            { id: 'santa2', name: 'Santa 2', role: 'santa' as 'santa', partnerId: 'child2' },
            { id: 'child1', name: 'Child 1', role: 'child' as 'child', partnerId: 'santa1' },
            { id: 'child2', name: 'Child 2', role: 'child' as 'child', partnerId: 'santa2' }
        ];

        for (const user of users) {
            await db.collection<User>('users').updateOne(
                { id: user.id },
                { $setOnInsert: user },
                { upsert: true }
            );
        }
    }
}

export const db = new DB();


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
            { id: 'd78ya-child', name: 'Child', role: 'child' as 'child', partnerId: 'rak1h5th-santa' },
            { id: 'd78ya-santa', name: 'Santa', role: 'santa' as 'santa', partnerId: 'giripra8at9-child' },
            { id: 'giripra8at9-child', name: 'Child', role: 'child' as 'child', partnerId: 'd78ya-santa' },
            { id: 'giripra8at9-santa', name: 'Santa', role: 'santa' as 'santa', partnerId: 'm8d3avan-child' },
            { id: 'm8d3avan-child', name: 'Child', role: 'child' as 'child', partnerId: 'giripra8at9-santa' },
            { id: 'm8d3avan-santa', name: 'Santa', role: 'santa' as 'santa', partnerId: '25asad-child' },
            { id: '25asad-child', name: 'Child', role: 'child' as 'child', partnerId: 'm8d3avan-santa' },
            { id: '25asad-santa', name: 'Santa', role: 'santa' as 'santa', partnerId: 'rak1h5th-child' },
            { id: 'rak1h5th-child', name: 'Child', role: 'child' as 'child', partnerId: '25asad-santa' },
            { id: 'rak1h5th-santa', name: 'Santa', role: 'santa' as 'santa', partnerId: 'd78ya-child' },
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


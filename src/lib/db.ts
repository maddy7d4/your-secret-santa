import { getDb } from './mongodb';
import { ObjectId } from 'mongodb';
import { notifyClients } from '../app/api/sse/route';

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


        // Send notification
        await notifyClients(JSON.stringify({
            type: 'newMessage',
            senderId: message.senderId,
            receiverId: message.receiverId,
        }));
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
            { id: 'ra1s5ith-santa', name: 'Child', role: 'child' as 'child', partnerId: '7ivy8-child' },
            { id: 'ra1s5ith-child', name: 'Santa', role: 'santa' as 'santa', partnerId: '8ad3avan-santa' },
            { id: '7ivy8-santa', name: 'Child', role: 'child' as 'child', partnerId: '8ad3avan-child' },
            { id: '7ivy8-child', name: 'Santa', role: 'santa' as 'santa', partnerId: 'ra1s5ith-santa' },
            { id: '8ad3avan-santa', name: 'Child', role: 'child' as 'child', partnerId: 'ra1s5ith-child' },
            { id: '8ad3avan-child', name: 'Santa', role: 'santa' as 'santa', partnerId: '7ivy8-santa' },
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


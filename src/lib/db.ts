import { getDb } from './mongodb';
import { ObjectId } from 'mongodb';
import { notifyClients } from './notifications';

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
            { id: 'raks1i5h_2', name: 'Child', role: 'child' as 'child', partnerId: 'd78ya_1' },
            { id: 'raks1i5h_1', name: 'Santa', role: 'santa' as 'santa', partnerId: 'm8dha3an_2' },
            { id: 'd78ya_2', name: 'Child', role: 'child' as 'child', partnerId: 'm8dha3an_1' },
            { id: 'd78ya_1', name: 'Santa', role: 'santa' as 'santa', partnerId: 'raks1i5h_2' },
            { id: 'm8dha3an_2', name: 'Child', role: 'child' as 'child', partnerId: 'raks1i5h_1' },
            { id: 'm8dha3an_1', name: 'Santa', role: 'santa' as 'santa', partnerId: 'd78ya_2' },
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


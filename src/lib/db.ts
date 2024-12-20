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

export type Log = {
    _id?: ObjectId;
    userId: string;
    action: string;
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

        // Log the message
        await this.addLog(message.senderId, `sent a message to ${message.receiverId}`);
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
        const users: User[] = [
            { id: 'd7v8a_2', name: 'Child', role: 'child' as 'child', partnerId: 'jee5a8_1' },
            { id: 'd7v8a_1', name: 'Santa', role: 'santa' as 'santa', partnerId: 's53_2' },
            { id: 'jee5a8_2', name: 'Child', role: 'child' as 'child', partnerId: 'prasa80a_1' },
            { id: 'jee5a8_1', name: 'Santa', role: 'santa' as 'santa', partnerId: 'd7v8a_2' },
            { id: 'prasa80a_2', name: 'Child', role: 'child' as 'child', partnerId: 'gi8i9rasath_1' },
            { id: 'prasa80a_1', name: 'Santa', role: 'santa' as 'santa', partnerId: 'jee5a8_2' },
            { id: 'gi8i9rasath_2', name: 'Child', role: 'child' as 'child', partnerId: '9ijant8_1' },
            { id: 'gi8i9rasath_1', name: 'Santa', role: 'santa' as 'santa', partnerId: 'prasa80a_2' },
            { id: '9ijant8_2', name: 'Child', role: 'child' as 'child', partnerId: '1oku1 r8m_1' },
            { id: '9ijant8_1', name: 'Santa', role: 'santa' as 'santa', partnerId: 'gi8i9rasath_2' },
            { id: '1oku1 r8m_2', name: 'Child', role: 'child' as 'child', partnerId: '1n31h_1' },
            { id: '1oku1 r8m_1', name: 'Santa', role: 'santa' as 'santa', partnerId: '9ijant8_2' },
            { id: '1n31h_2', name: 'Child', role: 'child' as 'child', partnerId: '1aks5ith_1' },
            { id: '1n31h_1', name: 'Santa', role: 'santa' as 'santa', partnerId: '1oku1 r8m_2' },
            { id: '1aks5ith_2', name: 'Child', role: 'child' as 'child', partnerId: 'r12hab3_1' },
            { id: '1aks5ith_1', name: 'Santa', role: 'santa' as 'santa', partnerId: '1n31h_2' },
            { id: 'r12hab3_2', name: 'Child', role: 'child' as 'child', partnerId: 's36akat_1' },
            { id: 'r12hab3_1', name: 'Santa', role: 'santa' as 'santa', partnerId: '1aks5ith_2' },
            { id: 's36akat_2', name: 'Child', role: 'child' as 'child', partnerId: 'hars1i13_1' },
            { id: 's36akat_1', name: 'Santa', role: 'santa' as 'santa', partnerId: 'r12hab3_2' },
            { id: 'hars1i13_2', name: 'Child', role: 'child' as 'child', partnerId: '1owt1a6i_1' },
            { id: 'hars1i13_1', name: 'Santa', role: 'santa' as 'santa', partnerId: 's36akat_2' },
            { id: '1owt1a6i_2', name: 'Child', role: 'child' as 'child', partnerId: 'sri1ara0ana tantr9_1' },
            { id: '1owt1a6i_1', name: 'Santa', role: 'santa' as 'santa', partnerId: 'hars1i13_2' },
            { id: 'sri1ara0ana tantr9_2', name: 'Child', role: 'child' as 'child', partnerId: '13kitha_1' },
            { id: 'sri1ara0ana tantr9_1', name: 'Santa', role: 'santa' as 'santa', partnerId: '1owt1a6i_2' },
            { id: '13kitha_2', name: 'Child', role: 'child' as 'child', partnerId: '76rashuram_1' },
            { id: '13kitha_1', name: 'Santa', role: 'santa' as 'santa', partnerId: 'sri1ara0ana tantr9_2' },
            { id: '76rashuram_2', name: 'Child', role: 'child' as 'child', partnerId: 'r4hu9_1' },
            { id: '76rashuram_1', name: 'Santa', role: 'santa' as 'santa', partnerId: '13kitha_2' },
            { id: 'r4hu9_2', name: 'Child', role: 'child' as 'child', partnerId: 's9id3_1' },
            { id: 'r4hu9_1', name: 'Santa', role: 'santa' as 'santa', partnerId: '76rashuram_2' },
            { id: 's9id3_2', name: 'Child', role: 'child' as 'child', partnerId: 'r1v2k5mar_1' },
            { id: 's9id3_1', name: 'Santa', role: 'santa' as 'santa', partnerId: 'r4hu9_2' },
            { id: 'r1v2k5mar_2', name: 'Child', role: 'child' as 'child', partnerId: 'p1ave06_1' },
            { id: 'r1v2k5mar_1', name: 'Santa', role: 'santa' as 'santa', partnerId: 's9id3_2' },
            { id: 'p1ave06_2', name: 'Child', role: 'child' as 'child', partnerId: '8ras4ant shah_1' },
            { id: 'p1ave06_1', name: 'Santa', role: 'santa' as 'santa', partnerId: 'r1v2k5mar_2' },
            { id: '8ras4ant shah_2', name: 'Child', role: 'child' as 'child', partnerId: '55ma_1' },
            { id: '8ras4ant shah_1', name: 'Santa', role: 'santa' as 'santa', partnerId: 'p1ave06_2' },
            { id: '55ma_2', name: 'Child', role: 'child' as 'child', partnerId: 'ka1a21ysh_1' },
            { id: '55ma_1', name: 'Santa', role: 'santa' as 'santa', partnerId: '8ras4ant shah_2' },
            { id: 'ka1a21ysh_2', name: 'Child', role: 'child' as 'child', partnerId: '6arthike0an_1' },
            { id: 'ka1a21ysh_1', name: 'Santa', role: 'santa' as 'santa', partnerId: '55ma_2' },
            { id: '6arthike0an_2', name: 'Child', role: 'child' as 'child', partnerId: '12m4a_1' },
            { id: '6arthike0an_1', name: 'Santa', role: 'santa' as 'santa', partnerId: 'ka1a21ysh_2' },
            { id: '12m4a_2', name: 'Child', role: 'child' as 'child', partnerId: 's1ura3 gu3ta_1' },
            { id: '12m4a_1', name: 'Santa', role: 'santa' as 'santa', partnerId: '6arthike0an_2' },
            { id: 's1ura3 gu3ta_2', name: 'Child', role: 'child' as 'child', partnerId: '2os8_1' },
            { id: 's1ura3 gu3ta_1', name: 'Santa', role: 'santa' as 'santa', partnerId: '12m4a_2' },
            { id: '2os8_2', name: 'Child', role: 'child' as 'child', partnerId: 'j1gad29swara_1' },
            { id: '2os8_1', name: 'Santa', role: 'santa' as 'santa', partnerId: 's1ura3 gu3ta_2' },
            { id: 'j1gad29swara_2', name: 'Child', role: 'child' as 'child', partnerId: 'p9ashant singh_1' },
            { id: 'j1gad29swara_1', name: 'Santa', role: 'santa' as 'santa', partnerId: '2os8_2' },
            { id: 'p9ashant singh_2', name: 'Child', role: 'child' as 'child', partnerId: 's1m3n6er_1' },
            { id: 'p9ashant singh_1', name: 'Santa', role: 'santa' as 'santa', partnerId: 'j1gad29swara_2' },
            { id: 's1m3n6er_2', name: 'Child', role: 'child' as 'child', partnerId: '24yam_1' },
            { id: 's1m3n6er_1', name: 'Santa', role: 'santa' as 'santa', partnerId: 'p9ashant singh_2' },
            { id: '24yam_2', name: 'Child', role: 'child' as 'child', partnerId: '1our3bh kum4r_1' },
            { id: '24yam_1', name: 'Santa', role: 'santa' as 'santa', partnerId: 's1m3n6er_2' },
            { id: '1our3bh kum4r_2', name: 'Child', role: 'child' as 'child', partnerId: 'ch12n2_1' },
            { id: '1our3bh kum4r_1', name: 'Santa', role: 'santa' as 'santa', partnerId: '24yam_2' },
            { id: 'ch12n2_2', name: 'Child', role: 'child' as 'child', partnerId: 'ak5h6ta_1' },
            { id: 'ch12n2_1', name: 'Santa', role: 'santa' as 'santa', partnerId: '1our3bh kum4r_2' },
            { id: 'ak5h6ta_2', name: 'Child', role: 'child' as 'child', partnerId: '8a3havan_1' },
            { id: 'ak5h6ta_1', name: 'Santa', role: 'santa' as 'santa', partnerId: 'ch12n2_2' },
            { id: '8a3havan_2', name: 'Child', role: 'child' as 'child', partnerId: 'j6bara9_1' },
            { id: '8a3havan_1', name: 'Santa', role: 'santa' as 'santa', partnerId: 'ak5h6ta_2' },
            { id: 'j6bara9_2', name: 'Child', role: 'child' as 'child', partnerId: '117ok_1' },
            { id: 'j6bara9_1', name: 'Santa', role: 'santa' as 'santa', partnerId: '8a3havan_2' },
            { id: '117ok_2', name: 'Child', role: 'child' as 'child', partnerId: '7anjuna0ha_1' },
            { id: '117ok_1', name: 'Santa', role: 'santa' as 'santa', partnerId: 'j6bara9_2' },
            { id: '7anjuna0ha_2', name: 'Child', role: 'child' as 'child', partnerId: '2ra5ad_1' },
            { id: '7anjuna0ha_1', name: 'Santa', role: 'santa' as 'santa', partnerId: '117ok_2' },
            { id: '2ra5ad_2', name: 'Child', role: 'child' as 'child', partnerId: 'd8epa3shu_1' },
            { id: '2ra5ad_1', name: 'Santa', role: 'santa' as 'santa', partnerId: '7anjuna0ha_2' },
            { id: 'd8epa3shu_2', name: 'Child', role: 'child' as 'child', partnerId: 'vinay86a_1' },
            { id: 'd8epa3shu_1', name: 'Santa', role: 'santa' as 'santa', partnerId: '2ra5ad_2' },
            { id: 'vinay86a_2', name: 'Child', role: 'child' as 'child', partnerId: 'rushik7sh_1' },
            { id: 'vinay86a_1', name: 'Santa', role: 'santa' as 'santa', partnerId: 'd8epa3shu_2' },
            { id: 'rushik7sh_2', name: 'Child', role: 'child' as 'child', partnerId: 'm3lik9_1' },
            { id: 'rushik7sh_1', name: 'Santa', role: 'santa' as 'santa', partnerId: 'vinay86a_2' },
            { id: 'm3lik9_2', name: 'Child', role: 'child' as 'child', partnerId: 's8re4as_1' },
            { id: 'm3lik9_1', name: 'Santa', role: 'santa' as 'santa', partnerId: 'rushik7sh_2' },
            { id: 's8re4as_2', name: 'Child', role: 'child' as 'child', partnerId: 'vi8hal_1' },
            { id: 's8re4as_1', name: 'Santa', role: 'santa' as 'santa', partnerId: 'm3lik9_2' },
            { id: 'vi8hal_2', name: 'Child', role: 'child' as 'child', partnerId: 'nit23_1' },
            { id: 'vi8hal_1', name: 'Santa', role: 'santa' as 'santa', partnerId: 's8re4as_2' },
            { id: 'nit23_2', name: 'Child', role: 'child' as 'child', partnerId: 's53_1' },
            { id: 'nit23_1', name: 'Santa', role: 'santa' as 'santa', partnerId: 'vi8hal_2' },
            { id: 's53_2', name: 'Child', role: 'child' as 'child', partnerId: 'd7v8a_1' },
            { id: 's53_1', name: 'Santa', role: 'santa' as 'santa', partnerId: 'nit23_2' },
        ];

        for (const user of users) {
            await db.collection<User>('users').updateOne(
                { id: user.id },
                { $setOnInsert: user },
                { upsert: true }
            );
        }
    }

    async addLog(userId: string, action: string): Promise<void> {
        const db = await getDb();
        const log: Log = {
            userId,
            action,
            timestamp: Date.now(),
        };
        await db.collection<Log>('logs').insertOne(log);
    }
}

export const db = new DB();


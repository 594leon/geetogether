import { MongoGlobal, PostStatus } from '@serjin/common';
import { Feed } from '../models/feed.model';
import { feedColl, FeedAttrs, feedProject } from '../models/feed.mongo.model';
import { ObjectId, ClientSession } from 'mongodb'
import { FeedService } from './feed.service';

export class FeedMongoService implements FeedService {

    constructor(public mongo: MongoGlobal) {
    }

    async withTransaction<T>(operation: (session: any) => Promise<T>): Promise<T> {

        return this.mongo.withTransaction(operation);
    }

    async upsert(accountId: string, data: { postId: string, name: string, avatar: string, title: string, status: PostStatus, celebrity: boolean, createdAt: Date, closedAt: Date }, session?: any) {
        const result = await this.mongo.db.collection<FeedAttrs>(feedColl).updateOne(
            { _id: new ObjectId(accountId) },
            { $set: data },
            { upsert: true, session }
        );

        return result.acknowledged ? result.upsertedCount : 0;
    }

    async delete(accountId: string, session?: any) {
        const result = await this.mongo.db.collection(feedColl).deleteOne(
            { _id: new ObjectId(accountId) },
            session instanceof ClientSession ? { session } : undefined
        );
        return result.acknowledged ? result.deletedCount : 0;
    }

    async find(session?: any) {
        const posts = await this.mongo.db.collection<FeedAttrs>(feedColl).find<Feed>({}, { projection: feedProject, session }).toArray();
        return posts;
    }

    async findById(accountId: string, session?: any) {
        const post = await this.mongo.db.collection<FeedAttrs>(feedColl).findOne<Feed>({ _id: new ObjectId(accountId) }, { projection: feedProject, session });
        return post;
    }
}

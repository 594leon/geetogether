import { mongo, PostStatus } from '@serjin/common';
import { Post } from '../models/post.model';
import { postColl, PostAttrs, postProject } from '../models/post.mongo.model';
import { ObjectId, ClientSession } from 'mongodb'
import { PostService } from './post.service';

export class PostMongoService implements PostService {

    async withTransaction<T>(operation: (session: any) => Promise<T>): Promise<T> {

        return mongo.withTransaction(operation);
    }

    async insert(id: string, accountId: string, title: string, limitMembers: number, closedAt: Date, expiresAt: Date, status: PostStatus, session?: any) {

        const post: PostAttrs = {
            _id: new ObjectId(id),
            accountId: accountId,
            title: title,
            limitMembers: limitMembers,
            playerCount: 0,
            closedAt: closedAt,
            expiresAt: expiresAt,
            status: status
        };

        const result = await mongo.db.collection<PostAttrs>(postColl).insertOne(
            post,
            session instanceof ClientSession ? { session } : undefined
        );
        return result.insertedId.toString();
    }

    async update(id: string, data: { status?: PostStatus, closedAt?: Date, expiresAt?: Date }, session?: any) {
        const result = await mongo.db.collection<PostAttrs>(postColl).updateOne(
            { _id: new ObjectId(id) },
            {
                $set: data
            },
            session instanceof ClientSession ? { session } : undefined
        );
        return result.acknowledged ? result.modifiedCount : 0;
    }

    async find(session?: any) {
        const posts = await mongo.db.collection<Post>(postColl).find<Post>({}, { projection: postProject, session }).toArray();
        return posts;
    }

    async findById(id: string, session?: any) {
        const post = await mongo.db.collection<Post>(postColl).findOne<Post>({ _id: new ObjectId(id) }, { projection: postProject, session });
        return post;
    }

    async findByAccountId(accountId: string, session?: any) {
        const post = await mongo.db.collection<Post>(postColl).findOne<Post>({ accountId: accountId }, { projection: postProject, session });
        return post;
    }

    async increasePlayerCount(postId: string, session?: any) {
        const result = await mongo.db.collection<PostAttrs>(postColl).updateOne(
            { _id: new ObjectId(postId) },
            {
                $inc: { playerCount: 1 }
            },
            session instanceof ClientSession ? { session } : undefined
        );
        return result.acknowledged ? result.modifiedCount : 0;
    }

    async delete(postId: string, session?: any) {
        const result = await mongo.db.collection<PostAttrs>(postColl).deleteOne(
            { _id: new ObjectId(postId) },
            session instanceof ClientSession ? { session } : undefined
        );
        return result.acknowledged ? result.deletedCount : 0;
    }
}

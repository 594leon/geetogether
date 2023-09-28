import { mongo } from '@serjin/common';
import { Comment } from '../models/comment.model';
import { commentColl, CommentAttrs, commentProject } from '../models/comment.mongo.model';
import { ClientSession } from 'mongodb';
import { CommentService } from './comment.service';

export class CommentMongoService implements CommentService {

    async withTransaction<T>(operation: (session: any) => Promise<T>): Promise<T> {

        return mongo.withTransaction(operation);
    }

    async find(session?: any) {

        const profiles = await mongo.db.collection<Comment>(commentColl).find<Comment>({}, { projection: commentProject, session }).toArray();

        return profiles;
    }

    async findByRoomId(roomId: string, page: number, limit: number, session?: any) {

        return await mongo.db.collection<Comment>(commentColl).find<Comment>(
            { roomId: roomId },
            { projection: commentProject, session, }
        ).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).toArray();
    }

    async insert(roomId: string, accountId: string, text: string, session?: any) {
        const comment: CommentAttrs = {
            roomId: roomId,
            accountId: accountId,
            text: text,
            createdAt: new Date()
        }
        const result = await mongo.db.collection<CommentAttrs>(commentColl).insertOne(
            comment,
            session instanceof ClientSession ? { session } : undefined
        );
        return result.insertedId.toString();
    }

    async deleteMany(roomId: string, session?: any) {
        const result = await mongo.db.collection<CommentAttrs>(commentColl).deleteMany(
            { roomId: roomId },
            session instanceof ClientSession ? { session } : undefined
        );
        return result.acknowledged ? result.deletedCount : 0;
    }
}

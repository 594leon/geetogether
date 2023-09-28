import { mongo, Gender, PostStatus, InternalError } from '@serjin/common';
import { profileColl } from '../models/profile.mongo.model';
import { Post } from '../models/post.model';
import { postColl, PostAttrs, postProject } from '../models/post.mongo.model';
import { ObjectId, ClientSession } from 'mongodb'
import { PostService } from './post.service';

export class PostMongoService implements PostService {

    async withTransaction<T>(operation: (session: any) => Promise<T>): Promise<T> {

        return mongo.withTransaction(operation);
    }

    async insert(postId: string, accountId: string, profileId: string, title: string, limitMembers: number, createdAt: Date, closedAt: Date, expiresAt: Date, status: PostStatus, session?: any) {

        const post: PostAttrs = {
            _id: new ObjectId(postId),
            accountId,
            profileId: new ObjectId(profileId),
            title,
            limitMembers,
            createdAt,
            closedAt,
            expiresAt,
            status
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

        const result = mongo.db.collection(postColl).aggregate<Post>([
            {
                $lookup: {
                    from: profileColl,
                    localField: 'profileId',
                    foreignField: '_id',
                    as: 'profile'
                }
            },
            {
                $unwind: '$profile'
                //$lookup JOIN關連進來的profile資料為Array(profile: Profile[])，使用$unwind可以解開Array，又因為post跟profile的關係是一對一，所以解開Array後變(profile: Profile)
            },
            {
                $project: postProject
            },
            {
                $sort: { createdAt: -1 }
            }
        ]);

        return await result.toArray();
    }

    async findById(id: string, session?: any) {
        const cursor = mongo.db.collection(postColl).aggregate<Post>([
            {
                $match: { _id: new ObjectId(id) }
            },
            {
                $lookup: {
                    from: profileColl,
                    localField: 'profileId',
                    foreignField: '_id',
                    as: 'profile'
                }
            },
            {
                $unwind: '$profile'
                //$lookup JOIN關連進來的profile資料為Array(profile: Profile[])，使用$unwind可以解開Array，又因為post跟profile的關係是一對一，所以解開Array後變(profile: Profile)
            },
            {
                $limit: 1 //等同原來的findOne()
            },
            {
                $project: postProject
            },
            {
                $sort: { createdAt: -1 }
            }
        ]);
        const result = await cursor.next();
        // const result = await cursor.toArray();
        console.log('result: ' + result);
        return result;
        // return result.length === 0 ? null : result[0];
    }

    async findByAccountId(accountId: string, session?: any) {
        const cursor = mongo.db.collection<PostAttrs>(postColl).aggregate<Post>([
            {
                $match: { accountId: new ObjectId(accountId) }
            },
            {
                $lookup: {
                    from: profileColl,
                    localField: 'profileId',
                    foreignField: '_id',
                    as: 'profile'
                }
            },
            {
                $unwind: '$profile'
                //$lookup JOIN關連進來的profile資料為Array(profile: Profile[])，使用$unwind可以解開Array，又因為post跟profile的關係是一對一，所以解開Array後變(profile: Profile)
            },
            {
                $project: postProject
            },
            {
                $sort: { createdAt: -1 }
            }
        ]);
        return await cursor.toArray();
    }

    async countPostsByAccountId(accountId: string, session?: any) {
        const count = await mongo.db.collection(postColl).countDocuments({ accountId: accountId });
        return count;
    }

    async delete(postId: string, session?: any) {
        const result = await mongo.db.collection(postColl).deleteOne({ _id: new ObjectId(postId) });
        return result.acknowledged ? result.deletedCount : 0;
    }
}

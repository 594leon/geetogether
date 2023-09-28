import { MongoGlobal } from '@serjin/common';
import { Follow, Following, Follower } from '../models/follow.model';
import { followColl, FollowAttrs, followProject, followingProject, followerProject } from '../models/follow.mongo.model';
import { profileColl } from '../models/profile.mongo.model';
import { ClientSession, Filter, ObjectId } from 'mongodb';
import { FollowService } from './follow.service';

export class FollowMongoService implements FollowService {

    constructor(public mongo: MongoGlobal) {
    }

    async withTransaction<T>(operation: (session: any) => Promise<T>): Promise<T> {

        return this.mongo.withTransaction(operation);
    }

    async findFollowings(followerId: string, page: number, limit: number, session?: any) {
        const result = this.mongo.db.collection(followColl).aggregate<Following>([
            {
                $match: { followerId: new ObjectId(followerId) }
            },
            { $skip: (page - 1) * limit },
            { $limit: limit },
            {
                $lookup: {
                    from: profileColl,
                    localField: 'followingId',
                    foreignField: '_id',
                    as: 'following'
                }
            },
            {
                $unwind: '$following'
                //$lookup JOIN關連進來的profile資料為Array(profile: Profile[])，使用$unwind可以解開Array，又因為post跟profile的關係是一對一，所以解開Array後變(profile: Profile)
            },
            {
                $project: followingProject
            }
        ]);

        return await result.toArray();
    }

    async findFollowers(followingId: string, page: number, limit: number, session?: any) {
        const result = this.mongo.db.collection(followColl).aggregate<Follower>([
            {
                $match: { followingId: new ObjectId(followingId) }
            },
            { $skip: (page - 1) * limit },
            { $limit: limit },
            {
                $lookup: {
                    from: profileColl,
                    localField: 'followerId',
                    foreignField: '_id',
                    as: 'follower'
                }
            },
            {
                $unwind: '$follower'
                //$lookup JOIN關連進來的profile資料為Array(profile: Profile[])，使用$unwind可以解開Array，又因為post跟profile的關係是一對一，所以解開Array後變(profile: Profile)
            },
            {
                $project: followerProject
            }
        ]);

        return await result.toArray();
    }

    async findFollowerIds(followingId: string, beforeDate?: Date, session?: any) {

        //$lte:小於等於
        const query: Filter<FollowAttrs> = beforeDate ? { followingId: new ObjectId(followingId), createdAt: { $lte: beforeDate } } : { followingId: new ObjectId(followingId) };

        const follows = await this.mongo.db.collection<FollowAttrs>(followColl).find<Follow>(
            query,
            { projection: followProject, session }
        ).toArray();

        return follows;
    }

    async findAllFollowings(followerId: string, session?: any) {
        const result = this.mongo.db.collection(followColl).aggregate<Following>([
            {
                $match: { followerId: new ObjectId(followerId) }
            },
            {
                $lookup: {
                    from: profileColl,
                    localField: 'followingId',
                    foreignField: '_id',
                    as: 'following'
                }
            },
            {
                $unwind: '$following'
                //$lookup JOIN關連進來的profile資料為Array(profile: Profile[])，使用$unwind可以解開Array，又因為post跟profile的關係是一對一，所以解開Array後變(profile: Profile)
            },
            {
                $project: followingProject
            }
        ]);

        return await result.toArray();
    }

    async isFollowing(followerId: string, followingId: string) {
        const result = await this.mongo.db.collection(followColl).findOne<FollowAttrs>({ followerId: new ObjectId(followerId), followingId: new ObjectId(followingId) });
        return result !== null;
    }

    async insert(followerId: string, followingId: string, session?: any) {
        const follow: FollowAttrs = {
            followerId: new ObjectId(followerId),
            followingId: new ObjectId(followingId),
            createdAt: new Date(),
        }
        const result = await this.mongo.db.collection<FollowAttrs>(followColl).insertOne(
            follow,
            session instanceof ClientSession ? { session } : undefined
        );
        return result.insertedId.toString();
    }

    async delete(followerId: string, followingId: string, session?: any) {
        const result = await this.mongo.db.collection<FollowAttrs>(followColl).deleteOne(
            { followerId: new ObjectId(followerId), followingId: new ObjectId(followingId) },
            session instanceof ClientSession ? { session } : undefined
        );
        return result.acknowledged ? result.deletedCount : 0;
    }
}

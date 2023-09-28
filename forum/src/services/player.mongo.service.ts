import { mongo, PlayerStatus } from '@serjin/common';
import { Player } from '../models/player.model';
import { playerColl, PlayerAttrs, playerProject } from '../models/player.mongo.model';
import { profileColl } from '../models/profile.mongo.model';
import { ObjectId, ClientSession } from 'mongodb'
import { PlayerService } from './player.service';

export class PlayerMongoService implements PlayerService {

    async withTransaction<T>(operation: (session: any) => Promise<T>): Promise<T> {

        return mongo.withTransaction(operation);
    }

    async insert(postId: string, accountId: string, profileId: string, session?: any) {

        const player: PlayerAttrs = {
            postId: postId,
            accountId: accountId,
            profileId: new ObjectId(profileId),
            status: PlayerStatus.Waiting,
            createdAt: new Date()
        };

        const result = await mongo.db.collection<PlayerAttrs>(playerColl).insertOne(
            player,
            session instanceof ClientSession ? { session } : undefined
        );
        return result.insertedId.toString();
    }

    async updateAllStatus(postId: string, status: PlayerStatus, session?: any) {
        const result = await mongo.db.collection<PlayerAttrs>(playerColl).updateMany(
            { postId: postId },
            {
                $set: {
                    status: status
                }
            },
            session instanceof ClientSession ? { session } : undefined
        );
        return result.acknowledged ? result.modifiedCount : 0;
    }

    async updateStatus(postId: string, playerIds: string[], status: PlayerStatus, session?: any) {
        const objectIds = playerIds.map((id) => new ObjectId(id));
        const result = await mongo.db.collection<PlayerAttrs>(playerColl).updateMany(
            { postId: postId, _id: { $in: objectIds } },
            {
                $set: {
                    status: status
                }
            },
            session instanceof ClientSession ? { session } : undefined
        );

        return result.acknowledged ? result.modifiedCount : 0;
    }

    async find(session?: any) {
        const cursor = mongo.db.collection(playerColl).aggregate<Player>([
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
                $project: playerProject
            }
        ]);

        return await cursor.toArray();
    }

    async findByPostId(postId: string, session?: any) {
        const cursor = mongo.db.collection(playerColl).aggregate<Player>([
            {
                $match: { postId: postId }
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
                $project: playerProject
            }
        ]);

        return await cursor.toArray();
    }

    async findByAccountId(accountId: string, session?: any) {
        const cursor = mongo.db.collection(playerColl).aggregate<Player>([
            {
                $match: { accountId: accountId }
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
                $project: playerProject
            }
        ]);

        return await cursor.toArray();
    }

    async findByPostIdandAccountId(postId: string, accountId: string, session?: any) {
        const cursor = mongo.db.collection(playerColl).aggregate<Player>([
            {
                $match: { postId: postId, accountId: accountId }
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
                $project: playerProject
            }
        ]);

        const result = await cursor.next();
        return result;
    }

    async findByIds(postId: string, playerIds: string[], session?: any) {
        const objectIds = playerIds.map((id) => new ObjectId(id));

        const cursor = mongo.db.collection(playerColl).aggregate<Player>([
            {
                $match: { postId: postId, _id: { $in: objectIds } }
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
                $project: playerProject
            }
        ]);

        return await cursor.toArray();
    }

    async deleteMany(postId: string, session?: any) {
        const result = await mongo.db.collection<PlayerAttrs>(playerColl).deleteMany(
            { postId: postId },
            session instanceof ClientSession ? { session } : undefined
        );
        return result.acknowledged ? result.deletedCount : 0;
    }
}

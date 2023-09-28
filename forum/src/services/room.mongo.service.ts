import { mongo } from '@serjin/common';
import { roomColl, RoomAttrs, roomProject } from '../models/room.mongo.model';
import { profileColl } from '../models/profile.mongo.model';
import { ObjectId, ClientSession } from 'mongodb'
import { RoomService } from './room.service';
import { Room } from '../models/room.model';

export class RoomMongoService implements RoomService {

    async withTransaction<T>(operation: (session: any) => Promise<T>): Promise<T> {

        return mongo.withTransaction(operation);
    }

    async insert(postId: string, profiles: { accountId: string, profileId: string }[], session?: any) {
        const accountIds = profiles.map((profile) => profile.accountId);
        const profileIds = profiles.map((profile) => new ObjectId(profile.profileId));

        const room: RoomAttrs = {
            postId: postId,
            accountIds: accountIds,
            memberIds: profileIds
        };

        const result = await mongo.db.collection<RoomAttrs>(roomColl).insertOne(
            room,
            session instanceof ClientSession ? { session } : undefined
        );
        return result.insertedId.toString();
    }

    async find(session?: any) {
        const cursor = mongo.db.collection(roomColl).aggregate<Room>([
            {
                $lookup: {
                    from: profileColl,
                    localField: 'memberIds',
                    foreignField: '_id',
                    as: 'members'
                }
            },
            {
                $project: roomProject
            }
        ]);

        return await cursor.toArray();
    }

    async findById(id: string, session?: any) {
        const cursor = mongo.db.collection(roomColl).aggregate<Room>([
            {
                $match: { _id: new ObjectId(id) }
            },
            {
                $lookup: {
                    from: profileColl,
                    localField: 'memberIds',
                    foreignField: '_id',
                    as: 'members'
                }
            },
            {
                $limit: 1 //等同原來的findOne()
            },
            {
                $project: roomProject
            }
        ]);

        const result = await cursor.next();
        return result;
    }

    async findByPostId(postId: string, session?: any) {
        const cursor = mongo.db.collection(roomColl).aggregate<Room>([
            {
                $match: { postId: postId }
            },
            {
                $lookup: {
                    from: profileColl,
                    localField: 'memberIds',
                    foreignField: '_id',
                    as: 'members'
                }
            },
            {
                $limit: 1 //等同原來的findOne()
            },
            {
                $project: roomProject
            }
        ]);

        const result = await cursor.next();
        return result;
    }

    async getAccountIdsByPostId(postId: string) {
        let accountIds: string[] = [];
        const room = await mongo.db.collection<RoomAttrs>(roomColl).findOne<RoomAttrs>({ postId });
        if (room) {
            accountIds = room.accountIds;
        }
        return accountIds;
    }

    async getAccountIdsByRoomId(roomId: string) {
        let accountIds: string[] = [];
        const room = await mongo.db.collection<RoomAttrs>(roomColl).findOne<RoomAttrs>({ _id: new ObjectId(roomId) });
        if (room) {
            accountIds = room.accountIds;
        }
        return accountIds;
    }

    async delete(roomId: string, session?: any) {
        const result = await mongo.db.collection<RoomAttrs>(roomColl).deleteOne(
            { _id: new ObjectId(roomId) },
            session instanceof ClientSession ? { session } : undefined
        );
        return result.acknowledged ? result.deletedCount : 0;
    }
}

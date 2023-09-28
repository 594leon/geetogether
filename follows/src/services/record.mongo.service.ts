import { MongoGlobal } from '@serjin/common';
import { Record } from '../models/record.model';
import { recordColl, RecordAttrs, recordProject } from '../models/record.mongo.model';
import { ObjectId, ClientSession } from 'mongodb'
import { RecordService } from './record.service';

export class RecordMongoService implements RecordService {

    constructor(public mongo: MongoGlobal) {
    }

    async withTransaction<T>(operation: (session: any) => Promise<T>): Promise<T> {

        return this.mongo.withTransaction(operation);
    }

    async insert(profileId: string, session?: any) {

        const record: RecordAttrs = {
            _id: new ObjectId(profileId),
            followerCount: 0,
            followingCount: 0
        };

        const result = await this.mongo.db.collection<RecordAttrs>(recordColl).insertOne(
            record,
            session instanceof ClientSession ? { session } : undefined
        );
        return result.insertedId.toString();
    }

    async find(session?: any) {
        const posts = await this.mongo.db.collection<RecordAttrs>(recordColl).find<Record>({}, { projection: recordProject, session }).toArray();
        return posts;
    }

    async findById(id: string, session?: any) {
        const post = await this.mongo.db.collection<RecordAttrs>(recordColl).findOne<Record>({ _id: new ObjectId(id) }, { projection: recordProject, session });
        return post;
    }

    async updateFollowingCount(id: string, plusOrMinus: boolean, session?: any) {
        const result = await this.mongo.db.collection<RecordAttrs>(recordColl).updateOne(
            { _id: new ObjectId(id) },
            {
                $inc: { followingCount: plusOrMinus ? 1 : -1 }
            },
            session instanceof ClientSession ? { session } : undefined
        );
        return result.acknowledged ? result.modifiedCount : 0;
    }

    async updateFollowerCount(id: string, plusOrMinus: boolean, session?: any) {
        const result = await this.mongo.db.collection<RecordAttrs>(recordColl).updateOne(
            { _id: new ObjectId(id) },
            {
                $inc: { followerCount: plusOrMinus ? 1 : -1 }
            },
            session instanceof ClientSession ? { session } : undefined
        );
        return result.acknowledged ? result.modifiedCount : 0;
    }
}

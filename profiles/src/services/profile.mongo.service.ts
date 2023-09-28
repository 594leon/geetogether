import { mongo, Gender, ZodiacSign, InternalError, MongoGlobal } from '@serjin/common';
import { Profile } from '../models/profile.model';
import { profileColl, ProfileAttrs, profileProject } from '../models/profile.mongo.model';
import { ClientSession, ObjectId } from 'mongodb';
import { ProfileService } from './profile.service';

export default class ProfileMongoService implements ProfileService {

    constructor(public mongo: MongoGlobal) {
    }

    async withTransaction<T>(operation: (session: any) => Promise<T>): Promise<T> {

        return mongo.withTransaction(operation);
    }

    async find(session?: any): Promise<Profile[]> {
        return await mongo.db.collection<Profile>(profileColl).find<Profile>({}, { projection: profileProject, session }).toArray();
    }

    async findById(id: string, session?: any) {
        return await mongo.db.collection<Profile>(profileColl).findOne<Profile>({ _id: new ObjectId(id) }, { projection: profileProject, session });
    }

    async insert(id: string, name: string, age: number, gender: Gender, zodiacSign: ZodiacSign, myTags: string[], avatar: string, session?: any) {
        const profile: ProfileAttrs = {
            _id: new ObjectId(id),
            name,
            age,
            gender,
            zodiacSign,
            myTags,
            avatar,
            version: 0
        }
        const result = await mongo.db.collection<ProfileAttrs>(profileColl).insertOne(
            profile,
            session instanceof ClientSession ? { session } : undefined
        );

        return result.insertedId.toString();
    }

    async update(id: string, data: { name?: string, age?: number, gender?: Gender, zodiacSign?: ZodiacSign, myTags?: string[], avatar?: string }, session?: any) {
        const result = await mongo.db.collection<Profile>(profileColl).updateOne(
            { _id: new ObjectId(id) },
            {
                $set: data,
                $inc: { version: 1 }
            },
            session instanceof ClientSession ? { session } : undefined
        );
        return result.acknowledged ? result.modifiedCount : 0;
    }

    async delete(id: string) {
        const result = await mongo.db.collection(profileColl).deleteOne({ _id: new ObjectId(id) });
        return result.acknowledged ? result.deletedCount : 0;
    }
}

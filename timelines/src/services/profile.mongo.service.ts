import { mongo, Gender, ZodiacSign, InternalError } from '@serjin/common';
import { Profile } from '../models/profile.model';
import { profileColl, ProfileAttrs, profileProject } from '../models/profile.mongo.model';
import { ClientSession, ObjectId } from 'mongodb';
import { ProfileService } from './profile.service';

export class ProfileMongoService implements ProfileService {

    async withTransaction<T>(operation: (session: any) => Promise<T>): Promise<T> {

        return mongo.withTransaction(operation);
    }

    async find(session?: any) {

        const profiles = await mongo.db.collection<Profile>(profileColl).find<Profile>({}, { projection: profileProject, session }).toArray();

        return profiles;
    }

    async findById(id: string, session?: any) {

        return await mongo.db.collection<Profile>(profileColl).findOne<Profile>({ _id: new ObjectId(id) }, { projection: profileProject, session });
    }

    async findByIds(profileIds: string[], session?: any) {
        const objectIds = profileIds.map((id) => new ObjectId(id));

        const profiles = await mongo.db.collection<Profile>(profileColl).find<Profile>(
            { _id: { $in: objectIds } },
            { projection: profileProject, session }
        ).toArray();

        return profiles;
    }

    async insert(id: string, name: string, avatar: string, age: number, version: number, session?: any) {
        const profile: ProfileAttrs = {
            _id: new ObjectId(id),
            name,
            avatar,
            age,
            version
        }
        const result = await mongo.db.collection<ProfileAttrs>(profileColl).insertOne(
            profile,
            session instanceof ClientSession ? { session } : undefined
        );
        return result.insertedId.toString();
    }

    async updateNameWithOCC(id: string, name: string, avatar: string, version: number, session?: any) {
        const result = await mongo.db.collection<ProfileAttrs>(profileColl).updateOne(
            { _id: new ObjectId(id), version: { $lt: version } }, //改良版OCC, version高於現版即更新，低於現版則丟棄，$lt:小於
            {
                $set: {
                    name: name,
                    avatar: avatar,
                    version: version
                }
            },
            session instanceof ClientSession ? { session } : undefined
        );

        return result.acknowledged ? result.modifiedCount > 0 : false;
    }

    async updateCelebrity(id: string, celebrity: boolean, session?: any) {
        const result = await mongo.db.collection<ProfileAttrs>(profileColl).updateOne(
            { _id: new ObjectId(id) },
            {
                $set: {
                    celebrity: celebrity,
                }
            },
            session instanceof ClientSession ? { session } : undefined
        );
        return result.acknowledged ? result.modifiedCount : 0;
    }
}

import { Gender, PostStatus, MongoGlobal } from '@serjin/common';
import { Profile } from '../models/profile.model';
import { profileColl, ProfileAttrs, profileProject } from '../models/profile.mongo.model';
import { Post } from '../models/post.model';
import { postColl, PostAttrs, postProject } from '../models/post.mongo.model';
import { ObjectId, ClientSession } from 'mongodb'
import DatabaseService from './database.service';

export default class MongoService implements DatabaseService {

    constructor(public mongo: MongoGlobal) {
    }

    async withTransaction<T>(operation: (session: any) => Promise<T>): Promise<T> {

        return this.mongo.withTransaction(operation);
    }

    async findProfiles(session?: any) {

        // const result = this.mongo.db.collection(profileColl).aggregate<Profile>([
        //     {
        //         $project: profileProject
        //     }
        // ]);
        const profiles = await this.mongo.db.collection<Profile>(profileColl).find<Profile>({}, { projection: profileProject, session }).toArray();

        return profiles;
    }

    async findProfileById(id: string, session?: any) {

        // const cursor = this.mongo.db.collection(profileColl).aggregate<Profile>([
        //     {
        //         $match: { _id: new ObjectId(id) }
        //     },
        //     {
        //         $limit: 1 //等同原來的findOne()
        //     },
        //     profileProject
        // ])

        // const result = await cursor.next();

        // return result;
        return await this.mongo.db.collection<Profile>(profileColl).findOne<Profile>({ _id: new ObjectId(id) }, { projection: profileProject, session });
    }

    async insertProfile(id: string, name: string, avatar: string, age: number, gender: Gender, version: number, session?: any) {
        const profile: ProfileAttrs = {
            _id: new ObjectId(id),
            name,
            avatar,
            age,
            gender,
            version
        }
        const result = await this.mongo.db.collection<ProfileAttrs>(profileColl).insertOne(
            profile,
            session instanceof ClientSession ? { session } : undefined
        );
        return result.insertedId.toString();
    }

    async updateProfileNameWithOCC(id: string, name: string, avatar: string, version: number, session?: any) {
        const result = await this.mongo.db.collection<ProfileAttrs>(profileColl).updateOne(
            { _id: new ObjectId(id), version: { $lt: version } }, //改良版OCC, version高於現版即更新，低於現版則丟棄
            {
                $set: {
                    name: name,
                    avatar: avatar,
                    version: version
                },
                $inc: { age: 1 }
            },
            session instanceof ClientSession ? { session } : undefined
        );
        return result.acknowledged ? result.modifiedCount : 0;
    }


    async insertPost(accountId: string, profileId: string, title: string, content: string, limitMembers: number, expirationSeconds: number, session?: any) {
        const createdDate = new Date();

        const closedDate = new Date();
        closedDate.setSeconds(createdDate.getSeconds() + expirationSeconds);

        const expiresDate = new Date();
        expiresDate.setSeconds(closedDate.getSeconds() + expirationSeconds);

        const post: PostAttrs = {
            accountId,
            profileId: new ObjectId(profileId),
            title,
            content,
            limitMembers,
            createdAt: createdDate,
            closedAt: closedDate,
            expiresAt: expiresDate,
            status: PostStatus.Published
        };

        const result = await this.mongo.db.collection<PostAttrs>(postColl).insertOne(
            post,
            session instanceof ClientSession ? { session } : undefined
        );
        return result.insertedId.toString();
    }

    async updatePost(id: string, data: { status?: PostStatus, closedAt?: Date, expiresAt?: Date }, session?: any) {
        const result = await this.mongo.db.collection<PostAttrs>(postColl).updateOne(
            { _id: new ObjectId(id) },
            {
                $set: data
            },
            session instanceof ClientSession ? { session } : undefined
        );
        return result.acknowledged ? result.modifiedCount : 0;
    }

    async findPosts(session?: any) {

        const result = this.mongo.db.collection(postColl).aggregate<Post>([
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
            }
        ]);

        return await result.toArray();
    }

    async findPostById(id: string, session?: any) {
        const cursor = this.mongo.db.collection(postColl).aggregate<Post>([
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
            }
        ]);
        const result = await cursor.next();
        // const result = await cursor.toArray();
        console.log('result: ' + result);
        return result;
        // return result.length === 0 ? null : result[0];
    }

    async countPostsByAccountId(accountId: string, session?: any) {
        const count = await this.mongo.db.collection(postColl).countDocuments({ accountId: accountId });
        return count;
    }

    async deletePost(postId: string, session?: any) {
        const result = await this.mongo.db.collection(postColl).deleteOne({ _id: new ObjectId(postId) });
        return result.acknowledged ? result.deletedCount : 0;
    }
}

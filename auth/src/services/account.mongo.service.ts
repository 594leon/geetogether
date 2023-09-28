import { Account } from '../models/account.model';
import { accountColl, AccountAttrs, accountProject } from '../models/account.mongo,model';
import { ObjectId } from 'mongodb'
import AccountService from './account.service';
import { MongoGlobal, AccountStatus } from '@serjin/common';

export default class AccountMongoService implements AccountService {

    constructor(public mongo: MongoGlobal) {
    }

    async find(): Promise<Account[]> {
        return await this.mongo.db.collection<Account>(accountColl).find<Account>({}, { projection: accountProject }).toArray();
    }

    async findById(id: string) {
        return await this.mongo.db.collection<Account>(accountColl).findOne<Account>({ _id: new ObjectId(id) }, { projection: accountProject });
    }

    async findByEmail(email: string) {
        return await this.mongo.db.collection<Account>(accountColl).findOne<Account>({ email }, { projection: accountProject });
    }

    async insert(email: string, password: string) {

        const account: AccountAttrs = {
            email: email,
            password: password,
            status: AccountStatus.Inactive
        };

        const result = await this.mongo.db.collection<AccountAttrs>(accountColl).insertOne(account);
        return result.insertedId.toString();
    }

    async update(id: string, data: { email?: string, password?: string, status?: AccountStatus }) {
        const result = await this.mongo.db.collection<AccountAttrs>(accountColl).updateOne(
            { _id: new ObjectId(id) },
            { $set: data }
        );

        return result.acknowledged ? result.modifiedCount : 0;
    }

    async delete(id: string) {
        const result = await this.mongo.db.collection(accountColl).deleteOne({ _id: new ObjectId(id) });
        return result.acknowledged ? result.deletedCount : 0;
    }
}

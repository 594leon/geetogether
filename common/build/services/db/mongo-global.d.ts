import { MongoClient, Db, WithTransactionCallback } from 'mongodb';
import { IndexData } from './index-data';
export declare class MongoGlobal {
    private _url;
    private _dbName;
    private _indexDataArray;
    private _client;
    private _db;
    connectToMongoDB(url: string, dbName: string, ...indexDataArray: IndexData[]): Promise<void>;
    withTransaction<T>(operation: WithTransactionCallback<T>): Promise<T>;
    close(): Promise<void>;
    get client(): MongoClient;
    get db(): Db;
    get url(): string;
    get dbName(): string;
    get indexDataArray(): IndexData[];
    retry(ms: number): Promise<void>;
}
declare const _default: MongoGlobal;
export default _default;

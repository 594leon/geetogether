import { MongoClient, Db, WithTransactionCallback, IndexSpecification } from 'mongodb';
import { InternalError } from '../../errors/internal-error';
import { timeout } from '../../tools/timeout';
import { IndexData } from './index-data';

export class MongoGlobal {

    private _url: string | undefined;
    private _dbName: string | undefined;
    private _indexDataArray: IndexData[] | undefined;

    private _client: MongoClient | undefined;
    private _db: Db | undefined;

    public async connectToMongoDB(url: string, dbName: string, ...indexDataArray: IndexData[]) {

        try {
            this._url = url;
            this._dbName = dbName;
            this._indexDataArray = indexDataArray;

            this._client = new MongoClient(url);

            // 將客戶端連接到mongodb server (optional starting in v4.7)
            await this._client.connect();

            //建立並驗證連線
            await this._client.db('admin').command({ ping: 1 });

            this._db = this._client.db(dbName);

            //建立index
            if (indexDataArray.length > 0) {
                for (const indexData of indexDataArray) {
                    console.log(`Index: ${indexData.indexName} creating...`);
                    await this._db.createCollection(indexData.collName);
                    const collection = this._db.collection(indexData.collName);

                    // 列出集合的所有索引
                    const indexes = await collection.indexes();

                    // 檢查是否已經存在名稱為 'your_index_name' 的索引
                    const indexExists = indexes.some(index => index.name === indexData.indexName);//Array.some 是用來檢查陣列裡面是否有一些符合條件。只要有一個以上符合條件就會回傳 true，全部都不是的話會回傳 false

                    if (!indexExists) {
                        // 如果索引不存在，則創建索引
                        await collection.createIndex(indexData.index, { name: indexData.indexName });
                        console.log(`Index: ${indexData.indexName} created successfully.`);
                    }
                }
            }

            console.log('Connected to MongoDB Success!');

            // 監聽 MongoDB 伺服器關閉事件
            this._client.on('close', async () => {
                console.log('MongoDB connection closed. Retrying in 5 seconds...');
                // 5秒後重新連接
                await this.retry(5000);
            });

            // 監聽 MongoDB 伺服器錯誤事件
            this._client.on('error', async (err) => {
                console.error('MongoDB connection error:', err.message);
                // 5秒後重新連接
                await this.retry(5000);
            });


        } catch (err) {
            console.error('Error connecting To MongoDB:', err);
            // 5秒後重新連接
            await this.retry(5000);
        }

    }

    public async withTransaction<T>(operation: WithTransactionCallback<T>): Promise<T> {
        const session = this.client.startSession();
        session.startTransaction();
        try {
            const result = await operation(session);

            // 提交事務
            await session.commitTransaction();
            return result;

        } catch (err) {
            console.log('Error in transaction:', err);
            // 回滾事務
            await session.abortTransaction();
            throw new InternalError();

        } finally {
            // 結束 session
            await session.endSession();
        }
    }

    public async close() {
        if (this._client) {
            try {
                await this._client.close();
            } catch (err) {
                console.log(err);
            }
        }
    }

    public get client(): MongoClient {
        if (!this._client) {
            throw new Error('value MongoDB Client not initializer!')
        }
        return this._client;
    }

    public get db(): Db {
        if (!this._db) {
            throw new Error('value MongoDB DB not initializer!')
        }
        return this._db;
    }

    public get url(): string {
        if (!this._url) {
            throw new Error('value MongoDB DB not initializer!')
        }
        return this._url;
    }

    public get dbName(): string {
        if (!this._dbName) {
            throw new Error('value MongoDB DB not initializer!')
        }
        return this._dbName;
    }

    public get indexDataArray(): IndexData[] {
        if (this._indexDataArray === undefined) {
            throw new Error('value MongoDB indexDataArray not initializer!')
        }
        return this._indexDataArray;
    }

    async retry(ms: number) {
        await timeout(ms);
        this.connectToMongoDB(this.url, this.dbName, ...this.indexDataArray);
    }
}

//Singleton Pattern
export default new MongoGlobal();




















// // let client: mongoDB.MongoClient;
// // let db: mongoDB.Db;

// const dbVersion = 1.00;

// const connectToMongoDB = async (url: string, dbName: string) => {
//     if (!client) {
//         try {
//             client = new mongoDB.MongoClient(url);

//             // 將客戶端連接到mongodb server (optional starting in v4.7)
//             await client.connect();

//             //建立並驗證連線
//             await client.db('admin').command({ ping: 1 });

//             db = client.db(dbName);

//             console.log('connected to database success!')


//         } catch (err) {
//             console.log(err);
//             throw new DatabaseConnectionError();
//         }
//     }
// }

// const close = async () => {
//     if (client) {
//         try {
//             await client.close();
//         } catch (err) {
//             console.log(err);
//         }
//     }
// }

// const hasValidationRules = async (collectionName: string): Promise<boolean> => {
//     // return mongo.db?.listCollections().toArray();
//     const { cursor: { firstBatch: [{ options: { validator } }] } } = await db.command({ listCollections: 1, filter: { name: collectionName } });
//     return validator !== undefined;
// }

// const createCollections = async () => {
//     await db.createCollection('ticket',//collection名稱
//         {
//             validator: { //將schema驗證規則加入進mongodb資料庫
//                 $jsonSchema: {
//                     bsonType: 'object', //對ticket collection的document本身，預期的類型是object. 這意味著您只能向該collection添加物件(object)——換句話說，由大括號 ({和}) 包圍的完整、有效的 JSON 文檔。如果您嘗試插入其他類型的數據（如獨立字符串、整數或數組），則會導致錯誤。
//                     description: 'Document describing about Ticket', //關於該collection的document簡短描述說明(可省略)
//                     title: 'Ticket Object Validation', //描述性標題(可省略)
//                     required: ['title', 'price'], //document必需包含'title', 'price'欄位
//                     properties: {
//                         title: {
//                             bsonType: 'string', //title欄位值的型態需為string
//                             description: 'Title must be a string and is required', //欄位驗證描述，MongoDB 5.1後當document驗證失敗時錯誤資訊會包含此description訊息
//                         },
//                         price: {
//                             bsonType: 'int',
//                             minimum: 0,
//                             maximum: 1000
//                         }
//                     }
//                 }
//             }
//         });
// }

// const upsertCollection = async (collectionName: string, validatorRule: mongoDB.Document) => {
//     const { cursor: { firstBatch: [{ options: { validator: { $jsonSchema: { description } } } }] } } = await db.command({ listCollections: 1, filter: { name: collectionName } });
//     validatorRule.$jsonSchema.description = String(dbVersion);
//     if (description) {
//         //比對資料庫版號，高的話就修改成新的驗証規則版本
//         const ver = Number(description);
//         if (!ver || ver < dbVersion) {
//             await db.command({ collMod: collectionName, validator: validatorRule })
//         }
//     } else {
//         //descriptiont屬性為空就新增驗証規則
//         await db.createCollection(collectionName, { validator: validatorRule });
//     }
// }


// export { db, connectToMongoDB, close, hasValidationRules }


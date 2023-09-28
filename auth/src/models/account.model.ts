import { AccountStatus } from '@serjin/common';

//一筆資料的輸出格式，內容不應該包含特定DB的資料型態，比如mongo.ObjectId
interface Account {
    id: string;
    email: string;
    password: string;
    status: AccountStatus;
}

//此功能註解，因為目前還不考慮在mongodb加上Schema，讓mongodb保持Schemaless，看以後需求再看是否加入Schema
//對user collection加上Schema
// const validatorRule: mongoDB.Document = {
//     $jsonSchema: {
//         bsonType: 'object',
//         title: 'User Object Validation', //描述性標題(可省略)
//         description: 'User Validation rule 1.00', //描述說明(可省略), 此欄位拿來放我們的資料庫更新版號
//         required: ['name', 'email', 'password'],
//         properties: {
//             name: {
//                 bsonType: 'string',
//                 description: 'Name must be a string and is required'
//             },
//             email: {
//                 bsonType: 'string',
//                 description: 'Email must be a string and is required'
//             },
//             password: {
//                 bsonType: 'string',
//                 description: 'Password must be a string and is required'
//             }
//         }
//     }
// }

export { Account }
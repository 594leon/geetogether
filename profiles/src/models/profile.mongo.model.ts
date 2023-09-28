import { ObjectId } from "mongodb";
import { Gender, ZodiacSign } from "@serjin/common";

const profileColl = 'profiles';

//輸入一筆資料到mongo的所需參數
interface ProfileAttrs {
    _id: ObjectId;
    name: string;
    age: number;
    gender: Gender;
    // zodiacSign: 'Aries' | 'Taurus' | 'Gemini' | 'Cancer' | 'Leo' | 'Virgo' | 'Libra' | 'Scorpio' | 'Sagittarius' | 'Capricorn' | 'Aquarius' | 'Pisces';
    zodiacSign: ZodiacSign;
    myTags: string[];
    avatar: string;
    version: number;
}

//對應profile.model.ts的Profile輸出格式
const profileProject = {
    _id: 0,
    id: { $toString: '$_id' },
    name: 1,
    age: 1,
    gender: 1,
    zodiacSign: 1,
    myTags: 1,
    avatar: 1,
    version: 1
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

export { profileColl, ProfileAttrs, profileProject }
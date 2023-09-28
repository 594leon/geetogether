import { Gender } from '@serjin/common';

//一筆資料的輸出格式，內容不應該包含特定DB的資料型態，比如mongo.ObjectId
interface Profile {
    id: string;
    name: string;
    avatar: string;
    age: number;
    gender: Gender;
    version: number;
}

export { Profile };
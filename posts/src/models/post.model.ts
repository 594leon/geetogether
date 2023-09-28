import { Profile } from './profile.model';
import { Gender, PostStatus } from '@serjin/common';

//一筆資料的輸出格式，內容不應該包含特定DB的資料型態，比如mongo.ObjectId
interface Post {
    id: string;
    accountId: string;
    profile: { name: string, avatar: string, age: number, gender: Gender };
    title: string;
    content: string;
    limitMembers: number;
    createdAt: Date;
    closedAt: Date; //截止日期
    expiresAt: Date; //截止日期後多久會expires
    status: PostStatus;
}

export { Post };
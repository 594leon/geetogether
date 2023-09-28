import { PostStatus } from '@serjin/common';

//一筆資料的輸出格式，內容不應該包含特定DB的資料型態，比如mongo.ObjectId
interface Post {
    id: string;
    accountId: string;
    title: string;
    limitMembers: number;
    playerCount: number;
    closedAt: Date; //截止日期
    expiresAt: Date; //截止日期後多久會expires
    status: PostStatus;
}

export { Post };
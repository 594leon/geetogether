import { PostStatus } from '@serjin/common';

//一筆資料的輸出格式，內容不應該包含特定DB的資料型態，比如mongo.ObjectId
interface Post { //Feed資料融合Post跟Profile資訊，其id值為AccountID，因為一個人一次只能顯示一筆最新Feed
    id: string;
    accountId: string;
    profile: { name: string, avatar: string, age: number };
    title: string;
    limitMembers: number;
    createdAt: Date;
    closedAt: Date; //截止日期
    expiresAt: Date; //截止日期後多久會expires
    status: PostStatus;
};

export { Post };
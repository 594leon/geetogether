import { PostStatus } from '@serjin/common';
import { ObjectId } from "mongodb";

const feedColl = 'feeds';

//輸入一筆資料到mongo的所需參數
interface FeedAttrs { //Feed資料融合Post跟Profile資訊，其id值為AccountID，因為一個人一次只能顯示一筆最新Feed
    _id: ObjectId;
    postId: string;
    name: string;
    avatar: string;
    age: number;
    title: string;
    status: PostStatus;
    celebrity: boolean;
    createdAt: Date;
    closedAt: Date;
}

const feedProject = {
    _id: 0,
    id: { $toString: '$_id' },
    postId: 1,
    name: 1,
    avatar: 1,
    age: 1,
    title: 1,
    status: 1,
    celebrity: 1,
    createdAt: 1,
    closedAt: 1
}

export { feedColl, FeedAttrs, feedProject }
import { PostStatus } from '@serjin/common';
import { ObjectId } from "mongodb";

const postColl = 'posts';

//輸入一筆資料到mongo的所需參數
interface PostAttrs {
    _id: ObjectId;
    accountId: string;
    title: string;
    limitMembers: number;
    playerCount: number;
    closedAt: Date; //截止日期
    expiresAt: Date; //截止日期後多久會expires
    status: PostStatus;
}

const postProject = {
    _id: 0,
    id: { $toString: '$_id' },
    accountId: 1,
    title: 1,
    limitMembers: 1,
    playerCount: 1,
    closedAt: 1,
    expiresAt: 1,
    status: 1
}
export { postColl, PostAttrs, postProject }
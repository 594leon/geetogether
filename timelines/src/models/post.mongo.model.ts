import { PostStatus } from '@serjin/common';
import { ObjectId } from "mongodb";

const postColl = 'summaries';

//輸入一筆資料到mongo的所需參數
interface PostAttrs { //Feed資料融合Post跟Profile資訊，其id值為AccountID，因為一個人一次只能顯示一筆最新Feed
    _id: ObjectId;
    accountId: string;
    profileId: ObjectId;
    title: string;
    limitMembers: number;
    createdAt: Date;
    closedAt: Date;
    expiresAt: Date;
    status: PostStatus;
};

const postProject = {
    _id: 0,
    id: { $toString: '$_id' },
    accountId: 1,
    profile: {
        name: 1,
        avatar: 1,
        age: 1,
    },
    title: 1,
    limitMembers: 1,
    createdAt: 1,
    closedAt: 1,
    expiresAt: 1,
    status: 1
};

export { postColl, PostAttrs, postProject };
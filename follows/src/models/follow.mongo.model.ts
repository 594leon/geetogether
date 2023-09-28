import { IndexData } from "@serjin/common";
import { ObjectId } from "mongodb";

const followColl = 'follows';

//輸入一筆資料到mongo的所需參數
interface FollowAttrs {
    _id?: ObjectId;
    followerId: ObjectId;
    followingId: ObjectId;
    createdAt: Date;
};

const followProject = {
    _id: 0,
    id: { $toString: '$_id' },
    followerId: { $toString: '$followerId' },
    followingId: { $toString: '$followingId' },
};

const followingProject = {
    _id: 0,
    id: { $toString: '$_id' },
    followerId: { $toString: '$followerId' },
    following: {
        id: { $toString: '$following._id' }, //$following這個名稱要跟$lookup的as參數數值一致
        name: '$following.name',
        avatar: '$following.avatar',
        celebrity: '$following.celebrity'
    }
};

const followerProject = {
    _id: 0,
    id: { $toString: '$_id' },
    follower: {
        id: { $toString: '$follower._id' }, //$follower這個名稱要跟$lookup的as參數數值一致
        name: '$follower.name',
        avatar: '$follower.avatar',
    },
    followingId: { $toString: '$followingId' },
};

const followIndexes: IndexData[] = [
    {
        collName: followColl,
        indexName: 'followerId_index',
        index: { followerId: 1 }
    },
    {
        collName: followColl,
        indexName: 'followingId_index',
        index: { followingId: 1 }
    },
];

export { followColl, FollowAttrs, followProject, followingProject, followerProject, followIndexes }
import { PlayerStatus } from '@serjin/common';
import { ObjectId } from "mongodb";

const playerColl = 'players';

//輸入一筆資料到mongo的所需參數
interface PlayerAttrs {
    _id?: ObjectId;
    postId: string;
    accountId: string;
    profileId: ObjectId;
    status: PlayerStatus;
    createdAt: Date;
}

const playerProject = {
    _id: 0,
    id: { $toString: '$_id' },
    postId: 1,
    accountId: 1,
    profile: {
        id: { $toString: '$profile._id' },
        name: 1,
        avatar: 1,
    },
    status: 1,
    createdAt: 1
}

export { playerColl, PlayerAttrs, playerProject }
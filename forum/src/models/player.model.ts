import { PlayerStatus } from '@serjin/common';

//一筆資料的輸出格式，內容不應該包含特定DB的資料型態，比如mongo.ObjectId
export interface Player {
    id: string;
    postId: string;
    accountId: string;
    profile: { id: string, name: string, avatar: string };
    status: PlayerStatus;
    createdAt: Date;
}
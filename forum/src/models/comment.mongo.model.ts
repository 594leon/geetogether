import { ObjectId } from "mongodb";

const commentColl = 'comments';

//輸入一筆資料到mongo的所需參數
interface CommentAttrs {
    _id?: ObjectId;
    roomId: string;
    accountId: string;
    text: string;
    createdAt: Date;
}

const commentProject = {
    _id: 0,
    id: { $toString: '$_id' },
    roomId: 1,
    accountId: 1,
    text: 1,
    createdAt: 1,
}
export { commentColl, CommentAttrs, commentProject }
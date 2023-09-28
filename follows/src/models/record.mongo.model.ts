import { ObjectId } from "mongodb";

const recordColl = 'records';

//輸入一筆資料到mongo的所需參數
interface RecordAttrs {
    _id: ObjectId;
    followerCount: number;
    followingCount: number;
}

const recordProject = {
    _id: 0,
    id: { $toString: '$_id' },
    followerCount: 1,
    followingCount: 1,
}
export { recordColl, RecordAttrs, recordProject }
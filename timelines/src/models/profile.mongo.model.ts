import { ObjectId } from "mongodb";

const profileColl = 'profiles';

//輸入一筆資料到mongo的所需參數
interface ProfileAttrs {
    _id: ObjectId;
    name: string;
    avatar: string;
    age: number;
    version: number;
}

const profileProject = {
    _id: 0,
    id: { $toString: '$_id' },
    name: 1,
    avatar: 1,
    age: 1,
    version: 1
}
export { profileColl, ProfileAttrs, profileProject }
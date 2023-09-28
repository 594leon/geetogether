import { ObjectId } from "mongodb";

const roomColl = 'rooms';

//輸入一筆資料到mongo的所需參數
interface RoomAttrs {
    _id?: ObjectId;
    postId: string;
    accountIds: string[];//成員的accountId陣列
    memberIds: ObjectId[];//成員的profile陣列
}

const roomProject = {
    _id: 0,
    id: { $toString: '$_id' },
    postId: 1,
    members: {
        $map: {
            input: '$members',
            as: 'member',
            in: {
                id: { $toString: '$$member._id' }, // Assuming _id is the unique identifier in Profile
                name: '$$member.name',
                avatar: '$$member.avatar'
            }
        }
    }
}
export { roomColl, RoomAttrs, roomProject }
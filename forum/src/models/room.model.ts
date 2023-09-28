
//一筆資料的輸出格式，內容不應該包含特定DB的資料型態，比如mongo.ObjectId
export interface Room {
    id: string;
    postId: string;
    members: {
        id: string;
        name: string;
        avatar: string;
    }[];//成員陣列
}
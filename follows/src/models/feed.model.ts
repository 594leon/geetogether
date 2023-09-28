import { PostStatus } from '@serjin/common';

//一筆資料的輸出格式，內容不應該包含特定DB的資料型態，比如mongo.ObjectId
interface Feed { //Feed資料融合Post跟Profile資訊，其id值為AccountID，因為一個人一次只能顯示一筆最新Feed
    id: string;
    postId: string;
    name: string;
    avatar: string;
    title: string;
    status: PostStatus;
    celebrity: boolean;
    createdAt: Date;
    closedAt: Date;
}

export { Feed };
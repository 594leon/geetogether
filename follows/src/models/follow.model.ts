
//一筆資料的輸出格式，內容不應該包含特定DB的資料型態，比如mongo.ObjectId
interface Follow {
    id: string;
    followerId: string;
    followingId: string;
}

interface Following {
    id: string;
    followerId: string;
    following: {
        id: string;
        name: string;
        avatar: string;
        celebrity: boolean;
    };
}

interface Follower {
    id: string;
    follower: {
        accountId: string;
        name: string;
        avatar: string;
    };
    followingId: string;
}

export { Follow, Following, Follower };
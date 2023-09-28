import { cache } from '@serjin/common';
import { MainlineCacheService, MAINLINE_KEY } from './mainline.cache.service';

export class MainlineRedisService implements MainlineCacheService {

    //user:1 來表示使用者資料，使用 tweet:123 來表示推文。
    async create() {
        //使用timestamp作排序，越近的時間，數字越大
        const key = MAINLINE_KEY;

        // Redis不能存在空Sorted Set，所以需放入一個"空"元素
        //Sorted Set是按照分數(score)由小排到大，設定分數(score)為零，讓"空"元素永遠自動排在最前面
        await cache.redis.zadd(key, 0, 'empty');

        //設定絕對TTL時間
        // cache.redis.expire(key, ttlSeconds);
    }

    async read(page: number, pageSize: number, readAll = false) {
        const key = MAINLINE_KEY;

        // 獲取分頁的起始索引
        let start;

        // 獲取分頁的結束索引
        let end;

        if (readAll) {
            //從索引 0 到 -1 表示全部
            start = 0;
            end = -1;
        } else {
            // 獲取分頁的起始索引
            start = (page - 1) * pageSize;
            // 獲取分頁的結束索引
            end = start + pageSize - 1;
        }

        //因為Sorted Set是按照 小到大 做排序，所以集合內部會變成 時間(以前) 到 時間(現在) 排序
        // 使用 ZREVRANGE 命令反過來按照分數從大到小的順序查詢成員
        let members = await cache.redis.zrevrange(key, start, end);

        //去除排在最後面的"空"元素
        if (members.length > 0 && members[members.length - 1] === 'empty') {
            members = members.slice(0, members.length - 1);
        }

        return members;
    }

    async add(...postIds: { postId: string, date: Date }[]) {
        if (postIds.length === 0) {
            return;
        }

        //zadd值不會影響已經設定的 TTL，所以不需重新設定 TTL
        const key = MAINLINE_KEY;

        let members: (number | string)[] = [];
        postIds.forEach((value) => {
            //以分鐘為間隔，可以將時間戳除以 60000（一分鐘的毫秒數）
            const minuteTimestamp = Math.floor(value.date.getTime() / 60000);
            members.push(minuteTimestamp);
            members.push(value.postId);
        });

        await cache.redis.zadd(key, ...members);
    }

    async delete(postId: string) {
        const key = MAINLINE_KEY;
        // 從 Sorted Set 中刪除指定值的元素
        await cache.redis.zrem(key, postId);
    }

    // async isMembersExist(accountId: string, ...feedIds: string[]) {
    //     const key = MAINLINE_KEY + accountId;

    //     //pipeline可以一次性發送多個 操作命令 到Redis
    //     const pipeline = cache.redis.pipeline();

    //     //zscore()返回元素的分數(score)，可以用來驗証元素是否存在Sorted Set中
    //     feedIds.forEach((feedId) => pipeline.zscore(key, feedId));

    //     const scores = await pipeline.exec();

    //     if (!scores) {
    //         return feedIds.map(() => false);
    //     }

    //     const membersExists = feedIds.map((feedId, index) => {
    //         const score = scores[index][1];
    //         return score !== null;
    //     });

    //     return membersExists;
    // }

    // 檢查鍵 "timeline:your-accountId" 是否存在
    async isExist() {
        const key = MAINLINE_KEY;
        const exists = await cache.redis.exists(key);
        return exists === 1;
    }

    // async resetTTL(accountId: string, ttlSeconds: number) {
    //     const key = MAINLINE_KEY + accountId;

    //     //實現延遲 TTL 功能，ex:如果使用者有登入，就來重設TTL時間，假設是20天，只要使用者在20天有登入，就會再延長TTL為20天
    //     const isExist = await this.isExist(accountId);
    //     //先檢查鍵key是否存在
    //     if (isExist) {
    //         //設定TTL時間
    //         cache.redis.expire(key, ttlSeconds);
    //     }
    // }
}
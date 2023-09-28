import { cache } from '@serjin/common';
import { UserlineCacheService, KEY_PREFIX } from './userline.cache.service';
import Config from '../config';

export class UserlineRedisService implements UserlineCacheService {

    constructor(private ttlSeconds = Config.USERLINE_CACHE_TTL) {
    }

    //user:1 來表示使用者資料，使用 tweet:123 來表示推文。
    async create(accountId: string) {
        //使用timestamp作排序，越近的時間，數字越大
        const key = KEY_PREFIX + accountId;

        // Redis不能存在空Sorted Set，所以需放入一個"空"元素
        //Sorted Set是按照分數(score)由小排到大，設定分數(score)為零，讓"空"元素永遠自動排在最前面
        await cache.redis.zadd(key, 0, 'empty');

        //設定絕對TTL時間
        cache.redis.expire(key, this.ttlSeconds);
    }

    async read(accountId: string) {
        const key = KEY_PREFIX + accountId;

        // 根據排名查詢 0,-1:取得全部成員
        let members = await cache.redis.zrevrange(key, 0, -1);

        //去除排在最後面的"空"元素
        if (members.length > 0 && members[members.length - 1] === 'empty') {
            members = members.slice(0, members.length - 1);
        }

        //重設TTL時間 -- 實作延遲性TTL
        cache.redis.expire(key, this.ttlSeconds);

        return members;
    }

    async push(accountId: string, ...postIds: { postId: string, date: Date }[]) {
        if (postIds.length === 0) {
            return;
        }

        //更新鍵的值不會影響已經設定的 TTL，所以不需重新設定 TTL
        const key = KEY_PREFIX + accountId;

        let members: (number | string)[] = [];
        postIds.forEach((value) => {
            //以分鐘為間隔，可以將時間戳除以 60000（一分鐘的毫秒數）
            const minuteTimestamp = Math.floor(value.date.getTime() / 60000);
            members.push(minuteTimestamp);
            members.push(value.postId);
        });

        await cache.redis.zadd(key, ...members);
    }

    async delete(accountId: string, postId: string) {
        const key = KEY_PREFIX + accountId;
        // 從 Sorted Set 中刪除指定值的元素
        await cache.redis.zrem(key, postId);
    }

    // async isMembersExist(accountId: string, ...feedIds: string[]) {
    //     const key = KEY_PREFIX + accountId;

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
    async isExist(accountId: string) {
        const key = KEY_PREFIX + accountId;
        const exists = await cache.redis.exists(key);
        return exists === 1;
    }
}
import { RedisGlobal, parseJson } from '@serjin/common';
import { Feed } from '../models/feed.model';
import { FeedCacheService, KEY_PREFIX } from './feed.cache.service';

export class FeedRedisService implements FeedCacheService {

    constructor(public cache: RedisGlobal) {
    }

    //user:1 來表示使用者資料，使用 tweet:123 來表示推文。
    async set(accountId: string, feed: Feed, ttlSeconds: number) {
        const ttlSecondsInt = Math.floor(ttlSeconds);//取整數
        const key = KEY_PREFIX + accountId;
        //將序列化的物件儲存到 Redis
        const res = await this.cache.redis.set(key, JSON.stringify(feed));
        //設定絕對TTL時間
        this.cache.redis.expire(key, ttlSecondsInt);
    }

    async read(accountId: string) {
        const key = KEY_PREFIX + accountId;
        const serializedFeed = await this.cache.redis.get(key);
        let feed: Feed | null = null;
        //從 Redis 獲取序列化的物件並反序列化
        if (serializedFeed) {
            feed = this.parseSerializedFeed(serializedFeed);
        }
        return feed;
    }

    async readMany(...accoundIds: string[]) {//就算accoundIds是空陣列，mget也會得到空陣列，不會出錯
        if (accoundIds.length === 0) {
            return [];
        }

        const keys = accoundIds.map((accountId) => KEY_PREFIX + accountId);

        const serializedFeeds = await this.cache.redis.mget(keys);

        //去除不存在的鍵值，不存在的鍵會返回null
        let feeds: Feed[] = [];
        if (serializedFeeds) {
            for (const serializedFeed of serializedFeeds) {
                if (serializedFeed) {
                    feeds.push(this.parseSerializedFeed(serializedFeed))
                }
            }

        }
        return feeds;
    }

    async readManyAllowNull(...accoundIds: string[]) {//就算accoundIds是空陣列，mget也會得到空陣列，不會出錯
        const keys = accoundIds.map((accountId) => KEY_PREFIX + accountId);

        const serializedFeeds = await this.cache.redis.mget(keys);

        const feeds = serializedFeeds.map((serializedFeed) => {
            if (serializedFeed) {
                return this.parseSerializedFeed(serializedFeed);
            } else {
                return null;
            }
        });

        return feeds;
    }

    // async update(accountId: string, data: { name: string, avatar: string }) {

    //     //經測試，更新鍵值會刪除已經設定的 TTL...............................................................
    //     const key = KEY_PREFIX + accountId;
    //     const serializedFeed = await this.cache.redis.get(key);
    //     if (serializedFeed) {
    //         const feed: Feed = this.parseSerializedFeed(serializedFeed);
    //         feed.name = data.name;
    //         feed.avatar = data.avatar;
    //         await this.cache.redis.set(key, JSON.stringify(feed));
    //     }
    // }

    async delete(accountId: string) {
        //刪除一個鍵時，與該鍵相關的 TTL 也會同時被刪除，DEL 命令刪除一個鍵時，Redis 會在同時從內存中移除該鍵的數據和 TTL 設置。因此，你不需要手動刪除鍵的 TTL。
        const key = KEY_PREFIX + accountId;
        await this.cache.redis.del(key);
    }

    parseSerializedFeed(serializedFeed: string) {
        return parseJson<Feed>(serializedFeed, 'createdAt', 'closedAt')
    }
}
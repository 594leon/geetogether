import { cache } from '@serjin/common';
import { OldVersionTimelineCacheService, KEY_PREFIX } from './old-version.timeline.cache.service';

export class OldVersionTimelineRedisService implements OldVersionTimelineCacheService {

    //user:1 來表示使用者資料，使用 tweet:123 來表示推文。
    async create(accountId: string, ttlSeconds: number) {
        const key = KEY_PREFIX + accountId;

        // 使用 LPUSH 創建一個空的 List
        await cache.redis.lpush(key);

        //設定絕對TTL時間
        cache.redis.expire(key, ttlSeconds);
    }

    async read(accountId: string, page: number, pageSize: number, readAll = false) {
        const key = KEY_PREFIX + accountId;

        if (readAll) {
            // 獲取 List 的元素範圍（從索引 0 到 -1 表示全部）
            return await cache.redis.lrange(key, 0, -1);
        } else {
            // 獲取分頁的起始索引
            const start = (page - 1) * pageSize;
            // 獲取分頁的結束索引
            const end = start + pageSize - 1;
            return await cache.redis.lrange(key, start, end);
        }
    }

    async push(accountId: string, ...feedIds: string[]) {
        //更新鍵的值不會影響已經設定的 TTL，所以不需重新設定 TTL
        const key = KEY_PREFIX + accountId;

        //RPUSH：將一個或多個值添加到列表的末尾（右側）。
        //LPUSH：將一個或多個值添加到列表的開頭（左側）。
        //因為Timeline越前面的Feed日期越新，所以我們使用LPUSH，將最新的Feed排到List的開頭
        await cache.redis.lpush(key, ...feedIds);
    }

    async delete(accountId: string, feedId: string) {
        const key = KEY_PREFIX + accountId;
        // 從 List 中刪除指定值的元素（最多刪除一個）
        await cache.redis.lrem(key, 1, feedId);
    }

    // 檢查鍵 "timeline:your-accountId" 是否存在
    async isExist(accountId: string) {
        const key = KEY_PREFIX + accountId;
        const exists = await cache.redis.exists(key);
        return exists === 1;
    }

    async length(accountId: string) {
        const key = KEY_PREFIX + accountId;
        // 使用 LLEN 獲取 List 的長度
        const length = await cache.redis.llen(key);
        return length;
    }

    async resetTTL(accountId: string, ttlSeconds: number) {
        const key = KEY_PREFIX + accountId;

        //實現延遲 TTL 功能，ex:如果使用者有登入，就來重設TTL時間，假設是20天，只要使用者在20天有登入，就會再延長TTL為20天
        const isExist = await this.isExist(accountId);
        //先檢查鍵key是否存在
        if (isExist) {
            //設定TTL時間
            cache.redis.expire(key, ttlSeconds);
        }
    }
}
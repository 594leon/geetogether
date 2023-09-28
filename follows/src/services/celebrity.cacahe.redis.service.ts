import { RedisGlobal } from '@serjin/common';
import { creatKey, CelebrityCacheService } from './celebrity.cache.service';

export class CelebrityRedisService implements CelebrityCacheService {

    constructor(public cache: RedisGlobal) {
    }

    //user:1 來表示使用者資料，使用 tweet:123 來表示推文。
    async create(accountId: string, ttlSeconds: number) {
        const key = creatKey(accountId);

        const ttlSecondsInt = Math.floor(ttlSeconds);//取整數

        // 使用 SADD 創建一個空的 Set
        // Redis不能存在空 Set，所以需放入一個"空"元素
        await this.cache.redis.sadd(key, 'empty');

        //設定絕對TTL時間
        this.cache.redis.expire(key, ttlSecondsInt);
    }

    async read(accountId: string) {
        const key = creatKey(accountId);

        // 獲取 Set 的所有元素
        let celebrities = await this.cache.redis.smembers(key);

        //去掉"空"元素
        celebrities = celebrities.filter((celebId) => celebId !== 'empty');

        return celebrities;
    }

    async add(accountId: string, ...celebrityIds: string[]) {
        if (celebrityIds.length === 0) {
            return;
        }
        const key = creatKey(accountId);

        // 新增元素到 Set 中
        await this.cache.redis.sadd(key, celebrityIds);
    }

    async delete(accountId: string, ...celebrityIds: string[]) {
        const key = creatKey(accountId);

        // 從 Set 中刪除指定元素
        await this.cache.redis.srem(key, ...celebrityIds);
    }

    // 檢查鍵 "timeline:your-accountId" 是否存在
    async isExist(accountId: string) {
        const key = creatKey(accountId);
        const exists = await this.cache.redis.exists(key);
        return exists === 1;
    }

    async resetTTL(accountId: string, ttlSeconds: number) {
        const key = creatKey(accountId);
        const ttlSecondsInt = Math.floor(ttlSeconds);//取整數

        //實現延遲 TTL 功能，ex:如果使用者有登入，就來重設TTL時間，假設是20天，只要使用者在20天有登入，就會再延長TTL為20天
        const isExist = await this.isExist(accountId);
        //先檢查鍵key是否存在
        if (isExist) {
            //設定TTL時間
            this.cache.redis.expire(key, ttlSecondsInt);
        }
    }
}
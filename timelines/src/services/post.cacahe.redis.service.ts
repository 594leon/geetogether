import { cache, parseJson } from '@serjin/common';
import { Post } from '../models/post.model';
import { PostCacheService, KEY_PREFIX } from './post.cache.service';

export class PostRedisService implements PostCacheService {

    //user:1 來表示使用者資料，使用 tweet:123 來表示推文。
    async set(post: Post, ttlSeconds: number) {
        const key = KEY_PREFIX + post.id;
        const ttlSecondsInt = Math.floor(ttlSeconds);//取整數

        //將序列化的物件儲存到 Redis
        const res = await cache.redis.set(key, JSON.stringify(post));
        //設定絕對TTL時間
        cache.redis.expire(key, ttlSecondsInt);
    }

    async setMany(...elements: { post: Post, ttlSeconds: number }[]) {
        const pipeline = cache.redis.pipeline();

        elements.forEach((element) => {
            const key = KEY_PREFIX + element.post.id;
            pipeline.set(key, JSON.stringify(element.post));
            const ttlSecondsInt = Math.floor(element.ttlSeconds);//取整數
            pipeline.expire(key, ttlSecondsInt);
        });

        await pipeline.exec();
    }

    async read(postId: string) {
        const key = KEY_PREFIX + postId;
        const serializedPost = await cache.redis.get(key);
        let post: Post | null = null;
        //從 Redis 獲取序列化的物件並反序列化
        if (serializedPost) {
            post = this.parseSerializedPost(serializedPost);
        }
        return post;
    }

    async readMany(...postIds: string[]) {//就算accoundIds是空陣列，mget也會得到空陣列，不會出錯
        if (postIds.length === 0) {
            return [];
        }

        const keys = postIds.map((postId) => KEY_PREFIX + postId);

        const serializedPosts = await cache.redis.mget(keys);

        //去除不存在的鍵值，不存在的鍵會返回null
        let posts: Post[] = [];
        if (serializedPosts) {
            for (const serializedPost of serializedPosts) {
                if (serializedPost) {
                    posts.push(this.parseSerializedPost(serializedPost));
                }
            }

        }
        return posts;
    }

    // async readManyAllowNull(...accoundIds: string[]) {//就算accoundIds是空陣列，mget也會得到空陣列，不會出錯
    //     const keys = accoundIds.map((accountId) => KEY_PREFIX + accountId);

    //     const serializedFeeds = await cache.redis.mget(keys);

    //     const feeds = serializedFeeds.map((serializedFeed) => {
    //         if (serializedFeed) {
    //             return JSON.parse(serializedFeed) as Post;
    //         } else {
    //             return null;
    //         }
    //     });

    //     return feeds;
    // }

    // async update(accountId: string, data: { name: string, avatar: string }) {

    //     //經測試，更新鍵值會刪除已經設定的 TTL...............................................................
    //     const key = KEY_PREFIX + accountId;
    //     const serializedFeed = await cache.redis.get(key);
    //     if (serializedFeed) {
    //         const feed: Feed = JSON.parse(serializedFeed);
    //         feed.name = data.name;
    //         feed.avatar = data.avatar;
    //         await cache.redis.set(key, JSON.stringify(feed));
    //     }
    // }

    async delete(postId: string) {
        //刪除一個鍵時，與該鍵相關的 TTL 也會同時被刪除，DEL 命令刪除一個鍵時，Redis 會在同時從內存中移除該鍵的數據和 TTL 設置。因此，你不需要手動刪除鍵的 TTL。
        const key = KEY_PREFIX + postId;
        await cache.redis.del(key);
    }

    parseSerializedPost(serializedPost: string) {
        return parseJson<Post>(serializedPost, 'createdAt', 'closedAt', 'expiresAt')
    }
}
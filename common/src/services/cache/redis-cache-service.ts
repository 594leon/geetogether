import { cache } from "../..";
import { CacheService, CacheStatus } from "./cache-service";

export class RedisCacheService implements CacheService {

    key = 'initial_status';

    onConnected(listener: () => Promise<void>) {
        cache.onConnected(listener);
    };

    async readCacheStatus() {
        const initialStatus = await cache.redis.get(this.key);
        return initialStatus ? initialStatus as CacheStatus : CacheStatus.Uninitialized;
    }

    async setCacheStatus(cacheStatus: CacheStatus.Initializing | CacheStatus.Initialized) {
        await cache.redis.set(this.key, cacheStatus);
    }
}
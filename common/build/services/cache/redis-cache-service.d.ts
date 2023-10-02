import { CacheService, CacheStatus } from "./cache-service";
export declare class RedisCacheService implements CacheService {
    key: string;
    onConnected(listener: () => Promise<void>): void;
    readCacheStatus(): Promise<CacheStatus>;
    setCacheStatus(cacheStatus: CacheStatus.Initializing | CacheStatus.Initialized): Promise<void>;
}

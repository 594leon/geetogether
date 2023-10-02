export enum CacheStatus {
    Uninitialized = 'Uninitialized',
    Initializing = 'initializing',
    Initialized = 'Initialized',
}

export interface CacheService {
    onConnected: (listener: () => Promise<void>) => void;
    readCacheStatus: () => Promise<CacheStatus>;
    setCacheStatus: (cacheStatus: CacheStatus.Initializing | CacheStatus.Initialized) => Promise<void>;
}
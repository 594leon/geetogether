
export const KEY_PREFIX = 'timeline:';

export interface OldVersionTimelineCacheService {
    create: (accountId: string, ttlSeconds: number) => Promise<void>;
    read: (accountId: string, page: number, pageSize: number, readAll?: boolean) => Promise<string[]>;
    push: (accountId: string, ...feedIds: string[]) => Promise<void>;
    delete: (accountId: string, feedId: string) => Promise<void>;
    isExist: (accountId: string) => Promise<boolean>;
    length: (accountId: string) => Promise<number>;
    resetTTL: (accountId: string, ttlSeconds: number) => Promise<void>;
}
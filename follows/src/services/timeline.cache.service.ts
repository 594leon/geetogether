
export const KEY_PREFIX = 'timeline:';

export interface TimelineCacheService {
    create: (accountId: string, ttlSeconds: number) => Promise<void>;
    read: (accountId: string, page: number, pageSize: number, readAll?: boolean) => Promise<string[]>;
    push: (accountId: string, ...feedIds: { feedId: string, date: Date }[]) => Promise<void>;
    delete: (accountId: string, feedId: string) => Promise<void>;
    isMembersExist: (accountId: string, ...feedIds: string[]) => Promise<boolean[]>;
    isExist: (accountId: string) => Promise<boolean>;
    resetTTL: (accountId: string, ttlSeconds: number) => Promise<void>;
}
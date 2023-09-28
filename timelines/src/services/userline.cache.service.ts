
export const KEY_PREFIX = 'userline:';

export interface UserlineCacheService {
    create: (accountId: string) => Promise<void>;
    read: (accountId: string) => Promise<string[]>;
    push: (accountId: string, ...postIds: { postId: string, date: Date }[]) => Promise<void>;
    delete: (accountId: string, postId: string) => Promise<void>;
    // isMembersExist: (accountId: string, ...feedIds: string[]) => Promise<boolean[]>;
    isExist: (accountId: string) => Promise<boolean>;
    // resetTTL: (accountId: string, ttlSeconds: number) => Promise<void>;
}
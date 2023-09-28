
const KEY_PREFIX = 'celebrity:';

export const creatKey = (accountId: string) => {
    return KEY_PREFIX + accountId;
}

export interface CelebrityCacheService {
    create: (accountId: string, ttlSeconds: number) => Promise<void>;
    read: (accountId: string) => Promise<string[]>;
    add: (accountId: string, ...celebrityIds: string[]) => Promise<void>;
    delete: (accountId: string, ...celebrityIds: string[]) => Promise<void>;
    isExist: (accountId: string) => Promise<boolean>;
    resetTTL: (accountId: string, ttlSeconds: number) => Promise<void>;
}
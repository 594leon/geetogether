
export const MAINLINE_KEY = 'main_timeline';

export interface MainlineCacheService {
    create: () => Promise<void>;
    read: (page: number, pageSize: number, readAll?: boolean) => Promise<string[]>;
    add: (...postIds: { postId: string, date: Date }[]) => Promise<void>;
    delete: (postId: string) => Promise<void>;
    // isMembersExist: (accountId: string, ...feedIds: string[]) => Promise<boolean[]>;
    isExist: () => Promise<boolean>;
    // resetTTL: (accountId: string, ttlSeconds: number) => Promise<void>;
}
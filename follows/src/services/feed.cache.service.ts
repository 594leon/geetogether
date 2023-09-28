import { Feed } from '../models/feed.model';

export const KEY_PREFIX = 'feed:';

export interface FeedCacheService {
    set: (accoundId: string, feed: Feed, ttlSeconds: number) => Promise<void>;
    read: (accoundId: string) => Promise<Feed | null>;
    readMany: (...accoundIds: string[]) => Promise<Feed[]>;
    readManyAllowNull: (...accoundIds: string[]) => Promise<(Feed | null)[]>;
    // update: (accoundId: string, data: { name: string, avatar: string }) => Promise<void>;
    delete: (accoundId: string) => Promise<void>;
}
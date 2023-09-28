import { Feed } from '../models/feed.model';
import { PostStatus } from '@serjin/common';

export interface FeedService {
    withTransaction: <T>(operation: (session: any) => Promise<T>) => Promise<T>;
    find: (session?: any) => Promise<Feed[]>;
    findById: (accountId: string, session?: any) => Promise<Feed | null>;
    upsert: (accountId: string, data: { postId: string, name: string, avatar: string, title: string, status: PostStatus, celebrity: boolean, createdAt: Date, closedAt: Date }, session?: any) => Promise<number>;
    delete: (accountId: string, session?: any) => Promise<number>;
}
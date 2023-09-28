import { Post } from '../models/post.model';

export const KEY_PREFIX = 'post:';

export interface PostCacheService {
    set: (post: Post, ttlSeconds: number) => Promise<void>;
    setMany: (...elements: { post: Post, ttlSeconds: number }[]) => Promise<void>;
    read: (postId: string) => Promise<Post | null>;
    readMany: (...postIds: string[]) => Promise<Post[]>;
    // readManyAllowNull: (...accoundIds: string[]) => Promise<(Post | null)[]>;
    // update: (accoundId: string, data: { name: string, avatar: string }) => Promise<void>;
    delete: (postId: string) => Promise<void>;
}
import { Gender, PostStatus } from '@serjin/common';
import { Profile } from '../models/profile.model';
import { Post } from '../models/post.model';

export interface PostService {
    withTransaction: <T>(operation: (session: any) => Promise<T>) => Promise<T>;
    find: () => Promise<Post[]>;
    findById: (id: string) => Promise<Post | null>;
    findByAccountId: (accountId: string, session?: any) => Promise<Post[]>;
    insert: (postId: string, accountId: string, profileId: string, title: string, limitMembers: number, createdAt: Date, closedAt: Date, expiresAt: Date, status: PostStatus, session?: any) => Promise<string>;
    update: (id: string, data: { status?: PostStatus, closedAt?: Date, expiresAt?: Date }, session?: any) => Promise<number>;
    countPostsByAccountId: (accountId: string) => Promise<number>;
    delete: (postId: string, session?: any) => Promise<number>;
}
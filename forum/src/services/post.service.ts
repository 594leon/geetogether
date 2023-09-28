import { Post } from "../models/post.model";
import { PostStatus } from '@serjin/common';

export interface PostService {
    withTransaction: <T>(operation: (session: any) => Promise<T>) => Promise<T>;
    find: (session?: any) => Promise<Post[]>;
    findById: (id: string, session?: any) => Promise<Post | null>;
    findByAccountId: (accountId: string, session?: any) => Promise<Post | null>;
    insert: (id: string, accountId: string, title: string, limitMembers: number, closedAt: Date, expiresAt: Date, status: PostStatus, session?: any) => Promise<string>;
    update: (id: string, data: { status?: PostStatus, closedAt?: Date, expiresAt?: Date }, session?: any) => Promise<number>;
    increasePlayerCount: (postId: string, session?: any) => Promise<number>;
    delete: (postId: string, session?: any) => Promise<number>;
}
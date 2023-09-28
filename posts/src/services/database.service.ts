import { Gender, PostStatus } from '@serjin/common';
import { Profile } from '../models/profile.model';
import { Post } from '../models/post.model';

export default interface DatabaseService {
    withTransaction: <T>(operation: (session: any) => Promise<T>) => Promise<T>;
    findProfiles: () => Promise<Profile[]>;
    findProfileById: (id: string) => Promise<Profile | null>;
    insertProfile: (id: string, name: string, avatar: string, age: number, gender: Gender, version: number, session?: any) => Promise<string>;
    updateProfileNameWithOCC: (id: string, name: string, avatar: string, version: number, session?: any) => Promise<number>;
    findPosts: () => Promise<Post[]>;
    findPostById: (id: string) => Promise<Post | null>;
    insertPost: (accountId: string, profileId: string, title: string, content: string, limitMembers: number, expirationSeconds: number, session?: any) => Promise<string>;
    updatePost: (id: string, data: { status?: PostStatus, closedAt?: Date, expiresAt?: Date }, session?: any) => Promise<number>;
    countPostsByAccountId: (accountId: string) => Promise<number>;
    deletePost: (postId: string, session?: any) => Promise<number>;
}
import { Follow, Following, Follower } from "../models/follow.model";

export interface FollowService {
    withTransaction: <T>(operation: (session: any) => Promise<T>) => Promise<T>;
    findFollowings: (followerId: string, page: number, limit: number, session?: any) => Promise<Following[]>;
    findFollowers: (followingId: string, page: number, limit: number, session?: any) => Promise<Follower[]>;
    findFollowerIds: (followingId: string, beforeDate?: Date, session?: any) => Promise<Follow[]>;
    findAllFollowings: (followerId: string, session?: any) => Promise<Following[]>;
    insert: (followerId: string, followingId: string, session?: any) => Promise<string>;
    delete: (followerId: string, followingId: string, session?: any) => Promise<number>;
    isFollowing: (followerId: string, followingId: string) => Promise<boolean>;
}
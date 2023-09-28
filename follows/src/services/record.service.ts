import { Record } from "../models/record.model";
import { PostStatus } from '@serjin/common';

export interface RecordService {
    withTransaction: <T>(operation: (session: any) => Promise<T>) => Promise<T>;
    find: (session?: any) => Promise<Record[]>;
    findById: (id: string, session?: any) => Promise<Record | null>;
    insert: (profileId: string, session?: any) => Promise<string>;
    updateFollowingCount: (id: string, plusOrMinus: boolean, session?: any) => Promise<number>;
    updateFollowerCount: (id: string, plusOrMinus: boolean, session?: any) => Promise<number>;
}
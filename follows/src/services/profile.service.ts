import { Profile } from "../models/profile.model";

export interface ProfileService {
    withTransaction: <T>(operation: (session: any) => Promise<T>) => Promise<T>;
    find: (session?: any) => Promise<Profile[]>;
    findById: (id: string, session?: any) => Promise<Profile | null>;
    findByIds: (profileIds: string[], session?: any) => Promise<Profile[]>;
    insert: (id: string, name: string, avatar: string, age: number, version: number, session?: any) => Promise<string>;
    updateNameWithOCC: (id: string, name: string, avatar: string, version: number, session?: any) => Promise<boolean>;
    updateCelebrity: (id: string, celebrity: boolean, session?: any) => Promise<number>;
}
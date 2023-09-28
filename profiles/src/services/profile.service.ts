import { Profile } from "../models/profile.model";
import { Gender, ZodiacSign } from '@serjin/common';

export interface ProfileService {
    withTransaction: <T>(operation: (session: any) => Promise<T>) => Promise<T>;
    find: (session?: any) => Promise<Profile[]>;
    findById: (id: string, session?: any) => Promise<Profile | null>;
    insert: (id: string, name: string, age: number, gender: Gender, zodiacSign: ZodiacSign, myTags: string[], avatar: string, session?: any) => Promise<string>;
    update: (id: string, data: { name?: string, age?: number, gender?: Gender, zodiacSign?: ZodiacSign, myTags?: string[], avatar?: string }, session?: any) => Promise<number>;
    delete: (id: string) => Promise<number>;
}
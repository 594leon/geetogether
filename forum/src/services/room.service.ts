import { Room } from "../models/room.model";

export interface RoomService {
    withTransaction: <T>(operation: (session: any) => Promise<T>) => Promise<T>;
    insert: (postId: string, profiles: { accountId: string, profileId: string }[], session?: any) => Promise<string>;
    find: (session?: any) => Promise<Room[]>;
    findByPostId: (postId: string, session?: any) => Promise<Room | null>;
    findById: (id: string, session?: any) => Promise<Room | null>;
    getAccountIdsByPostId: (postId: string) => Promise<string[]>;
    getAccountIdsByRoomId: (roomId: string) => Promise<string[]>;
    delete: (roomId: string, session?: any) => Promise<number>;
}
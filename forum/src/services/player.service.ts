import { PlayerStatus } from "@serjin/common";
import { Player } from "../models/player.model";

export interface PlayerService {
    withTransaction: <T>(operation: (session: any) => Promise<T>) => Promise<T>;
    insert: (postId: string, accountId: string, profileId: string, session?: any) => Promise<string>;
    updateAllStatus: (postId: string, status: PlayerStatus, session?: any) => Promise<number>;
    updateStatus: (postId: string, playerIds: string[], status: PlayerStatus, session?: any) => Promise<number>;
    find: (session?: any) => Promise<Player[]>;
    findByPostId: (postId: string, session?: any) => Promise<Player[]>;
    findByAccountId: (accountId: string, session?: any) => Promise<Player[]>;
    findByPostIdandAccountId: (postId: string, accountId: string, session?: any) => Promise<Player | null>;
    findByIds: (postId: string, playerIds: string[], session?: any) => Promise<Player[]>;
    deleteMany: (postId: string, session?: any) => Promise<number>;
}
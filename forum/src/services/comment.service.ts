import { Comment } from "../models/comment.model";

export interface CommentService {
    withTransaction: <T>(operation: (session: any) => Promise<T>) => Promise<T>;
    find: (session?: any) => Promise<Comment[]>;
    findByRoomId: (roomId: string, page: number, limit: number, session?: any) => Promise<Comment[]>;
    insert: (roomId: string, accountId: string, text: string, session?: any) => Promise<string>;
    deleteMany: (roomId: string, session?: any) => Promise<number>;
}
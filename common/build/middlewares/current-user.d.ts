import * as Koa from 'koa';
import { AccountStatus } from '../events/status/account-status';
interface UserPayload {
    id: string;
    email: string;
    status: AccountStatus;
    exp: number;
}
declare module 'koa' {
    interface Request {
        currentUser?: UserPayload;
    }
}
declare const currentUser: (jwtKey: string) => (ctx: Koa.Context, next: Koa.Next) => Promise<void>;
export { currentUser };

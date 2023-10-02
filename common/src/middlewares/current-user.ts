import * as Koa from 'koa';
import jwt from 'jsonwebtoken';
import { AccountStatus } from '../events/status/account-status';

interface UserPayload {
    id: string;
    email: string;
    status: AccountStatus;
    exp: number;
}

declare module 'koa' {
    interface Request { //在已有的Request介面下增加currentUser屬性
        currentUser?: UserPayload;
    }
}

const currentUser = (jwtKey: string) => {

    return async (ctx: Koa.Context, next: Koa.Next) => {

        const { authorization = '' } = ctx.request.header;
        const token = authorization.replace('Bearer ', '');

        if (token) {
            try {
                const payload = jwt.verify(token, jwtKey) as jwt.JwtPayload;
                ctx.request.currentUser = payload as UserPayload;
            } catch (err) {
                console.log(err)
            }
        }

        await next();
    }
}

export { currentUser };
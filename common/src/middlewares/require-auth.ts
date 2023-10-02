import { Context, Next } from 'koa'
import { NotAuthorizedError } from '../errors/not-authorized-error'
import { TokenExpiredError } from '../errors/token-expired-error';


const requireAuth = (requireActive = true) => {
    return async (ctx: Context, next: Next) => {
        if (!ctx.request.currentUser) {
            throw new NotAuthorizedError();
        }

        const currentTimestamp = Math.floor(Date.now() / 1000);
        if (ctx.request.currentUser.exp < currentTimestamp) {
            throw new TokenExpiredError();
        }
        // if (requireActive) {
        //     if (ctx.request.currentUser.status === AccountStatus.Inactive) {
        //         throw new NotAuthorizedError();
        //     }
        // }

        await next();
    };
}

export { requireAuth };
import Router from 'koa-router';
import Config from '../config';
import { currentUser } from '@serjin/common';
import { getAccountService } from '../service-injection';

const validateTokenRoute = (accountService = getAccountService()) => {

    const router = new Router();

    router.get('/api/auth/validate', currentUser(Config.JWT_KEY), async (ctx) => {

        let accountId: string | null = null;
        if (ctx.request.currentUser) {
            const existingUser = await accountService.findById(ctx.request.currentUser.id);
            if (existingUser) {
                accountId = existingUser.id;
            }
        }

        ctx.status = 201;
        ctx.body = { accountId: accountId };
    });

    return router.routes();

}


export { validateTokenRoute };
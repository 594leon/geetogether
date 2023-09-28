import Router from 'koa-router';
import { getDatabaseService, getMessageService } from '../service-injection';
import { requireAuth } from '@serjin/common';

const findProfilesRoute = (databaseService = getDatabaseService(), messageService = getMessageService()) => {

    const router = new Router();

    router.get('/api/posts/profiles', requireAuth(), async (ctx) => {

        const profiles = await databaseService.findProfiles();
        ctx.status = 200;
        ctx.body = { profiles };

    });

    return router.routes();

}


export { findProfilesRoute };
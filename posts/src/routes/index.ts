import Router from 'koa-router';
import { getDatabaseService, getMessageService } from '../service-injection';
import { requireAuth } from '@serjin/common';

const indexRoute = (databaseService = getDatabaseService(), messageService = getMessageService()) => {

    const router = new Router();

    router.get('/api/posts', requireAuth(), async (ctx) => {

        const posts = await databaseService.findPosts();
        ctx.status = 200;
        ctx.body = { posts };

    });

    return router.routes();

}


export { indexRoute };
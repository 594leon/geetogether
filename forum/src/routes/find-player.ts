import Router from "koa-router";
import { BadRequestError, requireAuth } from '@serjin/common';
import { getPostService, getPlayerService } from '../service-injection';

const findPlayerRoute = (postService = getPostService(), playerService = getPlayerService()) => {
    const route = new Router();

    route.get('/api/forum/players/me/:postId', requireAuth(), async (ctx) => {

        const { postId } = ctx.params;

        const accountId = ctx.request.currentUser?.id!;

        const post = await postService.findById(postId);

        if (!post) {
            throw new BadRequestError('Post not found!');
        }

        const player = await playerService.findByPostIdandAccountId(postId, accountId);

        ctx.status = 201;
        ctx.body = { player };
    });

    return route.routes();
}

export { findPlayerRoute };
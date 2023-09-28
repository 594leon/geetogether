import Router from "koa-router";
import { BadRequestError, requireAuth } from '@serjin/common';
import { getPostService, getPlayerService } from '../service-injection';

const findPlayersRoute = (postService = getPostService(), playerService = getPlayerService()) => {
    const route = new Router();

    route.get('/api/forum/players/:postId', requireAuth(), async (ctx) => {

        const { postId } = ctx.params;

        const accountId = ctx.request.currentUser?.id!;

        console.log(`postId: ${postId}`);
        const post = await postService.findById(postId);

        if (!post) {
            throw new BadRequestError('Post not found!');
        }

        //只有Post作者才能查看跟挑選Player
        if (post.accountId !== accountId) {
            throw new BadRequestError('You are not the Post owner!');
        }

        const players = await playerService.findByPostId(postId);

        ctx.status = 201;
        ctx.body = { players };
    });

    return route.routes();
}

export { findPlayersRoute };
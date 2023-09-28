import Router from "koa-router";
import { BadRequestError, requireAuth } from '@serjin/common';
import { getPostService } from '../service-injection';

const findPostRoute = (postService = getPostService()) => {
    const route = new Router();

    route.get('/api/forum/posts/:postId', requireAuth(), async (ctx) => {

        const { postId } = ctx.params;
      
        const post = await postService.findById(postId);

        if (!post) {
            throw new BadRequestError('Post not found!');
        }

        ctx.status = 201;
        ctx.body = { post };
    });

    return route.routes();
}

export { findPostRoute };
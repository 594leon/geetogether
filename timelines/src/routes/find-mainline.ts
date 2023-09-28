import Router from "koa-router";
import { requireAuth, validateQuery } from '@serjin/common';
import { getMainlineCacheService, getPostCacheService, getPostService } from '../service-injection';
import Joi from "joi";

const findMainlineRoute = (mainlineCacheService = getMainlineCacheService(), postCacheService = getPostCacheService(), postService = getPostService()) => {
    const route = new Router();

    route.get('/api/timelines', requireAuth(), validateQuery(
        Joi.object({
            page: Joi.number().min(1).required(),
            limit: Joi.number().min(1).max(20).required(),
        })
    ), async (ctx) => {

        const { page, limit } = ctx.request.query;
        const _page = parseInt(page as string);
        const _limit = parseInt(limit as string);

        const isExist = await mainlineCacheService.isExist();

        console.log('Mainline Cache: ' + isExist);

        if (!isExist) {
            const posts = await postService.find();
            const elements = posts.map((post) => {
                const ttlSec = (new Date(post.expiresAt).getTime() - new Date().getTime()) / 1000;
                return {
                    post: post,
                    ttlSeconds: ttlSec
                }
            });
            await postCacheService.setMany(...elements);

            const postIds: { postId: string, date: Date }[] = posts.map((post) => {
                return {
                    postId: post.id,
                    date: post.createdAt
                }
            });
            await mainlineCacheService.create();
            await mainlineCacheService.add(...postIds)
        }

        const mainline = await mainlineCacheService.read(_page, _limit);
        const posts = await postCacheService.readMany(...mainline);

        ctx.status = 201;
        ctx.body = { posts };
    });

    return route.routes();
}

export { findMainlineRoute };
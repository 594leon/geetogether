import Router from "koa-router";
import { requireAuth } from '@serjin/common';
import { getUserlineCacheService, getPostCacheService, getPostService } from '../service-injection';
import { Post } from "../models/post.model";

const findUserlineRoute = (userlineCacheService = getUserlineCacheService(), postCacheService = getPostCacheService(), postService = getPostService()) => {
    const route = new Router();

    route.get('/api/timelines/:profileId', requireAuth(), async (ctx) => {

        const { profileId } = ctx.params;

        let posts: Post[];

        const isExist = await userlineCacheService.isExist(profileId);
        if (isExist) {
            const userline = await userlineCacheService.read(profileId);
            posts = await postCacheService.readMany(...userline);

        } else {
            posts = await postService.findByAccountId(profileId);
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
            await userlineCacheService.create(profileId);
            await userlineCacheService.push(profileId, ...postIds)
        }

        ctx.status = 201;
        ctx.body = { posts };
    });

    return route.routes();
}

export { findUserlineRoute };
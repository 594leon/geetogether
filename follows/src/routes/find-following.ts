import Router from "koa-router";
import { requireAuth } from '@serjin/common';
import { getFollowService } from '../service-injection';

const findFollowingRoute = (followService = getFollowService()) => {
    const route = new Router();

    route.get('/api/follows/me/following/:profileId', requireAuth(), async (ctx) => {

        const { profileId } = ctx.params;
        const accountId = ctx.request.currentUser!.id;

        const isFollowing = await followService.isFollowing(accountId, profileId);

        ctx.status = 201;
        ctx.body = { isFollowing };
    });

    return route.routes();
}

export { findFollowingRoute };
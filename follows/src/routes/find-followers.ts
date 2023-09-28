import Router from "koa-router";
import { requireAuth, validateQuery } from '@serjin/common';
import { getFollowService } from '../service-injection';
import Joi from "joi";

const findFollowersRoute = (followService = getFollowService()) => {
    const route = new Router();

    route.get('/api/follows/followers/:profileId', requireAuth(), validateQuery(
        Joi.object({
            page: Joi.number().min(1).required(),
            limit: Joi.number().min(1).max(20).required(),
        })
    ), async (ctx) => {

        const { profileId } = ctx.params;
        const { page, limit } = ctx.request.query;
        const _page = parseInt(page as string);
        const _limit = parseInt(limit as string);

        const followers = await followService.findFollowers(profileId, _page, _limit);

        ctx.status = 201;
        ctx.body = { followers };
    });

    return route.routes();
}

export { findFollowersRoute };
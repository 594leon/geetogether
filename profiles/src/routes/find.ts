import Router from "koa-router";
import { getProfileService } from '../service-injection';
import { requireAuth } from "@serjin/common";

const findRoute = (profileService = getProfileService()) => {
    const route = new Router();

    route.get('/api/profiles/:id', requireAuth(), async (ctx) => {
        const { id } = ctx.params;
        const profile = await profileService.findById(id);
        ctx.status = 201;
        ctx.body = { profile };
    });

    return route.routes();
}

export { findRoute };
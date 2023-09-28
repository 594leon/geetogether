import Router from "koa-router";
import { getProfileService } from '../service-injection';
import { requireAuth } from "@serjin/common";

const indexRoute = (profileService = getProfileService()) => {
    const route = new Router();

    route.get('/api/profiles', requireAuth(), async (ctx) => {
        const result = await profileService.find();
        ctx.status = 200;
        ctx.body = { result };
    });

    return route.routes();
}

export { indexRoute };
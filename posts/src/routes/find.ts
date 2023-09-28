import Router from "koa-router";
import { getDatabaseService } from '../service-injection';
import { requireAuth } from "@serjin/common";

const findRoute = (databaseService = getDatabaseService()) => {
    const route = new Router();

    route.get('/api/posts/:id', requireAuth(), async (ctx) => {
        const { id } = ctx.params;
        const post = await databaseService.findPostById(id);
        ctx.status = 201;
        ctx.body = { post };
    });

    return route.routes();
}

export { findRoute };
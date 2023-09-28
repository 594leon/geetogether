import Router from "koa-router";
import { BadRequestError, requireAuth, validateQuery } from '@serjin/common';
import { getCommentService, getRoomService } from '../service-injection';
import Joi from "joi";

const findCommentRoute = (commentService = getCommentService(), roomService = getRoomService()) => {
    const route = new Router();

    route.get('/api/forum/comments/:roomId', requireAuth(), validateQuery(
        Joi.object({
            page: Joi.number().min(1).required(),
            limit: Joi.number().min(1).max(20).required(),
        })
    ), async (ctx) => {

        const { roomId } = ctx.params;
        const accountId = ctx.request.currentUser?.id!;
        const { page, limit } = ctx.request.query;
        const _page = parseInt(page as string);
        const _limit = parseInt(limit as string);

        const memberAccountIds = await roomService.getAccountIdsByRoomId(roomId);

        if (!memberAccountIds.includes(accountId)) {
            throw new BadRequestError('You are not a member!');
        }

        const comments = await commentService.findByRoomId(roomId, _page, _limit);

        ctx.status = 201;
        ctx.body = { comments };
    });

    return route.routes();
}

export { findCommentRoute };
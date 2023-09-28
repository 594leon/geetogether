import Router from 'koa-router';
import { getCommentService, getRoomService } from '../service-injection';
import { BadRequestError, requireAuth, validateBody } from '@serjin/common';
import Joi from 'joi';

const insertCommentRoute = (commentService = getCommentService(), roomService = getRoomService()) => {

    const router = new Router();

    router.post('/api/forum/comments', requireAuth(), validateBody(
        Joi.object({
            roomId: Joi.string().required(),
            text: Joi.string().min(1).max(100).required(),
        })
    ), async (ctx) => {

        const { roomId, text } = ctx.request.body;
        const accountId = ctx.request.currentUser?.id!;

        const memberAccountIds = await roomService.getAccountIdsByRoomId(roomId);

        if (!memberAccountIds.includes(accountId)) {
            throw new BadRequestError('You are not a member!');
        }

        const insertedID = await commentService.insert(roomId, accountId, text);

        ctx.status = 201;
        ctx.body = { insertedID };
    });

    return router.routes();

}


export { insertCommentRoute };
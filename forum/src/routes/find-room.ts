import Router from "koa-router";
import { BadRequestError, requireAuth } from '@serjin/common';
import { getRoomService } from '../service-injection';

const findRoomRoute = (roomService = getRoomService()) => {
    const route = new Router();

    route.get('/api/forum/rooms/:postId', requireAuth(), async (ctx) => {

        const { postId } = ctx.params;
        const accountId = ctx.request.currentUser?.id!;

        const room = await roomService.findByPostId(postId);

        if (room) {
            const memberAccountIds = await roomService.getAccountIdsByRoomId(room.id);

            //只有Room成員才能查詢Room資訊
            if (!memberAccountIds.includes(accountId)) {
                throw new BadRequestError('You are not a member!');
            }

        }

        ctx.status = 201;
        ctx.body = { room };
    });

    return route.routes();
}

export { findRoomRoute };
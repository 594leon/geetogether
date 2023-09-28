import Router from 'koa-router';
import { getPostService, getPlayerService, getRoomService, getMessageService } from '../service-injection';
import { BadRequestError, requireAuth, validateBody, PostStatus, PlayerStatus } from '@serjin/common';
import Joi from 'joi';
import { RoomCreatedPublisher } from '../events/publishers/room-created-publisher';

const insertRoomRoute = (postService = getPostService(), playerService = getPlayerService(), roomService = getRoomService(), messageService = getMessageService()) => {

    const router = new Router();

    router.post('/api/forum/rooms', requireAuth(), validateBody(
        Joi.object({
            postId: Joi.string().required(),
            playerIds: Joi.array().items(Joi.string()).min(1).max(8).required()
        })
    ), async (ctx) => {

        const { postId, playerIds } = ctx.request.body;
        const accountId = ctx.request.currentUser?.id!;

        const post = await postService.findById(postId);
        if (!post) {
            throw new BadRequestError('Post not found!');
        }

        if (post.status !== PostStatus.Published) {
            throw new BadRequestError('Post status is not Published!');
        }

        if (post.accountId !== accountId) {
            throw new BadRequestError('Only the post author can pick!');
        }

        if ((playerIds as string[]).length > post.limitMembers) {
            throw new BadRequestError('Over the Dating Members Count!');
        }

        const players = await playerService.findByIds(postId, playerIds);

        if (players.length !== (playerIds as string[]).length) {
            throw new BadRequestError('Please select a valid player!');
        }

        const profiles = players.map((player) => { return { accountId: player.accountId, profileId: player.profile.id } });

        //Post發起人(也就是自已)也要加進去Room的成員中
        const insertedID = await roomService.insert(postId, [...profiles, { accountId: accountId, profileId: accountId }]);

        //先把所有Player狀態設為'沒選上'
        await playerService.updateAllStatus(postId, PlayerStatus.Lost);

        //再把挑選中的Player狀態設為'選中'
        const _playerIds = players.map((player) => player.id);
        await playerService.updateStatus(postId, _playerIds, PlayerStatus.Bingo);

        messageService.publish(new RoomCreatedPublisher({ postID: postId }));

        ctx.status = 201;
        ctx.body = { insertedID };
    });

    return router.routes();

}

export { insertRoomRoute };
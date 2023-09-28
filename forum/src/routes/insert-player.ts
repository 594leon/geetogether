import Router from 'koa-router';
import { getProfileService, getPostService, getPlayerService } from '../service-injection';
import { BadRequestError, requireAuth, validateBody, PostStatus } from '@serjin/common';
import Joi from 'joi';

const insertPlayerRoute = (profileService = getProfileService(), postService = getPostService(), playerService = getPlayerService()) => {

    const router = new Router();

    router.post('/api/forum/players', requireAuth(), validateBody(
        Joi.object({
            postId: Joi.string().required(),
        })
    ), async (ctx) => {

        const { postId } = ctx.request.body;
        const post = await postService.findById(postId);

        if (!post) {
            throw new BadRequestError('Post not found!');
        }

        if (post.status !== PostStatus.Published) {
            throw new BadRequestError('Post status is not Published!');
        }

        if (post.playerCount > 100) {
            throw new BadRequestError('Exceeded the maximum number of players');
        }

        const accountId = ctx.request.currentUser?.id!;

        const profile = await profileService.findById(accountId);

        if (!profile) {
            throw new BadRequestError('No profile created yet!');
        }

        //自已不能報名自已的Post
        if (accountId === post.accountId) {
            throw new BadRequestError('You cannot register for your own Post!');
        }

        //不能重覆報名
        const myself = await playerService.findByPostIdandAccountId(postId, accountId);
        if (myself) {
            throw new BadRequestError('You have signed up this Post!');
        }

        const insertedId = await playerService.insert(postId, accountId, profile.id);

        await postService.increasePlayerCount(postId);

        ctx.status = 201;
        ctx.body = { insertedId };
    });

    return router.routes();

}


export { insertPlayerRoute };
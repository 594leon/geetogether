import Router from 'koa-router';
import { getProfileService, getFollowService, getRecordService, getFeedCacheService, getTimelineCacheService } from '../service-injection';
import { BadRequestError, requireAuth, validateBody } from '@serjin/common';
import Joi from 'joi';
import Config from '../config';

const deleteFollowRoute = (feedCacheService = getFeedCacheService(), timelineCacheService = getTimelineCacheService(), profileService = getProfileService(), followService = getFollowService(), recordService = getRecordService(), celebrityCondition = Config.CELEBRITY_CONDITION, celebrityRange = Config.CELEBRITY_RANGE) => {

    const router = new Router();

    router.delete('/api/follows/:followingId', requireAuth(), async (ctx) => {

        const accountId = ctx.request.currentUser?.id!;
        const { followingId } = ctx.params;

        const follower = await profileService.findById(accountId);

        if (!follower) {
            throw new BadRequestError('You do not have Profile!');
        }

        const following = await profileService.findById(followingId);

        if (!following) {
            throw new BadRequestError('The Following User does not exist!');
        }

        //刪除追踨關係
        const insertedID = await followService.delete(follower.id, following.id);

        //自已的追踨數減1
        await recordService.updateFollowingCount(follower.id, false);

        //對方的粉絲數減1
        await recordService.updateFollowerCount(following.id, false);

        const followingRecord = await recordService.findById(following.id);
        let isFollowingCelebrity = following.celebrity;

        //判斷被follow的User是否失去名人資格
        if (following.celebrity && followingRecord && followingRecord.followerCount < (celebrityCondition - celebrityRange)) {
            await profileService.updateCelebrity(following.id, false);
            isFollowingCelebrity = false;
        }

        //退追的人如果非名人，檢查是否有發文，有就刪除Timeline快取中的FeedID
        if (!isFollowingCelebrity) {
            //檢查是否有發文
            const feed = await feedCacheService.read(following.id);
            if (feed) {
                //刪除Timeline快取中的FeedID
                await timelineCacheService.delete(accountId, feed.id);
            }
        }

        ctx.status = 201;
        ctx.body = { insertedID };
    });

    return router.routes();

}


export { deleteFollowRoute };
import Router from 'koa-router';
import { getProfileService, getFollowService, getRecordService, getTimelineCacheService, getCelebrityCacheService, getMessageService, getFeedCacheService } from '../service-injection';
import { BadRequestError, requireAuth, validateBody } from '@serjin/common';
import Joi from 'joi';
import Config from '../config';
import { FollowBecomeCelebPublisher } from '../events/publishers/follow-become-celeb-publisher';

const insertFollowRoute = (feedCacheService = getFeedCacheService(), messageService = getMessageService(), profileService = getProfileService(), followService = getFollowService(), recordService = getRecordService(), timelineCacheService = getTimelineCacheService(), celebrityCacheService = getCelebrityCacheService(), celebrityCondition = Config.CELEBRITY_CONDITION, celebrityRange = Config.CELEBRITY_RANGE) => {

    const router = new Router();

    router.post('/api/follows', requireAuth(), validateBody(
        Joi.object({
            followingId: Joi.string().required(),
        })
    ), async (ctx) => {

        const accountId = ctx.request.currentUser?.id!;
        const { followingId } = ctx.request.body;

        const follower = await profileService.findById(accountId);

        if (!follower) {
            throw new BadRequestError('You do not have Profile!');
        }

        const following = await profileService.findById(followingId);

        if (!following) {
            throw new BadRequestError('The Following User does not exist!');
        }

        if (following.id === follower.id) {
            throw new BadRequestError('You cant follow yourself!');
        }

        //不能重複追蹤
        const isFollowing = await followService.isFollowing(follower.id, following.id);
        if (isFollowing) {
            throw new BadRequestError('You are already following this user!');
        }

        //新增追踨關係
        const insertedID = await followService.insert(follower.id, following.id);

        //自已的追踨數加1
        await recordService.updateFollowingCount(follower.id, true);

        //對方的粉絲數加1
        await recordService.updateFollowerCount(following.id, true);

        const followingRecord = await recordService.findById(following.id);
        let isFollowingCelebrity = following.celebrity;

        //判斷被follow的User是否變為名人
        if (!following.celebrity && followingRecord && followingRecord.followerCount > (celebrityCondition + celebrityRange)) {
            await profileService.updateCelebrity(following.id, true);
            isFollowingCelebrity = true;

            //發送"變成名人"事件到MQ
            const createdDate = new Date();
            messageService.publish(new FollowBecomeCelebPublisher({
                accountId: following.id,
                createdAt: createdDate.toISOString(),
            }));
            console.log(`${following.id} Become Celeb!!!`);
        }

        //追踨的人如果非名人，檢查是否有發文，有就加入Timeline快取
        if (!isFollowingCelebrity) {
            //檢查是否有發文
            const feed = await feedCacheService.read(following.id);
            if (feed) {
                //加入FeedID到Timeline快取中
                console.log(`feed.createdAt: ${Object.keys(feed.createdAt)}`);
                await timelineCacheService.push(accountId, { feedId: feed.id, date: feed.createdAt });
            }
        }

        ctx.status = 201;
        ctx.body = { insertedID };
    });

    return router.routes();

}

export { insertFollowRoute };
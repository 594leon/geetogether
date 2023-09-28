import Router from "koa-router";
import { CacheStatus, requireAuth, validateQuery, ServiceUnavailableError } from '@serjin/common';
import { getFollowService, getTimelineCacheService, getFeedCacheService, getCelebrityCacheService, getCacheService } from '../service-injection';
import Joi from "joi";
import Config from "../config";

const findTimelineRoute = (cacheService = getCacheService(), timelineExpireSec = Config.TIMELINE_EXPIRE_SECONDS, followService = getFollowService(), timelineCacheService = getTimelineCacheService(), feedCacheService = getFeedCacheService(), celebrityCacheService = getCelebrityCacheService()) => {
    const route = new Router();

    route.get('/api/follows/me/timeline', requireAuth(), validateQuery(
        Joi.object({
            page: Joi.number().min(1).required(),
            pageSize: Joi.number().min(1).max(20).required(),
        })
    ), async (ctx) => {

        const accountId = ctx.request.currentUser?.id!;
        const { page, pageSize } = ctx.request.query;
        const _page = parseInt(page as string);
        const _pageSize = parseInt(pageSize as string);

        //檢查快取資料是否初始化
        const status = await cacheService.readCacheStatus();
        if (status !== CacheStatus.Initialized) {
            throw new ServiceUnavailableError('The server is preparing..., please try again later');
        }

        const isCacheExist = await timelineCacheService.isExist(accountId);

        if (isCacheExist) {
            //快取存在, 重新更新TTL時間為20天(實作'延遲性TTL')
            await timelineCacheService.resetTTL(accountId, timelineExpireSec);
            await celebrityCacheService.resetTTL(accountId, timelineExpireSec);

        } else {

            //快取不存在，代表使用者已經20天沒有登入，需要重新撈取DB資料建立快取
            const followings = await followService.findAllFollowings(accountId);

            //你追踨的一般人名單
            const normalFollowings: string[] = [];

            //你追踨的名人名單
            const celebrityFollowings: string[] = [];

            for (const follow of followings) {
                if (follow.following.celebrity) {
                    celebrityFollowings.push(follow.following.id);
                } else {
                    normalFollowings.push(follow.following.id);
                }
            }

            //新增名人名單快取
            await celebrityCacheService.create(accountId, timelineExpireSec);
            //將名人名單資料加入快取
            await celebrityCacheService.add(accountId, ...celebrityFollowings);

            //取得你追踨的一般人的發文，readMany會去掉沒有發文的ID
            const normalFollowingFeeds = await feedCacheService.readMany(...normalFollowings);

            const timeline = normalFollowingFeeds.map((feed) => {
                return { feedId: feed.id, date: feed.createdAt }
            });

            //新增timeline快取
            await timelineCacheService.create(accountId, timelineExpireSec);
            //將timeline加入快取
            await timelineCacheService.push(accountId, ...timeline);
        }



        const celebrities = await celebrityCacheService.read(accountId);
        if (celebrities.length > 0) {
            const celebrityFeedExists = await feedCacheService.readManyAllowNull(...celebrities);
            const timeLineExists = await timelineCacheService.isMembersExist(accountId, ...celebrities);

            for (let i = 0; i < celebrities.length; i++) {
                const celebId = celebrities[i];
                const celebrityFeed = celebrityFeedExists[i];
                const timeLineExist = timeLineExists[i];

                if (celebrityFeed && !timeLineExist) {
                    await timelineCacheService.push(accountId, { feedId: celebrityFeed.id, date: celebrityFeed.createdAt });

                } else if (!celebrityFeed && timeLineExist) {
                    await timelineCacheService.delete(accountId, celebId);

                }
            }
        }

        const timelineFeedIds = await timelineCacheService.read(accountId, _page, _pageSize);
        const timelineFeeds = await feedCacheService.readMany(...timelineFeedIds);

        ctx.status = 201;
        ctx.body = { timelineFeeds };
    });

    return route.routes();
}

export { findTimelineRoute };
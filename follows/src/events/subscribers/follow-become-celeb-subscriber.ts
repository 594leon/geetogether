import { Subjects, MsgChecker, FormattedSubscriber, FollowBecomeCelebEvent } from '@serjin/common';
import { getTimelineCacheService, getCelebrityCacheService, getFeedCacheService, getFeedService, getFollowService } from '../../service-injection';
import { TimelineCacheService } from '../../services/timeline.cache.service';
import { CelebrityCacheService } from '../../services/celebrity.cache.service';
import { FeedService } from '../../services/feed.service';
import { FollowService } from '../../services/follow.service';
import { FeedCacheService } from '../../services/feed.cache.service';
import Config from '../../config';

export class FollowBecomeCelebSubscriber implements FormattedSubscriber<FollowBecomeCelebEvent> {
    subject: Subjects.FollowBecomeCeleb = Subjects.FollowBecomeCeleb;

    _timelineCacheService: TimelineCacheService;
    _timelineExpireSec: number;
    _celebrityCacheService: CelebrityCacheService;
    _feedService: FeedService;
    _feedCacheService: FeedCacheService;
    _followService: FollowService;

    constructor(timelineCacheService = getTimelineCacheService(), timelineExpireSec = Config.TIMELINE_EXPIRE_SECONDS, celebrityCacheService = getCelebrityCacheService(), feedService = getFeedService(), feedCacheService = getFeedCacheService(), followService = getFollowService()) {
        this._timelineCacheService = timelineCacheService;
        this._timelineExpireSec = timelineExpireSec;
        this._celebrityCacheService = celebrityCacheService;
        this._feedService = feedService;
        this._feedCacheService = feedCacheService;
        this._followService = followService;
    }

    async onMessage(content: { accountId: string; createdAt: string; }, checker: MsgChecker) {

        const celebId = content.accountId;

        //找出這個"變成名人"的User在成名的時間(createdAt)前的粉絲
        const beforeCelebFollowers = await this._followService.findFollowerIds(celebId, new Date(content.createdAt));

        //更新這些粉絲的名人名單快取(celebrityCache)
        for (const follow of beforeCelebFollowers) {
            const followerId = follow.followerId;
            const isCacheExist = await this._celebrityCacheService.isExist(followerId);
            
            if (isCacheExist) {
               
                //增加名人到名人名單快取，另外不用考慮假如在Subscriber處理前，粉絲有重新更新名人名單，再加入一次名人就會重覆的問題，因為 Set 中重複設定值只會保留一個唯一的值。
                await this._celebrityCacheService.add(followerId, celebId);
            }
        }

        checker.ack();
    }
}
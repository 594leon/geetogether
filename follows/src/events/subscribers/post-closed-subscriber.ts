import { Subjects, MsgChecker, FormattedSubscriber, PostClosedEvent } from '@serjin/common';
import { getFeedCacheService, getFeedService, getFollowService, getProfileService, getTimelineCacheService } from '../../service-injection';
import { FeedService } from '../../services/feed.service';
import { FollowService } from '../../services/follow.service';
import { FeedCacheService } from '../../services/feed.cache.service';
import { ProfileService } from '../../services/profile.service';
import { TimelineCacheService } from '../../services/timeline.cache.service';

export class PostClosedSubscriber implements FormattedSubscriber<PostClosedEvent> {
    subject: Subjects.PostClosed = Subjects.PostClosed;

    _feedService: FeedService;
    _feedCacheService: FeedCacheService;
    _followService: FollowService;
    _timelineCacheService: TimelineCacheService;

    constructor(feedService = getFeedService(), feedCacheService = getFeedCacheService(), followService = getFollowService(), timelineCacheService = getTimelineCacheService()) {
        this._feedService = feedService;
        this._feedCacheService = feedCacheService;
        this._followService = followService;
        this._timelineCacheService = timelineCacheService;
    }

    async onMessage(content: { accountId: string; postId: string; expiresAt: string; }, checker: MsgChecker) {
        //刪除相同postId的Feed
        const feed = await this._feedService.findById(content.accountId);
        if (feed && feed.postId === content.postId) {
            await this._feedService.delete(content.accountId);
        }

        //刪除相同postId的Feed快取
        const feedCache = await this._feedCacheService.read(content.accountId);
        if (feedCache && feedCache.postId === content.postId) {
            await this._feedCacheService.delete(content.accountId);

            //刪除TimeLine快取中的FeedID
            // await this._timelineCacheService.delete(content.accountId, );

            if (!feedCache.celebrity) {
                //如果是一般人(非名人)的發文，要刪除之前Fan out到所有Follower 的 Timeline快取中的 FeedID
                const followers = await this._followService.findFollowerIds(content.accountId);
                for (const follow of followers) {
                    const followerId = follow.followerId;
                    //檢查follower的快取是否存在
                    const isCacheExist = await this._timelineCacheService.isExist(followerId);
                    if (isCacheExist) {
                        //刪除TimeLine快取中的FeedID
                        await this._timelineCacheService.delete(followerId, content.accountId);
                    }
                }
            }
        }
        checker.ack();
    }
}
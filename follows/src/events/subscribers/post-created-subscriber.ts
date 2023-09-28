import { Subjects, MsgChecker, FormattedSubscriber, PostCreatedEvent, PostStatus, InternalError } from '@serjin/common';
import { getFeedCacheService, getFeedService, getFollowService, getProfileService, getTimelineCacheService } from '../../service-injection';
import { FeedService } from '../../services/feed.service';
import { FollowService } from '../../services/follow.service';
import { FeedCacheService } from '../../services/feed.cache.service';
import { ProfileService } from '../../services/profile.service';
import { TimelineCacheService } from '../../services/timeline.cache.service';

export class PostCreatedSubscriber implements FormattedSubscriber<PostCreatedEvent> {
    subject: Subjects.PostCreated = Subjects.PostCreated;

    _feedService: FeedService;
    _feedCacheService: FeedCacheService;
    _followService: FollowService;
    _profileService: ProfileService;
    _timelineCacheService: TimelineCacheService;

    constructor(feedService = getFeedService(), feedCacheService = getFeedCacheService(), followService = getFollowService(), profileService = getProfileService(), timelineCacheService = getTimelineCacheService()) {
        this._feedService = feedService;
        this._feedCacheService = feedCacheService;
        this._followService = followService;
        this._profileService = profileService;
        this._timelineCacheService = timelineCacheService;
    }

    async onMessage(content: { id: string; accountId: string; profile: { name: string; avatar: string; }; title: string; content: string; createdAt: string; closedAt: string; expiresAt: string; status: PostStatus; }, checker: MsgChecker) {

        const profile = await this._profileService.findById(content.accountId);
        if (!profile) {
            console.log('Profile not Found!');
            throw new InternalError();
        }

        //新增or更新Feed
        await this._feedService.upsert(content.accountId, {
            postId: content.id,
            name: content.profile.name,
            avatar: content.profile.avatar,
            title: content.title,
            status: content.status,
            celebrity: profile.celebrity,
            createdAt: new Date(content.createdAt),
            closedAt: new Date(content.closedAt)
        });

        const feed = await this._feedService.findById(content.accountId);
        if (feed) {
            const ttlSec = Math.floor((new Date(content.closedAt).getTime() - new Date().getTime()) / 1000);//取整數
            console.log(`ttlSec: ${ttlSec}`);

            //將新的Feed內容加入快取
            await this._feedCacheService.set(content.accountId, feed, ttlSec);

            if (!feed.celebrity) {
                //如果是一般人(非名人)的發文，Fan out到他所有Follower 的 Timeline快取
                const followers = await this._followService.findFollowerIds(content.accountId);
                for (const follow of followers) {
                    const followerId = follow.followerId;
                    const isCacheExist = await this._timelineCacheService.isExist(followerId);
                    if (isCacheExist) {

                        //再加入最新Feed到Timeline, 因為是Sorted Set，如果存在舊的FeedID，會直接更新該FeedID的Score值(也就是我們輸入的createdAt)，再自動依日期小到大排序
                        await this._timelineCacheService.push(followerId, { feedId: feed.id, date: feed.createdAt });
                    }
                }
            }
        }

        checker.ack();
    }
}
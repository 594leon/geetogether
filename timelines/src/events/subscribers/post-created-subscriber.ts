import { Subjects, MsgChecker, FormattedSubscriber, PostCreatedEvent, PostStatus, InternalError } from '@serjin/common';
import { getPostService, getProfileService, getPostCacheService, getUserlineCacheService, getMainlineCacheService } from '../../service-injection';
import { PostService } from '../../services/post.service';
import { PostCacheService } from '../../services/post.cache.service';
import { ProfileService } from '../../services/profile.service';
import { UserlineCacheService } from '../../services/userline.cache.service';
import { MainlineCacheService } from '../../services/mainline.cache.service';

export class PostCreatedSubscriber implements FormattedSubscriber<PostCreatedEvent> {
    subject: Subjects.PostCreated = Subjects.PostCreated;

    _postService: PostService;
    _postCacheService: PostCacheService;
    _profileService: ProfileService;
    _userlineCacheService: UserlineCacheService;
    _mainlineCacheService: MainlineCacheService;

    constructor(postService = getPostService(), postCacheService = getPostCacheService(), profileService = getProfileService(), userlineCacheService = getUserlineCacheService(), mainlineCacheService = getMainlineCacheService()) {
        this._postService = postService;
        this._postCacheService = postCacheService;
        this._profileService = profileService;
        this._userlineCacheService = userlineCacheService;
        this._mainlineCacheService = mainlineCacheService;
    }

    async onMessage(content: { id: string; accountId: string; profile: { name: string; avatar: string; }; title: string; content: string; limitMembers: number; createdAt: string; closedAt: string; expiresAt: string; status: PostStatus; }, checker: MsgChecker) {
        const profile = await this._profileService.findById(content.accountId);
        if (!profile) {
            console.log('Profile not Found!');
            throw new InternalError();
        }

        //新增Post
        await this._postService.insert(
            content.id,
            content.accountId,
            profile.id,
            content.title,
            content.limitMembers,
            new Date(content.createdAt),
            new Date(content.closedAt),
            new Date(content.expiresAt),
            content.status
        );

        const post = await this._postService.findById(content.id);
        if (!post) {
            console.log('Feed not Found!');
            throw new InternalError();
        }

        const ttlSec = (new Date(content.expiresAt).getTime() - new Date().getTime()) / 1000;

        //將新的Post內容加入快取
        await this._postCacheService.set(post, ttlSec);

        //將PostId 加到User Timeline快取
        await this._userlineCacheService.push(profile.id, { postId: post.id, date: post.createdAt });

        //將PostId 加到Main Timeline快取
        await this._mainlineCacheService.add({ postId: post.id, date: post.createdAt });

        checker.ack();
    }
}
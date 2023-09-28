import { Subjects, MsgChecker, FormattedSubscriber, PostClosedEvent, PostStatus, InternalError } from '@serjin/common';
import { getPostService, getProfileService, getPostCacheService, getUserlineCacheService, getMainlineCacheService } from '../../service-injection';
import { PostService } from '../../services/post.service';
import { PostCacheService } from '../../services/post.cache.service';
import { ProfileService } from '../../services/profile.service';
import { UserlineCacheService } from '../../services/userline.cache.service';
import { MainlineCacheService } from '../../services/mainline.cache.service';

export class PostClosedSubscriber implements FormattedSubscriber<PostClosedEvent> {
    subject: Subjects.PostClosed = Subjects.PostClosed;

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

    async onMessage(content: { accountId: string; postId: string; expiresAt: string; }, checker: MsgChecker) {

        //更改Post的status
        await this._postService.update(content.postId, {
            status: PostStatus.Closed,
            expiresAt: new Date(content.expiresAt)
        });

        const post = await this._postService.findById(content.postId);
        if (!post) {
            console.log('Post not Found!');
            throw new InternalError();
        }

        //更改Post快取的status
        const ttlSec = (new Date(content.expiresAt).getTime() - new Date().getTime()) / 1000;
        await this._postCacheService.set(post, ttlSec);

        //Main Timeline只顯示PostStatus.Published狀態的Post，所以要刪掉Main Timeline的對應Post ID
        await this._mainlineCacheService.delete(post.id);

        checker.ack();
    }
}
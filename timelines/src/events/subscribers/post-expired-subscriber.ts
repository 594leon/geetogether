import { Subjects, MsgChecker, FormattedSubscriber, PostExpiredEvent } from '@serjin/common';
import { getPostService, getPostCacheService, getUserlineCacheService, getMainlineCacheService } from '../../service-injection';
import { PostService } from '../../services/post.service';
import { PostCacheService } from '../../services/post.cache.service';
import { UserlineCacheService } from '../../services/userline.cache.service';
import { MainlineCacheService } from '../../services/mainline.cache.service';

export class PostExpiredSubscriber implements FormattedSubscriber<PostExpiredEvent> {
    subject: Subjects.PostExpired = Subjects.PostExpired;

    _postService: PostService;
    _postCacheService: PostCacheService;
    _userlineCacheService: UserlineCacheService;
    _mainlineCacheService: MainlineCacheService;

    constructor(postService = getPostService(), postCacheService = getPostCacheService(), userlineCacheService = getUserlineCacheService(), mainlineCacheService = getMainlineCacheService()) {
        this._postService = postService;
        this._postCacheService = postCacheService;
        this._userlineCacheService = userlineCacheService;
        this._mainlineCacheService = mainlineCacheService;
    }

    async onMessage(content: { accountId: string; postId: string; }, checker: MsgChecker) {
        //刪除Post
        await this._postService.delete(content.postId);

        //刪除Post快取
        await this._postCacheService.delete(content.postId);

        //刪掉Main Timeline的對應Post ID
        await this._mainlineCacheService.delete(content.postId);

        //刪掉User Timeline的對應Post ID
        await this._userlineCacheService.delete(content.accountId, content.postId);

        checker.ack();
    }
}
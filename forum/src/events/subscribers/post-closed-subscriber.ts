import { Subjects, MsgChecker, FormattedSubscriber, PostStatus, PostClosedEvent } from '@serjin/common';
import { getPostService } from '../../service-injection';
import { PostService } from '../../services/post.service';

export class PostClosedSubscriber implements FormattedSubscriber<PostClosedEvent> {
    subject: Subjects.PostClosed = Subjects.PostClosed;

    _postService: PostService;

    constructor(postService = getPostService()) {
        this._postService = postService
    }
    async onMessage(content: { accountId: string; postId: string; expiresAt: string; }, checker: MsgChecker) {
        this._postService.update(content.postId, { status: PostStatus.Closed, expiresAt: new Date(content.expiresAt) });
        checker.ack();
    }
}
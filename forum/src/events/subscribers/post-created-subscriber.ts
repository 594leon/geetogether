import { Subjects, MsgChecker, FormattedSubscriber, PostCreatedEvent, PostStatus } from '@serjin/common';
import { getPostService } from '../../service-injection';
import { PostService } from '../../services/post.service';

export class PostCreatedSubscriber implements FormattedSubscriber<PostCreatedEvent> {
    subject: Subjects.PostCreated = Subjects.PostCreated;

    _postService: PostService;

    constructor(postService = getPostService()) {
        this._postService = postService
    }

    async onMessage(content: { id: string; accountId: string; profile: { name: string; avatar: string; }; title: string; content: string; limitMembers: number; createdAt: string; closedAt: string; expiresAt: string; status: PostStatus; }, checker: MsgChecker) {
        this._postService.insert(
            content.id,
            content.accountId,
            content.title,
            content.limitMembers,
            new Date(content.closedAt),
            new Date(content.expiresAt),
            content.status
        );
        checker.ack();
    }
}
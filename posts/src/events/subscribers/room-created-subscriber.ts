import { Subjects, MsgChecker, FormattedSubscriber, RoomCreatedEvent, MessageService, PostStatus } from '@serjin/common';
import { getDatabaseService, getMessageService } from '../../service-injection';
import DatabaseService from '../../services/database.service';
import Config from '../../config';
import { PostClosedPublisher } from '../publishers/post-closed-publisher';

export class RoomCreatedSubscriber implements FormattedSubscriber<RoomCreatedEvent> {
    subject: Subjects.RoomCreated = Subjects.RoomCreated;

    _databaseService: DatabaseService;
    _messageService: MessageService;
    _expirationSeconds: number;

    constructor(databaseService = getDatabaseService(), messageService = getMessageService(), expirationSeconds = Config.POST_EXPIRATION_SECONDS) {
        this._databaseService = databaseService;
        this._messageService = messageService;
        this._expirationSeconds = expirationSeconds;
    }

    async onMessage(content: { postID: string; }, checker: MsgChecker) {
        const post = await this._databaseService.findPostById(content.postID);
        if (post?.status === PostStatus.Published) {
            const expiresDate = new Date();
            expiresDate.setSeconds(expiresDate.getSeconds() + this._expirationSeconds);

            await this._databaseService.updatePost(post.id, { status: PostStatus.Closed, expiresAt: expiresDate })

            this._messageService.publish(new PostClosedPublisher({
                accountId: post.accountId,
                postId: post.id,
                expiresAt: expiresDate.toISOString()
            }));
        }
        checker.ack();
    }
}
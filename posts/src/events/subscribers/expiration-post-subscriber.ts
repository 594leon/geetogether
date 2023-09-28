import { Subjects, MsgChecker, FormattedSubscriber, ExpirationPostEvent, PostStatus, MessageService } from '@serjin/common';
import { getDatabaseService, getMessageService } from '../../service-injection';
import DatabaseService from '../../services/database.service';
import { PostClosedPublisher } from '../publishers/post-closed-publisher';
import { PostExpiredPublisher } from '../publishers/post-expired-publisher';

export class ExpirationPostSubscriber implements FormattedSubscriber<ExpirationPostEvent> {
    subject: Subjects.ExpirationPost = Subjects.ExpirationPost;

    _databaseService: DatabaseService;
    _messageService: MessageService;

    constructor(databaseService = getDatabaseService(), messageService = getMessageService()) {
        this._databaseService = databaseService;
        this._messageService = messageService;
    }
    async onMessage(content: { postID: string; sourceStatus: PostStatus; }, checker: MsgChecker) {
        const post = await this._databaseService.findPostById(content.postID);

        //收到PostStatus.Published過期通知，且自已狀態也還是PostStatus.Published，便將Post轉為Closed
        if (post?.status === PostStatus.Published && content.sourceStatus === PostStatus.Published) {
            await this._databaseService.updatePost(post.id, { status: PostStatus.Closed });
            this._messageService.publish(new PostClosedPublisher({
                accountId: post.accountId,
                postId: post.id,
                expiresAt: post.expiresAt.toISOString()
            }));

            //收到PostStatus.Closed過期通知，且自已狀態也還是PostStatus.Closed，便將Post轉為Expired，也就是刪除所有Post相關資料
        } else if (post?.status === PostStatus.Closed && content.sourceStatus === PostStatus.Closed) {
            // await this._databaseService.updatePost(post.id, { status: PostStatus.Expired });

            await this._databaseService.deletePost(post.id);

            this._messageService.publish(new PostExpiredPublisher({
                accountId: post.accountId,
                postId: post.id
            }));
        }
        checker.ack();
    }
}
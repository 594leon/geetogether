import { Subjects, MsgChecker, FormattedSubscriber, PostClosedEvent, PostStatus } from '@serjin/common';
import expirationQueue from '../../queues/expiration-queue';

export class PostClosedSubscriber implements FormattedSubscriber<PostClosedEvent> {
    subject: Subjects.PostClosed = Subjects.PostClosed;

    async onMessage(content: { postId: string; expiresAt: string; }, checker: MsgChecker) {
        let delay = new Date(content.expiresAt).getTime() - new Date().getTime();
        if (delay < 0) {
            delay = 1000;
        }
        console.log(`Waiting this ${delay} milliseonds to process the job`);

        await expirationQueue.add(
            {
                postId: content.postId,
                sourceStatus: PostStatus.Closed
            },
            delay
        );

        checker.ack();
    }
}
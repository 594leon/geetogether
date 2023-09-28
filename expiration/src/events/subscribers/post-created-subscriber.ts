import { Subjects, MsgChecker, FormattedSubscriber, PostCreatedEvent, PostStatus } from '@serjin/common';
import expirationQueue from '../../queues/expiration-queue';

export class PostCreatedSubscriber implements FormattedSubscriber<PostCreatedEvent> {
    subject: Subjects.PostCreated = Subjects.PostCreated;

    async onMessage(content: { id: string; accountId: string; profile: { name: string; avatar: string; }; title: string; content: string; createdAt: string; closedAt: string; expiresAt: string; status: PostStatus; }, checker: MsgChecker) {
        let delay = new Date(content.closedAt).getTime() - new Date().getTime();
        if (delay < 0) {
            delay = 1000;
        }
        console.log(`Waiting this ${delay} milliseonds to process the job`);

        await expirationQueue.add(
            {
                postId: content.id,
                sourceStatus: PostStatus.Published
            },
            delay
        );

        checker.ack();
    }
}
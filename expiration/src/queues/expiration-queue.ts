import Bull from 'bull';
import Config from '../config';
import { ExpirationPostPublisher } from '../events/publishers/expiration-post-publisher';
import { getMessageService } from '../service-injection';
import { PostStatus } from '@serjin/common';

interface Payload {
    postId: string;
    sourceStatus: PostStatus;
}

class ExpirationQueue {
    queueName = 'post:expiration';
    private _queue: Bull.Queue<Payload> | undefined;

    init() {
        console.log(`Config.REDIS_HOST: ${Config.REDIS_HOST}`);

        //建立Bull的Task Queue
        this._queue = new Bull<Payload>(this.queueName, {
            redis: {
                host: Config.REDIS_HOST
            }
        });

        //從Queue拉回(Pull) Job
        this._queue.process((job) => {
            getMessageService().publish(new ExpirationPostPublisher({
                postID: job.data.postId,
                sourceStatus: job.data.sourceStatus
            }));
        });
    }

    async add(data: Payload, delayMilliseonds: number) {
        await this.queue.add(
            data,
            {
                delay: delayMilliseonds
            }
        );

    }

    public get queue(): Bull.Queue<Payload> {
        if (!this._queue) {
            throw new Error('Value Bull.Queue not initializer!')
        }
        return this._queue;
    }
}

export default new ExpirationQueue();

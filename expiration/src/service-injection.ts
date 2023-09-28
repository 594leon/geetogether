import Config from './config';
import { rabbit, MessageService, RabbitmqMessageService, Subjects } from '@serjin/common';
import { PostCreatedSubscriber } from './events/subscribers/post-created-subscriber';
import { PostClosedSubscriber } from './events/subscribers/post-closed-subscriber';
import expirationQueue from './queues/expiration-queue';

const initService = async () => {

    //啟動Bull Queue
    expirationQueue.init();

    console.log('Config.RABBIT_USERNAME: ' + Config.RABBIT_USERNAME);
    console.log('Config.RABBIT_PASSWORD: ' + Config.RABBIT_PASSWORD);
    await rabbit.connect(
        Config.RABBIT_HOST,
        Config.RABBIT_PORT,
        Config.RABBIT_QUEUE,
        Config.RABBIT_USERNAME,
        Config.RABBIT_PASSWORD,
        [Subjects.ExpirationPost, Subjects.PostCreated, Subjects.PostClosed],
        [new PostCreatedSubscriber(), new PostClosedSubscriber()],
        Config.RABBIT_SECRET,
        Config.K8S_NAMESPACE
    );
}

const closeService = async () => {
    await rabbit.close();
}

//factory pattern
const getMessageService = (): MessageService => {
    return new RabbitmqMessageService();
}

export { initService, closeService, getMessageService };
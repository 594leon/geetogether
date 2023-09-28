import Config from './config';
import { mongo, cache, rabbit, MessageService, RabbitmqMessageService, Subjects } from '@serjin/common';
import { ProfileService } from './services/profile.service';
import { ProfileMongoService } from './services/profile.mongo.service';
import { ProfileCompletedSubscriber } from './events/subscribers/profile-completed-subscriber';
import { ProfileUpdatedSubscriber } from './events/subscribers/profile-updated-subscriber';
import { PostCreatedSubscriber } from './events/subscribers/post-created-subscriber';
import { PostClosedSubscriber } from './events/subscribers/post-closed-subscriber';
import { PostExpiredSubscriber } from './events/subscribers/post-expired-subscriber'
import { PostService } from './services/post.service';
import { PostMongoService } from './services/post.mongo.service';
import { PostCacheService } from './services/post.cache.service';
import { PostRedisService } from './services/post.cacahe.redis.service';
import { MainlineCacheService } from './services/mainline.cache.service';
import { MainlineRedisService } from './services/mainline.cacahe.redis.service';
import { UserlineCacheService } from './services/userline.cache.service';
import { UserlineRedisService } from './services/userline.cache.redis.service';

const initService = async () => {

    //連接MongoDB
    await mongo.connectToMongoDB(Config.MONGO_URI, Config.MONGO_DB_NAME);

    //連接Redis
    await cache.connect(Config.REDIS_HOST, Config.REDIS_PORT);

    //連接RabbitMQ
    console.log('Config.RABBIT_USERNAME: ' + Config.RABBIT_USERNAME);
    console.log('Config.RABBIT_PASSWORD: ' + Config.RABBIT_PASSWORD);
    await rabbit.connect(
        Config.RABBIT_HOST,
        Config.RABBIT_PORT,
        Config.RABBIT_QUEUE,
        Config.RABBIT_USERNAME,
        Config.RABBIT_PASSWORD,
        [Subjects.PostCreated, Subjects.PostClosed, Subjects.PostExpired, Subjects.ProfileCompleted, Subjects.ProfileUpdated],
        [new ProfileCompletedSubscriber(), new ProfileUpdatedSubscriber(), new PostCreatedSubscriber(), new PostClosedSubscriber(), new PostExpiredSubscriber()],
        Config.RABBIT_SECRET,
        Config.K8S_NAMESPACE
    );
}

const closeService = async () => {
    await mongo.close();
    await rabbit.close();
    await cache.close();
}

//factory pattern
const getProfileService = (): ProfileService => {
    //根據條件來決定使用哪一個database，目前只有mongodb所以直接創建ProfileMongoService
    return new ProfileMongoService();
}

//factory pattern
const getMessageService = (): MessageService => {
    return new RabbitmqMessageService();
}

//factory pattern
const getPostService = (): PostService => {
    return new PostMongoService();
}

//factory pattern
const getPostCacheService = (): PostCacheService => {
    return new PostRedisService();
}

//factory pattern
const getMainlineCacheService = (): MainlineCacheService => {
    return new MainlineRedisService();
}

//factory pattern
const getUserlineCacheService = (): UserlineCacheService => {
    return new UserlineRedisService();
}


export {
    initService,
    closeService,
    getProfileService,
    getMessageService,
    getPostService,
    getPostCacheService,
    getMainlineCacheService,
    getUserlineCacheService
};
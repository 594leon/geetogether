import Config from './config';
import { mongo, cache, rabbit, MessageService, RabbitmqMessageService, Subjects, CacheService, RedisCacheService } from '@serjin/common';
import { ProfileService } from './services/profile.service';
import { ProfileMongoService } from './services/profile.mongo.service';
import { FeedService } from './services/feed.service';
import { FeedMongoService } from './services/feed.mongo.service';
import { FollowService } from './services/follow.service';
import { FollowMongoService } from './services/follow.mongo.service';
import { RecordService } from './services/record.service';
import { RecordMongoService } from './services/record.mongo.service';
import { ProfileCompletedSubscriber } from './events/subscribers/profile-completed-subscriber';
import { ProfileUpdatedSubscriber } from './events/subscribers/profile-updated-subscriber';
import { PostCreatedSubscriber } from './events/subscribers/post-created-subscriber';
import { PostClosedSubscriber } from './events/subscribers/post-closed-subscriber';
import { FollowBecomeCelebSubscriber } from './events/subscribers/follow-become-celeb-subscriber';
import { AccountCreatedSubscriber } from './events/subscribers/account-created-subscriber';
import { followIndexes } from './models/follow.mongo.model';
import { FeedCacheService } from './services/feed.cache.service';
import { FeedRedisService } from './services/feed.cacahe.redis.service';
import { TimelineCacheService } from './services/timeline.cache.service';
import { TimelineRedisService } from './services/timeline.cacahe.redis.service';
import { CelebrityCacheService } from './services/celebrity.cache.service';
import { CelebrityRedisService } from './services/celebrity.cacahe.redis.service';

const initService = async () => {

    //連接MongoDB
    await mongo.connectToMongoDB(Config.MONGO_URI, Config.MONGO_DB_NAME, ...followIndexes);

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
        [
            Subjects.PostCreated,
            Subjects.ProfileCompleted,
            Subjects.ProfileUpdated,
            Subjects.PostClosed,
            Subjects.FollowBecomeCeleb,
            Subjects.AccountCreated,
        ],
        [
            new ProfileCompletedSubscriber(),
            new ProfileUpdatedSubscriber(),
            new PostCreatedSubscriber(),
            new PostClosedSubscriber(),
            new FollowBecomeCelebSubscriber(),
            new AccountCreatedSubscriber()
        ],
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
    return new ProfileMongoService(mongo);
}

//factory pattern
const getFeedService = (): FeedService => {
    return new FeedMongoService(mongo);
}

//factory pattern
const getFollowService = (): FollowService => {
    return new FollowMongoService(mongo);
}

//factory pattern
const getRecordService = (): RecordService => {
    return new RecordMongoService(mongo);
}

//factory pattern
const getMessageService = (): MessageService => {
    return new RabbitmqMessageService();
}

//factory pattern
const getFeedCacheService = (): FeedCacheService => {
    return new FeedRedisService(cache);
}

//factory pattern
const getTimelineCacheService = (): TimelineCacheService => {
    return new TimelineRedisService(cache);
}

//factory pattern
const getCelebrityCacheService = (): CelebrityCacheService => {
    return new CelebrityRedisService(cache);
}

//factory pattern
const getCacheService = (): CacheService => {
    return new RedisCacheService();
}


export {
    initService,
    closeService,
    getProfileService,
    getFeedService,
    getMessageService,
    getFollowService,
    getRecordService,
    getFeedCacheService,
    getTimelineCacheService,
    getCelebrityCacheService,
    getCacheService
};
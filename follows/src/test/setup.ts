import { MongoMemoryServer } from 'mongodb-memory-server';
import { RedisMemoryServer } from 'redis-memory-server';
import { MessageService, RedisCacheService, cache, mongo } from '@serjin/common';
import Config from '../config';
import { initApp } from '../app';
import { ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken';
import { ProfileMongoService } from '../services/profile.mongo.service';
import { FeedMongoService } from '../services/feed.mongo.service';
import { RecordMongoService } from '../services/record.mongo.service';
import { FollowMongoService } from '../services/follow.mongo.service';
import { FeedRedisService } from '../services/feed.cacahe.redis.service';
import { TimelineRedisService } from '../services/timeline.cacahe.redis.service';
import { CelebrityRedisService } from '../services/celebrity.cacahe.redis.service';

declare global {
    function signin(): Promise<{ token: string, payload: { id: string; email: string; } }>;
}

let mongoServer: MongoMemoryServer;
let redisServer: RedisMemoryServer;

const fakeMessageService: MessageService = {
    publish: jest.fn()
};

jest.mock('../service-injection', () => ({
    getMessageService: () => fakeMessageService,
    getProfileService: () => new ProfileMongoService(mongo),
    getFeedService: () => new FeedMongoService(mongo),
    getFollowService: () => new FollowMongoService(mongo),
    getRecordService: () => new RecordMongoService(mongo),
    getFeedCacheService: () => new FeedRedisService(cache),
    getTimelineCacheService: () => new TimelineRedisService(cache),
    getCelebrityCacheService: () => new CelebrityRedisService(cache),
    getCacheService: () => new RedisCacheService(),
}));

//所有unit test開始前執行
beforeAll(async () => {
    Config.JWT_KEY = 'gginin';
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    console.log('MongoMemoryServer Uri: ' + mongoUri);
    Config.MONGO_URI = mongoUri;
    Config.MONGO_DB_NAME = 'auth';
    await mongo.connectToMongoDB(Config.MONGO_URI, Config.MONGO_DB_NAME);



    //建立Redis Server
    redisServer = new RedisMemoryServer();
    Config.REDIS_HOST = await redisServer.getHost();
    Config.REDIS_PORT = await redisServer.getPort();


    //連接Redis Server
    await cache.connect(Config.REDIS_HOST, Config.REDIS_PORT);



    initApp();
});


//每個unit test開始前會執行
beforeEach(async () => {
    //刪除mongodb所有資料
    (await mongo.db.collections()).forEach((collection) => {
        collection.deleteMany({}); //傳入一個空的filter物件，會把collection裡的所有Document刪除
    })
});


//所有unit test結束後執行
afterAll(async () => {
    if (mongoServer) {
        await mongo.close();
        await mongoServer.stop();
    }
    if (redisServer) {
        await cache.close();
        await redisServer.stop();
    }
});

global.signin = async () => {

    const payload = {
        id: new ObjectId().toHexString(),
        email: 'test@test.com'
    }

    const token = jwt.sign(payload, Config.JWT_KEY);

    return { token, payload };
}
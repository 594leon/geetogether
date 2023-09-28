import { MongoMemoryServer } from 'mongodb-memory-server';
import { MessageService, mongo } from '@serjin/common';
import Config from '../config';
import request from 'supertest';
import { app, initApp } from '../app';
import AccountMongoService from '../services/account.mongo.service';

declare global {
    function signin(): Promise<string>;
}

let mongodb: MongoMemoryServer;

const fakeMessageService: MessageService = {
    publish: jest.fn()
};

jest.mock('../service-injection', () => ({
    getMessageService: () => fakeMessageService,
    getAccountService: () => new AccountMongoService(mongo)
}));

//所有unit test開始前執行
beforeAll(async () => {
    Config.JWT_KEY = 'gginin';
    mongodb = await MongoMemoryServer.create();
    const mongoUri = mongodb.getUri();
    console.log('MongoMemoryServer Uri: ' + mongoUri);
    Config.MONGO_URI = mongoUri;
    Config.MONGO_DB_NAME = 'auth';
    await mongo.connectToMongoDB(Config.MONGO_URI, Config.MONGO_DB_NAME);
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
    if (mongodb) {
        await mongodb.stop();
        await mongo.close();
    }
});

global.signin = async () => {
    const authResponse = await request(app.callback())//koa要呼叫.callback()回傳request handler callback for node's native http/http2 server.讓supertest可以發送request
        .post('/api/auth/signup')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(201);

    return authResponse.body.token;
}
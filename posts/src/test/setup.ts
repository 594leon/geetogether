import { MongoMemoryServer } from 'mongodb-memory-server';
import { MessageService, mongo } from '@serjin/common';
import Config from '../config';
import { initApp } from '../app';
import { ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken';
import MongoService from '../services/mongo.service';

declare global {
    function signin(): Promise<{ token: string, payload: { id: string; email: string; } }>;
}

let mongodb: MongoMemoryServer;

const fakeMessageService: MessageService = {
    publish: jest.fn()
};

jest.mock('../service-injection', () => ({
    getMessageService: () => fakeMessageService,
    getDatabaseService: () => new MongoService(mongo)
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

    const payload = {
        id: new ObjectId().toHexString(),
        email: 'test@test.com'
    }

    const token = jwt.sign(payload, Config.JWT_KEY);

    return { token, payload };
}
import { MongoMemoryServer } from 'mongodb-memory-server';
import * as serviceInjection from '../service-injection'
import { mongo } from '@serjin/common';
import Config from '../config';
import { initApp } from '../app';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';

declare global {
    function signin(): Promise<string>;
}

let mongodb: MongoMemoryServer;

//所有unit test開始前執行
beforeAll(async () => {
    mongodb = await MongoMemoryServer.create();
    const mongoUri = mongodb.getUri();
    console.log('MongoMemoryServer Uri: ' + mongoUri);
    Config.MONGO_URI = mongoUri;
    Config.MONGO_DB_NAME = 'profiles';
    Config.JWT_KEY = 'gginin';
    await serviceInjection.initService();
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
    }
    await serviceInjection.closeService();
});

global.signin = async () => {

    const payload = {
        id: new ObjectId().toHexString(),
        email: 'test@test.com'
    }

    const token = jwt.sign(payload, Config.JWT_KEY);

    return token;
}
import { MessageService, mongo } from '@serjin/common';
import Config from '../config';
import { initApp } from '../app';
import { ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken';

declare global {
    function signin(): Promise<{ token: string, payload: { id: string; email: string; } }>;
}

const fakeMessageService: MessageService = {
    publish: jest.fn()
};

jest.mock('../service-injection', () => ({
    getMessageService: () => fakeMessageService,
}));

//所有unit test開始前執行
beforeAll(async () => {
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

});

global.signin = async () => {

    const payload = {
        id: new ObjectId().toHexString(),
        email: 'test@test.com'
    }

    const token = jwt.sign(payload, Config.JWT_KEY);

    return { token, payload };
}
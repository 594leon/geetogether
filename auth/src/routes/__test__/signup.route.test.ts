import request from 'supertest';
import { app } from '../../app';

it('當註冊成功返回201', async () => {
    return request(app.callback())//koa要呼叫.callback()回傳request handler callback for node's native http/http2 server.讓supertest可以發送request
        .post('/api/auth/signup')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(201);
});

it('email格式錯誤返回400', async () => {
    return request(app.callback())
        .post('/api/auth/signup')
        .send({
            email: 'test@test',
            password: 'password'
        })
        .expect(400);
});

it('password格式錯誤返回400', async () => {
    return request(app.callback())
        .post('/api/auth/signup')
        .send({
            email: 'test@test.com',
            password: 'ab'
        })
        .expect(400);
});

it('缺少email跟password欄位返回400', async () => {
    await request(app.callback())
        .post('/api/auth/signup')
        .send({ email: 'test@test.com' })
        .expect(400);

    await request(app.callback())
        .post('/api/auth/signup')
        .send({ password: 'ab' })
        .expect(400);
});

it('不允許重覆email註冊',async () => {
    await request(app.callback())
    .post('/api/auth/signup')
    .send({
        email: 'test@test.com',
        password: 'password'
    })
    .expect(201);

    await request(app.callback())
    .post('/api/auth/signup')
    .send({
        email: 'test@test.com',
        password: 'password'
    })
    .expect(400);

});
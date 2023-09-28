import request from 'supertest';
import { app } from '../../app';

it('登入時提供錯誤密碼要報錯', async () => {
    await request(app.callback())//koa要呼叫.callback()回傳request handler callback for node's native http/http2 server.讓supertest可以發送request
        .post('/api/auth/signup')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(201);

    await request(app.callback())
        .post('/api/auth/signin')
        .send({
            email: 'test@test.com',
            password: 'passwords'
        })
        .expect(400);
});

it('登入成功要返回token', async () => {
    await request(app.callback())//koa要呼叫.callback()回傳request handler callback for node's native http/http2 server.讓supertest可以發送request
        .post('/api/auth/signup')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(201);

   const response = await request(app.callback())
        .post('/api/auth/signin')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(201);

        expect(response.body.token).toBeDefined();
})
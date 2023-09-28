import request from 'supertest';
import { app } from '../../app';

it('登入後再連currentuser路由,response會回傳currentUser資訊', async () => {

    const token = await signin();

    const response = await request(app.callback())
        .get('/api/auth/currentuser')
        .set('Authorization', `Bearer ${token}`)
        .send()
        .expect(201);

    expect(response.body.currentUser.email).toEqual('test@test.com');
});


it('沒有登入,currentuser路由的response回傳currentUser資訊為null', async () => {
    const response = await request(app.callback())
        .get('/api/auth/currentuser')
        .send()
        .expect(201);

    expect(response.body.currentUser).toEqual(null);
});
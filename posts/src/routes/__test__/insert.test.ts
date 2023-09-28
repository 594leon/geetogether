import request from 'supertest';
import { app } from '../../app';
import { getDatabaseService } from '../../service-injection';
import { Gender } from '@serjin/common';

it('新增一筆post資料', async () => {
    const sign = await signin();

    //發post前要先有profile帳號
    await getDatabaseService().insertProfile(
        sign.payload.id,
        'tom',
        'pic.png',
        25,
        Gender.female,
        1
    );

    await request(app.callback())
        .post('/api/posts')
        .set('Authorization', `Bearer ${sign.token}`)
        .send({
            title: 'watch movie',
            content: 'watch movie at 8pm',
            limitMembers: 2,
        })
        .expect(201);
});
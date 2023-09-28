import request from 'supertest';
import { app } from '../../app';
import { getProfileService } from '../../service-injection';
import { Gender, ZodiacSign } from '@serjin/common';

it('沒有登入時不能新增', async () => {
    await request(app.callback())
        .post('/api/profiles')
        .send(
            {
                name: 'tom',
                age: 25,
                gender: 'male',
                zodiacSign: "Aries",
                myTags: ["taipei", "tall"]
            })
        .expect(401)
}
);

it('新增一筆profiles資料', async () => {
    const sign = await signin();

    //模擬初始先創空白帳號
    await getProfileService().insert(
        sign.payload.id,
        'empty-name',
        0,
        Gender.female,
        ZodiacSign.Aquarius,
        ['empty'],
        'empty.png'
    );

    await request(app.callback())
        .post('/api/profiles')
        .set('Authorization', `Bearer ${sign.token}`)
        .send({
            name: 'tom',
            age: 25,
            gender: 'male',
            zodiacSign: "Aries",
            myTags: ["taipei", "tall"]
        })
        .expect(201);
});

it('同一個使用者只能新增一筆自已的profile資料', async () => {

    const sign = await signin();

    //模擬初始先創空白帳號
    await getProfileService().insert(
        sign.payload.id,
        'empty-name',
        0,
        Gender.female,
        ZodiacSign.Aquarius,
        ['empty'],
        'empty.png'
    );

    await request(app.callback())
        .post('/api/profiles')
        .set('Authorization', `Bearer ${sign.token}`)
        .send({
            name: 'tom',
            age: 25,
            gender: 'male',
            zodiacSign: "Aries",
            myTags: ["taipei", "tall"]
        })
        .expect(201);

    //新增第二筆時要報錯
    await request(app.callback())
    .post('/api/profiles')
    .set('Authorization', `Bearer ${sign.token}`)
    .send({
        name: 'tom',
        age: 25,
        gender: 'male',
        zodiacSign: "Aries",
        myTags: ["taipei", "tall"]
    })
    .expect(400);
});
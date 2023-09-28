import request from 'supertest';
import { app } from '../../app';
import { getProfileService, getFeedService, getFollowService, getTimelineCacheService } from '../../service-injection';
import { PostStatus } from '@serjin/common';
import { cacheConnectedListener } from '../../services/cache-connected-listener';

it('查詢 User TimeLine', async () => {
    const sign1 = await signin();

    //建立profile1帳號
    await getProfileService().insert(
        sign1.payload.id,
        'tom',
        'pic.png',
        25,
        1
    );
    console.log('profile1帳號: ' + sign1.payload.id);

    //profile1發文
    let tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    await getFeedService().upsert(
        sign1.payload.id,
        {
            postId: sign1.payload.id,
            name: 'tom',
            avatar: 'pic.png',
            title: 'title1',
            status: PostStatus.Published,
            celebrity: false,
            createdAt: new Date(),
            closedAt: tomorrow,
        }
    );

    const feeds = await getFeedService().find();
    const feed = feeds[0];

    const sign2 = await signin();

    //建立profile2帳號
    await getProfileService().insert(
        sign2.payload.id,
        'eli',
        'pic.png',
        20,
        1
    );
    console.log('profile2帳號: ' + sign2.payload.id);

    //profile2追蹤profile1
    await getFollowService().insert(sign2.payload.id, sign1.payload.id);

    const followings = await getFollowService().findAllFollowings(sign2.payload.id);
    console.log('profile2的followings');
    console.log(followings);

    //初始化Feed快取資料
    const connectedlistener = cacheConnectedListener();
    await connectedlistener();


    //查詢前，User TimeLine為空
    const isCacheExist = await getTimelineCacheService().isExist(sign2.payload.id);
    expect(isCacheExist).toEqual(false);

    //查詢 User TimeLine
    await request(app.callback())
        .get('/api/follows/me/timeline?page=1&pageSize=5')
        .set('Authorization', `Bearer ${sign2.token}`)
        .expect(201);


    //查詢後，要有User TimeLine快取
    const isCacheExist2 = await getTimelineCacheService().isExist(sign2.payload.id);
    expect(isCacheExist2).toEqual(true);


    //profile2的User TimeLine快取要有profile1的發文ID
    const userTimeline = await getTimelineCacheService().read(sign2.payload.id, 1, 5);
    console.log('userTimeline:');
    console.log(userTimeline);
    console.log('feedId: ' + feed.id);
    expect(userTimeline).toEqual([`${feed.id}`]);

});
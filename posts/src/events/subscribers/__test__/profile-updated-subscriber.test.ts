import { Gender, ZodiacSign, MsgChecker } from "@serjin/common";
import { getDatabaseService } from "../../../service-injection";
import { ProfileUpdatedSubscriber } from "../profile-updated-subscriber";


it('profile放到更新,版本號必需高於當前版號', async () => {
    const checker: MsgChecker = {
        ack: jest.fn(),
    }
    const sign = await signin();

    //先新增一筆profile帳號，模擬原有帳號
    await getDatabaseService().insertProfile(
        sign.payload.id,
        'tom',
        'pic.png',
        25,
        Gender.male,
        1
    );

    //收到版號為3
    const content = {
        id: sign.payload.id,
        name: 'peter',
        age: 25,
        gender: Gender.male,
        zodiacSign: ZodiacSign.Aquarius,
        myTags: ['taipei', 'tall'],
        avatar: 'pic.png',
        version: 3
    }


    const subscriber = new ProfileUpdatedSubscriber();
    await subscriber.onMessage(content, checker);

    const profile = await getDatabaseService().findProfileById(sign.payload.id);

    expect(profile!.version).toEqual(3);
    expect(checker.ack).toHaveBeenCalled()


    //收到版號為2
    const content2 = {
        id: sign.payload.id,
        name: 'peter2',
        age: 25,
        gender: Gender.male,
        zodiacSign: ZodiacSign.Aquarius,
        myTags: ['taipei', 'tall'],
        avatar: 'pic.png',
        version: 2
    }

    await subscriber.onMessage(content2, checker);

    const profile2 = await getDatabaseService().findProfileById(sign.payload.id);

    expect(profile2!.version).toEqual(3);
    expect(checker.ack).toHaveBeenCalled()
})
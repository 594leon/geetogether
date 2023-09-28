import { MsgChecker } from "@serjin/common";
import { AccountCreatedSubscriber } from "../account-created-subscriber"
import { getProfileService } from "../../../service-injection";


it('測試MQ訊息進來,有新增DB,有呼叫ack', async () => {

    const sign = await signin();
    const content = {
        accountId: sign.payload.id,
    };
    const checker: MsgChecker = {
        ack: jest.fn(),
    }
    const subscriber = new AccountCreatedSubscriber();

    await subscriber.onMessage(content, checker);

    const profile = await getProfileService().findById(sign.payload.id);

    expect(profile!.id).toEqual(sign.payload.id);

    expect(checker.ack).toHaveBeenCalled()
})
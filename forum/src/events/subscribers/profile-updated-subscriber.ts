import { FormattedSubscriber, MsgChecker, ProfileUpdatedEvent, Subjects, Gender, timeout } from '@serjin/common';
import { getProfileService } from '../../service-injection';
import { ProfileService } from '../../services/profile.service';

export class ProfileUpdatedSubscriber implements FormattedSubscriber<ProfileUpdatedEvent>{
    subject: Subjects.ProfileUpdated = Subjects.ProfileUpdated;

    _profileService: ProfileService;

    constructor(profileService = getProfileService()) {
        this._profileService = profileService
    }

    async onMessage(content: { id: string; name: string; age: number; gender: string; zodiacSign: string; myTags: string[]; avatar: string; version: number; }, checker: MsgChecker) {

        //onMessage這裡是高並發且又要資料同步的場景，需要讓所有Database的操作在一次完成
        //實作OCC(樂觀鎖)原先程式是先query撈出profile.version，然後判斷mq傳來的version > profile.version才去update
        //但就在撈出profile.version到去update的幾ms內，其他Pod就已經先update完另一個version為2的版本了，結果這邊因為先前撈出的profile.version還是1，update的時候就把version:1覆蓋掉version:2了
        //不過改成直接把version檢查加在update的條件式後，這問題就解決了


        //測試高並發用，利用亂數等待模擬高並發資料沒照先後順序進來
        // const s = Math.floor(Math.random() * 5);
        // console.log(`Await ${s * 1000} sec`);
        // await timeout(s * 1000);

        const profile = await this._profileService.findById(content.id);
        if (!profile) {
            console.log('profile not found and insert ');
            await this._profileService.insert(content.id, content.name, content.avatar, content.version);
            checker.ack();
            return;
        }

        //OCC Check
        console.log(`content.version: ${content.version}, profile version: ${profile.version}`)
        // if (content.version <= profile.version) {
        //     console.log('message version <= profile version!');
        //     checker.ack();
        //     return;
        // }

        await this._profileService.updateNameWithOCC(content.id, content.name, content.avatar, content.version);
        checker.ack();
    }

}
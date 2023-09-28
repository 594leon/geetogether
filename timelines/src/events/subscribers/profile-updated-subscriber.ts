import { FormattedSubscriber, MsgChecker, ProfileUpdatedEvent, Subjects, PostStatus } from '@serjin/common';
import { getPostCacheService, getProfileService, getUserlineCacheService } from '../../service-injection';
import { ProfileService } from '../../services/profile.service';
import { UserlineCacheService } from '../../services/userline.cache.service';
import { PostCacheService } from '../../services/post.cache.service';

export class ProfileUpdatedSubscriber implements FormattedSubscriber<ProfileUpdatedEvent>{
    subject: Subjects.ProfileUpdated = Subjects.ProfileUpdated;

    _profileService: ProfileService;
    _postCacheService: PostCacheService;
    _userlineCacheService: UserlineCacheService;

    constructor(profileService = getProfileService(), postCacheService = getPostCacheService(), userlineCacheService = getUserlineCacheService()) {
        this._profileService = profileService;
        this._postCacheService = postCacheService;
        this._userlineCacheService = userlineCacheService;
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

        let isUpdated: boolean;

        const profile = await this._profileService.findById(content.id);
        if (!profile) {
            console.log('profile not found and insert ');
            await this._profileService.insert(content.id, content.name, content.avatar, content.age, content.version);
            isUpdated = true;

        } else {

            isUpdated = await this._profileService.updateNameWithOCC(content.id, content.name, content.avatar, content.version);
        }

        //確定通過OCC檢查才進行Post快取更新，以免更新到舊version的profile資料
        if (isUpdated) {

            //更改這個User的全部Post快取的profile資訊
            const postIds = await this._userlineCacheService.read(content.id);
            const posts = await this._postCacheService.readMany(...postIds);
            for (const post of posts) {
                post.profile.name = content.name;
                post.profile.avatar = content.avatar;
                const endDate = post.status === PostStatus.Published ? post.closedAt : post.expiresAt;
                const ttlSec = (endDate.getTime() - new Date().getTime()) / 1000;
                await this._postCacheService.set(post, ttlSec);
            }
        }

        checker.ack();
    }
}
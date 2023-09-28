import { FormattedSubscriber, MsgChecker, ProfileUpdatedEvent, Subjects, Gender, timeout } from '@serjin/common';
import { getProfileService, getRecordService, getFeedService, getFeedCacheService } from '../../service-injection';
import { ProfileService } from '../../services/profile.service';
import { RecordService } from '../../services/record.service';
import { FeedService } from '../../services/feed.service';
import { FeedCacheService } from '../../services/feed.cache.service';

export class ProfileUpdatedSubscriber implements FormattedSubscriber<ProfileUpdatedEvent>{
    subject: Subjects.ProfileUpdated = Subjects.ProfileUpdated;

    _profileService: ProfileService;
    _recordService: RecordService;
    _feedService: FeedService;
    _feedCacheService: FeedCacheService;

    constructor(profileService = getProfileService(), recordService = getRecordService(), feedService = getFeedService(), feedCacheService = getFeedCacheService()) {
        this._profileService = profileService;
        this._recordService = recordService;
        this._feedService = feedService;
        this._feedCacheService = feedCacheService;
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
            await this._profileService.insert(content.id, content.name, content.avatar, content.age, content.version);
            await this._recordService.insert(content.id);
            checker.ack();
            return;
        }

        const isUpdated = await this._profileService.updateNameWithOCC(content.id, content.name, content.avatar, content.version);

        //確定通過OCC檢查才進行Feed更新，以免更新到舊version的profile資料
        if (isUpdated) {
            const feed = await this._feedService.findById(content.id);
            if (feed) {
                //如果該使用者有發文，就去更新該發文(Feed)的姓名(name)
                await this._feedService.upsert(feed.id, {
                    postId: feed.postId,
                    name: content.name,
                    avatar: content.avatar,
                    title: feed.title,
                    status: feed.status,
                    celebrity: feed.celebrity,
                    createdAt: feed.createdAt,
                    closedAt: feed.closedAt
                });

                feed.name = content.name;
                feed.avatar = content.avatar;
                const ttlSec = (new Date(feed.closedAt).getTime() - new Date().getTime()) / 1000;
                //重新SET 更新姓名(name)的Feed
                await this._feedCacheService.set(feed.id, feed, ttlSec);
            }
        }

        checker.ack();
    }
}
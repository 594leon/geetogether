import { ProfileCompletedEvent, Subjects, MsgChecker, FormattedSubscriber, Gender } from '@serjin/common';
import { getProfileService, getRecordService } from '../../service-injection';
import { ProfileService } from '../../services/profile.service';
import { RecordService } from '../../services/record.service';

export class ProfileCompletedSubscriber implements FormattedSubscriber<ProfileCompletedEvent> {
    subject: Subjects.ProfileCompleted = Subjects.ProfileCompleted;

    _profileService: ProfileService;
    _recordService: RecordService;

    constructor(profileService = getProfileService(), recordService = getRecordService()) {
        this._profileService = profileService;
        this._recordService = recordService;
    }

    async onMessage(content: { id: string; name: string; age: number; gender: string; zodiacSign: string; myTags: string[]; avatar: string; version: number; }, checker: MsgChecker) {

        await this._profileService.insert(content.id, content.name, content.avatar, content.age, content.version);
        await this._recordService.insert(content.id);
        checker.ack();
    }

}
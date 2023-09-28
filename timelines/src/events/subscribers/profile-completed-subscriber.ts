import { ProfileCompletedEvent, Subjects, MsgChecker, FormattedSubscriber } from '@serjin/common';
import { getProfileService } from '../../service-injection';
import { ProfileService } from '../../services/profile.service';

export class ProfileCompletedSubscriber implements FormattedSubscriber<ProfileCompletedEvent> {
    subject: Subjects.ProfileCompleted = Subjects.ProfileCompleted;

    _profileService: ProfileService;

    constructor(profileService = getProfileService()) {
        this._profileService = profileService;
    }

    async onMessage(content: { id: string; name: string; age: number; gender: string; zodiacSign: string; myTags: string[]; avatar: string; version: number; }, checker: MsgChecker) {

        await this._profileService.insert(content.id, content.name, content.avatar, content.age, content.version);
        checker.ack();
    }

}
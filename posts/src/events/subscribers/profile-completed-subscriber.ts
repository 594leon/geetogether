import { ProfileCompletedEvent, Subjects, MsgChecker, FormattedSubscriber, Gender } from '@serjin/common';
import { getDatabaseService } from '../../service-injection';
import DatabaseService from '../../services/database.service';

export class ProfileCompletedSubscriber implements FormattedSubscriber<ProfileCompletedEvent> {
    subject: Subjects.ProfileCompleted = Subjects.ProfileCompleted;

    _databaseService: DatabaseService;

    constructor(databaseService = getDatabaseService()) {
        this._databaseService = databaseService
    }
    async onMessage(content: { id: string; name: string; age: number; gender: string; zodiacSign: string; myTags: string[]; avatar: string; version: number; }, checker: MsgChecker) {
        await this._databaseService.insertProfile(content.id, content.name, content.avatar, content.age, content.gender as Gender, content.version);
        checker.ack();
    }
}
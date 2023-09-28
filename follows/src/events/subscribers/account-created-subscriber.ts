import { Subjects, MsgChecker, FormattedSubscriber, AccountCreatedEvent } from '@serjin/common';
import { getTimelineCacheService, getCelebrityCacheService } from '../../service-injection';
import { TimelineCacheService } from '../../services/timeline.cache.service';
import { CelebrityCacheService } from '../../services/celebrity.cache.service';
import Config from '../../config';

export class AccountCreatedSubscriber implements FormattedSubscriber<AccountCreatedEvent> {
    subject: Subjects.AccountCreated = Subjects.AccountCreated;

    _timelineCacheService: TimelineCacheService;
    _timelineExpireSec: number;
    _celebrityCacheService: CelebrityCacheService;

    constructor(timelineCacheService = getTimelineCacheService(), timelineExpireSec = Config.TIMELINE_EXPIRE_SECONDS, celebrityCacheService = getCelebrityCacheService()) {
        this._timelineCacheService = timelineCacheService;
        this._timelineExpireSec = timelineExpireSec;
        this._celebrityCacheService = celebrityCacheService;
    }

    async onMessage(content: { accountId: string; }, checker: MsgChecker) {
        await this._timelineCacheService.create(content.accountId, this._timelineExpireSec);
        await this._celebrityCacheService.create(content.accountId, this._timelineExpireSec);
        checker.ack();
    }
}
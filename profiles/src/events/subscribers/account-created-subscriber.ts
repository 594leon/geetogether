import { Subjects, MsgChecker, FormattedSubscriber, MessageService, AccountCreatedEvent, Gender, ZodiacSign } from '@serjin/common';
import { getProfileService, getMessageService } from '../../service-injection';
import { ProfileService } from '../../services/profile.service';

export class AccountCreatedSubscriber implements FormattedSubscriber<AccountCreatedEvent> {
    subject: Subjects.AccountCreated = Subjects.AccountCreated;

    profileService: ProfileService;
    messageService: MessageService;

    constructor(profileService = getProfileService(), messageService = getMessageService()) {
        this.profileService = profileService;
        this.messageService = messageService;
    }
    async onMessage(content: { accountId: string; }, checker: MsgChecker) {
        await this.profileService.insert(
            content.accountId,
            'empty-name',
            0,
            Gender.female,
            ZodiacSign.Aquarius,
            ['empty'],
            'empty.png'
        );
        checker.ack();
    };
}
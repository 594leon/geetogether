import { AccountCreatedEvent, FormattedPublisher, Subjects } from '@serjin/common';

export class AccountCreatedPublisher extends FormattedPublisher<AccountCreatedEvent>{
    subject: Subjects.AccountCreated = Subjects.AccountCreated;

}
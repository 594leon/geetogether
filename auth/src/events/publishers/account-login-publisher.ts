import { AccountLoginEvent, FormattedPublisher, Subjects } from '@serjin/common';

export class AccountLoginPublisher extends FormattedPublisher<AccountLoginEvent>{
    subject: Subjects.AccountLogin = Subjects.AccountLogin;

}
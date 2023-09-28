import { FormattedPublisher, ExpirationPostEvent, Subjects } from '@serjin/common';

export class ExpirationPostPublisher extends FormattedPublisher<ExpirationPostEvent>{
    subject: Subjects.ExpirationPost = Subjects.ExpirationPost;

}
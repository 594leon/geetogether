import { FormattedPublisher, FollowBecomeCelebEvent, Subjects } from '@serjin/common';

export class FollowBecomeCelebPublisher extends FormattedPublisher<FollowBecomeCelebEvent>{
    subject: Subjects.FollowBecomeCeleb = Subjects.FollowBecomeCeleb;
}
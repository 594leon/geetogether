import { FormattedPublisher, ProfileCompletedEvent, Subjects } from '@serjin/common';

export class ProfileCompletedPublisher extends FormattedPublisher<ProfileCompletedEvent>{
    subject: Subjects.ProfileCompleted = Subjects.ProfileCompleted;

}
import { FormattedPublisher, ProfileUpdatedEvent, Subjects } from '@serjin/common';

export class ProfileUpdatedPublisher extends FormattedPublisher<ProfileUpdatedEvent>{
    subject: Subjects.ProfileUpdated = Subjects.ProfileUpdated;

}
import { FormattedPublisher, RoomCreatedEvent, Subjects } from '@serjin/common';

export class RoomCreatedPublisher extends FormattedPublisher<RoomCreatedEvent>{
    subject: Subjects.RoomCreated = Subjects.RoomCreated;
}
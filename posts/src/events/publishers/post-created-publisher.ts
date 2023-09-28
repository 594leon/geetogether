import { FormattedPublisher, PostCreatedEvent, Subjects } from "@serjin/common";

export class PostCreatedPublisher extends FormattedPublisher<PostCreatedEvent>{
    subject: Subjects.PostCreated = Subjects.PostCreated;
}
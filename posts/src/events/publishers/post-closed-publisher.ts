import { FormattedPublisher, PostClosedEvent, Subjects } from "@serjin/common";

export class PostClosedPublisher extends FormattedPublisher<PostClosedEvent>{
    subject: Subjects.PostClosed = Subjects.PostClosed;
}
import { FormattedPublisher, PostExpiredEvent, Subjects } from "@serjin/common";

export class PostExpiredPublisher extends FormattedPublisher<PostExpiredEvent>{
    subject: Subjects.PostExpired = Subjects.PostExpired;
}
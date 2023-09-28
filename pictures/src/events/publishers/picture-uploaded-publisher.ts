import { FormattedPublisher, PictureUploadedEvent, Subjects } from '@serjin/common';

export class PictureUploadedPublisher extends FormattedPublisher<PictureUploadedEvent> {
    subject: Subjects.PictureUploaded = Subjects.PictureUploaded;
}
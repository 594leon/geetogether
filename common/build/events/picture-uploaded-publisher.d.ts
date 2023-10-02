import { FormattedPublisher } from "./formatted-publisher";
import { PictureUploadedEvent } from "./picture-uploaded-event";
import { Subjects } from "./subjects";
export declare class PictureUploadedPublisher extends FormattedPublisher<PictureUploadedEvent> {
    subject: Subjects.PictureUploaded;
}

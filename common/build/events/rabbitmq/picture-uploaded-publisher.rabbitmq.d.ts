import { PictureUploadedPublisher } from "../picture-uploaded-publisher";
import { Subjects } from "../subjects";
export declare class PictureUploadedRabbitmqPublisher implements PictureUploadedPublisher {
    publish: () => Promise<{
        picUrl: string;
    }>;
    subject: Subjects.PictureUploaded;
}

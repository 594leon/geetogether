import { PictureUploadedSubscriber } from "../picture-uploaded-subscriber";
import { RabbitmqSubscriber } from "./subscriber.rabbitmq";
import { Subjects } from "../subjects";
export declare class PictureUploadedRabbitmqSubscriber extends RabbitmqSubscriber implements PictureUploadedSubscriber {
    onMessage(content: any): void;
    subject: Subjects.PictureUploaded;
}

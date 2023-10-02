import { MsgEvent } from "./message-event";
import { Subjects } from "./subjects";

export interface PictureUploadedEvent extends MsgEvent{
    subject: Subjects.PictureUploaded;
    content: {
        accountId: string;
        picUrl: string;
    }
}
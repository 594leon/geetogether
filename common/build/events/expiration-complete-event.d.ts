import { MsgEvent } from "./message-event";
import { Subjects } from "./subjects";
export interface ExpirationCompleteEvent extends MsgEvent {
    subject: Subjects.ExpirationComplete;
    content: {
        postID: string;
    };
}

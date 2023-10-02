import { MsgEvent } from "./message-event";
import { Subjects } from "./subjects";

export interface PostClosedEvent extends MsgEvent {
    subject: Subjects.PostClosed;
    content: {
        accountId: string;
        postId: string;
        expiresAt: string;
    }
}
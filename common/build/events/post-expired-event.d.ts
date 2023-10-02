import { MsgEvent } from "./message-event";
import { Subjects } from "./subjects";
export interface PostExpiredEvent extends MsgEvent {
    subject: Subjects.PostExpired;
    content: {
        accountId: string;
        postId: string;
    };
}

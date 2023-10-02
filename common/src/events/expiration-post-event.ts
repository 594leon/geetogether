import { MsgEvent } from "./message-event";
import { PostStatus } from "./status/post-status";
import { Subjects } from "./subjects";

export interface ExpirationPostEvent extends MsgEvent {
    subject: Subjects.ExpirationPost;
    content: {
        postID: string;
        sourceStatus: PostStatus;
    }
}
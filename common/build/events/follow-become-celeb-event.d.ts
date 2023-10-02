import { MsgEvent } from "./message-event";
import { Subjects } from "./subjects";
export interface FollowBecomeCelebEvent extends MsgEvent {
    subject: Subjects.FollowBecomeCeleb;
    content: {
        accountId: string;
        createdAt: string;
    };
}

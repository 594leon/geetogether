import { MsgEvent } from "./message-event";
import { Subjects } from "./subjects";

export interface AccountLoginEvent extends MsgEvent {
    subject: Subjects.AccountLogin;
    content: {
        accountId: string;
    }
}
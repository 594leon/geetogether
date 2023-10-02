import { MsgEvent } from "./message-event";
import { Subjects } from "./subjects";

export interface AccountCreatedEvent extends MsgEvent {
    subject: Subjects.AccountCreated;
    content: {
        accountId: string;
    }
}
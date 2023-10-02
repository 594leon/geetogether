import { MsgChecker } from "../services/mq/msg-checker";
import { MsgEvent } from "./message-event";
import { Subjects } from "./subjects";
export interface Subscriber {
    subject: Subjects;
    onMessage: (content: MsgEvent['content'], checker: MsgChecker) => Promise<void>;
}

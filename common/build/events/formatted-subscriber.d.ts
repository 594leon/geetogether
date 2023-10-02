import { MsgChecker } from "../services/mq/msg-checker";
import { MsgEvent } from "./message-event";
import { Subscriber } from "./subscriber";
export interface FormattedSubscriber<T extends MsgEvent> extends Subscriber {
    subject: T['subject'];
    onMessage: (content: T['content'], checker: MsgChecker) => Promise<void>;
}

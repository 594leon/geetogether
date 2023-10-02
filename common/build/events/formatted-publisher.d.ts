import { MsgEvent } from './message-event';
import { Publisher } from './publisher';
export declare abstract class FormattedPublisher<T extends MsgEvent> implements Publisher {
    abstract subject: T['subject'];
    content: T['content'];
    constructor(content: T['content']);
    publish(): T["content"];
}

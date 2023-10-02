import { MsgEvent } from './message-event';
import { Publisher } from './publisher';

export abstract class FormattedPublisher<T extends MsgEvent> implements Publisher {
    abstract subject: T['subject'];
    content: T['content'];

    constructor(content: T['content']) {
        this.content = content;
    }

    public publish() {
        return this.content;
    }

}
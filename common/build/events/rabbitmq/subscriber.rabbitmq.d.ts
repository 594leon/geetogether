import { MsgEvent } from "../message-event";
import * as amqp from 'amqplib';
import { Subjects } from "../subjects";
export declare abstract class RabbitmqSubscriber {
    _subject: Subjects;
    _channel: amqp.Channel;
    constructor(channel: amqp.Channel, event: MsgEvent);
    abstract onMessage(content: MsgEvent['content']): void;
}

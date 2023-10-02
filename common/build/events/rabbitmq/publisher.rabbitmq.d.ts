import * as amqp from 'amqplib';
import { MsgEvent } from '../message-event';
import { Publisher } from '../publisher';
export declare abstract class RabbitMQPublisher<T extends MsgEvent> {
    abstract subject: T['subject'];
    private _channel;
    constructor(channel: amqp.Channel);
    send(pub: Publisher): Promise<void>;
}

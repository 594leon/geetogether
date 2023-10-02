import { MsgChecker } from "./msg-checker";
import * as amqp from 'amqplib';
export declare class RabitmqMsgChecker implements MsgChecker {
    channel: amqp.Channel;
    message: amqp.Message;
    constructor(channel: amqp.Channel, message: amqp.Message);
    ack(): void;
}

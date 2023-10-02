import { MsgChecker } from "./msg-checker";
import * as amqp from 'amqplib';

export class RabitmqMsgChecker implements MsgChecker {
    channel: amqp.Channel;
    message: amqp.Message;

    constructor(channel: amqp.Channel, message: amqp.Message) {
        this.channel = channel;
        this.message = message;
    }

    public ack() {
        this.channel.ack(this.message);
    }

}
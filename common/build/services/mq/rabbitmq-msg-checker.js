"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RabitmqMsgChecker = void 0;
class RabitmqMsgChecker {
    constructor(channel, message) {
        this.channel = channel;
        this.message = message;
    }
    ack() {
        this.channel.ack(this.message);
    }
}
exports.RabitmqMsgChecker = RabitmqMsgChecker;

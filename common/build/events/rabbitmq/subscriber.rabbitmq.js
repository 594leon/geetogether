"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RabbitmqSubscriber = void 0;
class RabbitmqSubscriber {
    constructor(channel, event) {
        this._channel = channel;
        this._subject = event.subject;
    }
}
exports.RabbitmqSubscriber = RabbitmqSubscriber;

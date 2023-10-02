"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PictureUploadedRabbitmqSubscriber = void 0;
const subscriber_rabbitmq_1 = require("./subscriber.rabbitmq");
const subjects_1 = require("../subjects");
class PictureUploadedRabbitmqSubscriber extends subscriber_rabbitmq_1.RabbitmqSubscriber {
    constructor() {
        super(...arguments);
        this.subject = subjects_1.Subjects.PictureUploaded;
    }
    onMessage(content) {
        throw new Error("Method not implemented.");
    }
}
exports.PictureUploadedRabbitmqSubscriber = PictureUploadedRabbitmqSubscriber;

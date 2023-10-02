"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const picture_uploaded_subscriber_1 = require("./picture-uploaded-subscriber");
const picture_uploaded_publisher_1 = require("./picture-uploaded-publisher");
const rabbitmq_global_1 = __importDefault(require("../services/mq/rabbitmq-global"));
const subA = new picture_uploaded_subscriber_1.PictureUploadedSubscriber();
const subB = new picture_uploaded_subscriber_1.PictureUploadedSubscriber();
const pubA = new picture_uploaded_publisher_1.PictureUploadedPublisher({ picUrl: 'dfdf' });
const result = pubA.publish();
rabbitmq_global_1.default.addSubscriber(subA, subB);
rabbitmq_global_1.default.publish(pubA);

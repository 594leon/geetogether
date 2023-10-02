"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RabbitmqMessageService = void 0;
const rabbitmq_global_1 = __importDefault(require("./rabbitmq-global"));
class RabbitmqMessageService {
    // public async addSubscriber(...subscribers: Subscriber[]) {
    //     // 綁定佇列到交換機
    //     for (const sub of subscribers) {
    //         rabbit.channel.bindQueue(rabbit.queue, sub.subject, '');
    //     }
    //     // 設定消費者
    //     await rabbit.channel.consume(rabbit.queue, async (msg) => {
    //         if (msg?.content) {
    //             const message = JSON.parse(msg.content.toString());
    //             const exchange = msg.fields.exchange;
    //             console.log('MQ received exchange:' + exchange + ', message: ' + JSON.stringify(message));
    //             const checker = new RabitmqMsgChecker(rabbit.channel, msg);
    //             for (const sub of subscribers) {
    //                 if (exchange === sub.subject) {
    //                     try {
    //                         await sub.onMessage(message, checker);
    //                     } catch (err) {
    //                         console.log(err);
    //                     }
    //                 }
    //             }
    //         }
    //     });
    // }
    publish(publisher) {
        const content = publisher.publish();
        rabbitmq_global_1.default.channel.publish(publisher.subject, '', Buffer.from(JSON.stringify(content)), { persistent: true });
        console.log('MQ published exchange:' + publisher.subject + ', message: ' + JSON.stringify(content));
    }
}
exports.RabbitmqMessageService = RabbitmqMessageService;

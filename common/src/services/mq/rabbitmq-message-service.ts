import { Publisher } from "../../events/publisher";
import { Subscriber } from "../../events/subscriber";
import { MessageService } from "./message-service";
import rabbit from './rabbitmq-global';
import { RabitmqMsgChecker } from "./rabbitmq-msg-checker";

export class RabbitmqMessageService implements MessageService {

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

    public publish(publisher: Publisher) {
        const content = publisher.publish();
        rabbit.channel.publish(publisher.subject, '', Buffer.from(JSON.stringify(content)), { persistent: true });
        console.log('MQ published exchange:' + publisher.subject + ', message: ' + JSON.stringify(content));
    }
}
import { Publisher } from "../../events/publisher";
import { MessageService } from "./message-service";
export declare class RabbitmqMessageService implements MessageService {
    publish(publisher: Publisher): void;
}

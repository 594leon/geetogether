import { Publisher } from "../../events/publisher";
import { Subscriber } from "../../events/subscriber";

export interface MessageService {
    // addSubscriber: (...subscribers: Subscriber[]) => Promise<void>;
    publish: (publisher: Publisher) => void;
}
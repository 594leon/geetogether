import { Publisher } from "../../events/publisher";
export interface MessageService {
    publish: (publisher: Publisher) => void;
}

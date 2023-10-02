import { PictureUploadedEvent } from "./picture-uploaded-event";
import { FormattedSubscriber } from "./formatted-subscriber";
import { MsgChecker } from "../services/mq/msg-checker";
export declare class PictureUploadedSubscriber implements FormattedSubscriber<PictureUploadedEvent> {
    onMessage(content: {
        picUrl: string;
    }, checker: MsgChecker): void;
    subject: PictureUploadedEvent['subject'];
}

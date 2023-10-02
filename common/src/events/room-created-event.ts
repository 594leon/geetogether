import { MsgEvent } from "./message-event";
import { Subjects } from "./subjects";

export interface RoomCreatedEvent extends MsgEvent {
    subject: Subjects.RoomCreated;
    content: {
        postID: string;
    }
}
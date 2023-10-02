import { MsgEvent } from "./message-event";
import { Subjects } from "./subjects";

export interface ProfileUpdatedEvent extends MsgEvent {
    subject: Subjects.ProfileUpdated;
    content: {
        id: string;
        name: string;
        age: number;
        gender: string;
        zodiacSign: string;
        myTags: string[];
        avatar: string;
        version: number;
    }
}
import { MsgEvent } from "./message-event";
import { Subjects } from "./subjects";
export interface ProfileCompletedEvent extends MsgEvent {
    subject: Subjects.ProfileCompleted;
    content: {
        id: string;
        name: string;
        age: number;
        gender: string;
        zodiacSign: string;
        myTags: string[];
        avatar: string;
        version: number;
    };
}

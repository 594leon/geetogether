import { Subjects } from "./subjects";
export interface MsgEvent {
    subject: Subjects;
    content: any;
}

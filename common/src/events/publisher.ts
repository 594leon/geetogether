import { MsgEvent } from './message-event';
import { Subjects } from './subjects';

export interface Publisher {
    subject: Subjects
    publish: () => MsgEvent['content'];

}
import { MsgEvent } from "./message-event";
import { PostStatus } from "./status/post-status";
import { Subjects } from "./subjects";

export interface PostCreatedEvent extends MsgEvent {
    subject: Subjects.PostCreated;
    content: {
        id: string;
        accountId: string;
        profile: { name: string, avatar: string };
        title: string;
        content: string;
        limitMembers: number;
        createdAt: string;
        closedAt: string; //截止日期
        expiresAt: string; //截止日期後多久會expires
        status: PostStatus;
    }
}
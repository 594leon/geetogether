import * as amqp from 'amqplib';
import { Subscriber } from '../../events/subscriber';
import { Subjects } from '../../events/subjects';
type Params = {
    hostname: string;
    port: number;
    queue: string;
    username: string;
    password: string;
    subjects: Subjects[];
    subscribers: Subscriber[];
    secret?: string;
    namespace?: string;
};
declare class RabbitmqGlobal {
    private _params;
    private _connection;
    private _channel;
    connect(hostname: string, port: number, queue: string, username: string, password: string, subjects: Subjects[], subscribers: Subscriber[], secret?: string, namespace?: string): Promise<void>;
    close(): Promise<void>;
    get channel(): amqp.Channel;
    get params(): Params;
    getRabbitMQCredentials(secretName?: string, namespace?: string): Promise<{
        username: string;
        password: string;
    }>;
    retry(ms: number): Promise<void>;
}
declare const _default: RabbitmqGlobal;
export default _default;

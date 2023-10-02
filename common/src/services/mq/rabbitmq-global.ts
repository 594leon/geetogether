import * as amqp from 'amqplib';
import { Subscriber } from '../../events/subscriber';
import { Subjects } from '../../events/subjects';
import { RabitmqMsgChecker } from './rabbitmq-msg-checker';
import { timeout } from '../../tools/timeout';
import { KubeConfig, CoreV1Api } from '@kubernetes/client-node';

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
}

class RabbitmqGlobal {

    private _params: Params | undefined;

    private _connection: amqp.Connection | undefined;
    private _channel: amqp.Channel | undefined;

    public async connect(hostname: string, port: number, queue: string, username: string, password: string, subjects: Subjects[], subscribers: Subscriber[], secret?: string, namespace?: string) {

        this._params = {
            hostname,
            port,
            queue,
            username,
            password,
            subjects,
            subscribers,
            secret,
            namespace
        }

        try {
            const account = await this.getRabbitMQCredentials(secret, namespace);

            // RabbitMQ 連線資訊
            const connectionOptions: amqp.Options.Connect = {
                protocol: 'amqp',
                hostname: hostname,
                port: port,//5672
                username: account.username,
                password: account.password,
                // vhost: '/',
            };

            // 建立 RabbitMQ 連線
            this._connection = await amqp.connect(connectionOptions);

            // 建立通道
            this._channel = await this._connection.createChannel();

            // 建立交換機
            for (const subject of subjects) {
                await this._channel.assertExchange(subject, 'fanout', { durable: true });
            }

            // 建立佇列
            await this._channel.assertQueue(queue, { durable: true });

            // 綁定佇列到交換機
            for (const sub of subscribers) {
                this._channel.bindQueue(queue, sub.subject, '');
            }

            // 設定消費者
            if (subscribers.length > 0) {
                await this._channel.consume(queue, async (msg) => {
                    if (msg?.content) {
                        const message = JSON.parse(msg.content.toString());
                        const exchange = msg.fields.exchange;
                        console.log('MQ received exchange:' + exchange + ', message: ' + JSON.stringify(message));
                        const checker = new RabitmqMsgChecker(this.channel, msg);
                        for (const sub of subscribers) {
                            if (exchange === sub.subject) {
                                try {
                                    await sub.onMessage(message, checker);
                                } catch (err) {
                                    console.log(err);
                                }
                            }
                        }
                    }
                });
            }

            console.log('Success connecting to MQ!');

            // 監聽 Connection 的 close 事件
            this._connection.on('close', async () => {
                console.log('Rabbitmq Connection closed. Retrying in 5 seconds...');
                // 5秒後重新連接
                await this.retry(5000);
            });

            // 監聽 Connection 的 error 事件
            this._connection.on('error', async (err) => {
                console.error('Rabbitmq Connection error:', err.message);
                console.log('Rabbitmq Retrying in 5 seconds...');
                // 5秒後重新連接
                await this.retry(5000);
            });

        } catch (error) {
            console.error('Error starting connect:', error);
            console.log('Rabbitmq Retrying in 5 seconds...');
            // 5秒後重新連接
            await this.retry(5000);
        }
    }

    public async close() {
        if (this._channel) {
            await this._channel.close();
        }
        if (this._connection) {
            await this._connection.close();
        }
    }

    public get channel(): amqp.Channel {
        if (!this._channel) {
            throw new Error('value rabbitMQ Channel not initializer!');
        }
        return this._channel;
    }

    public get params(): Params {
        if (!this._params) {
            throw new Error('value rabbitMQ Params not initializer!');
        }
        return this._params;
    }

    async getRabbitMQCredentials(secretName = 'hello-world-default-user', namespace = 'default'): Promise<{ username: string; password: string }> {
        try {
            const kc = new KubeConfig();
            kc.loadFromDefault();

            const api = kc.makeApiClient(CoreV1Api);
            // const secretName = 'hello-world-default-user';// 實際的 Secret 名稱
            // const namespace = 'default'// RabbitMQ 所在的 Kubernetes 命名空間

            const secret = await api.readNamespacedSecret(secretName, namespace);

            if (secret.body.data) {
                const username = Buffer.from(secret.body.data.username, 'base64').toString('utf8');
                const password = Buffer.from(secret.body.data.password, 'base64').toString('utf8');
                return { username, password };
            } else {
                throw new Error('RabbitMQ credentials not found in Kubernetes Secret.');
            }
        } catch (error) {
            console.error('Error fetching RabbitMQ credentials:', error);
            throw error;
        }
    }

    async retry(ms: number) {
        await timeout(ms);
        this.connect(
            this.params.hostname,
            this.params.port,
            this.params.queue,
            this.params.username,
            this.params.password,
            this.params.subjects,
            this.params.subscribers,
        );
    }

}

export default new RabbitmqGlobal();

"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const amqp = __importStar(require("amqplib"));
const rabbitmq_msg_checker_1 = require("./rabbitmq-msg-checker");
const timeout_1 = require("../../tools/timeout");
const client_node_1 = require("@kubernetes/client-node");
class RabbitmqGlobal {
    connect(hostname, port, queue, username, password, subjects, subscribers, secret, namespace) {
        return __awaiter(this, void 0, void 0, function* () {
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
            };
            try {
                const account = yield this.getRabbitMQCredentials(secret, namespace);
                // RabbitMQ 連線資訊
                const connectionOptions = {
                    protocol: 'amqp',
                    hostname: hostname,
                    port: port,
                    username: account.username,
                    password: account.password,
                    // vhost: '/',
                };
                // 建立 RabbitMQ 連線
                this._connection = yield amqp.connect(connectionOptions);
                // 建立通道
                this._channel = yield this._connection.createChannel();
                // 建立交換機
                for (const subject of subjects) {
                    yield this._channel.assertExchange(subject, 'fanout', { durable: true });
                }
                // 建立佇列
                yield this._channel.assertQueue(queue, { durable: true });
                // 綁定佇列到交換機
                for (const sub of subscribers) {
                    this._channel.bindQueue(queue, sub.subject, '');
                }
                // 設定消費者
                if (subscribers.length > 0) {
                    yield this._channel.consume(queue, (msg) => __awaiter(this, void 0, void 0, function* () {
                        if (msg === null || msg === void 0 ? void 0 : msg.content) {
                            const message = JSON.parse(msg.content.toString());
                            const exchange = msg.fields.exchange;
                            console.log('MQ received exchange:' + exchange + ', message: ' + JSON.stringify(message));
                            const checker = new rabbitmq_msg_checker_1.RabitmqMsgChecker(this.channel, msg);
                            for (const sub of subscribers) {
                                if (exchange === sub.subject) {
                                    try {
                                        yield sub.onMessage(message, checker);
                                    }
                                    catch (err) {
                                        console.log(err);
                                    }
                                }
                            }
                        }
                    }));
                }
                console.log('Success connecting to MQ!');
                // 監聽 Connection 的 close 事件
                this._connection.on('close', () => __awaiter(this, void 0, void 0, function* () {
                    console.log('Rabbitmq Connection closed. Retrying in 5 seconds...');
                    // 5秒後重新連接
                    yield this.retry(5000);
                }));
                // 監聽 Connection 的 error 事件
                this._connection.on('error', (err) => __awaiter(this, void 0, void 0, function* () {
                    console.error('Rabbitmq Connection error:', err.message);
                    console.log('Rabbitmq Retrying in 5 seconds...');
                    // 5秒後重新連接
                    yield this.retry(5000);
                }));
            }
            catch (error) {
                console.error('Error starting connect:', error);
                console.log('Rabbitmq Retrying in 5 seconds...');
                // 5秒後重新連接
                yield this.retry(5000);
            }
        });
    }
    close() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._channel) {
                yield this._channel.close();
            }
            if (this._connection) {
                yield this._connection.close();
            }
        });
    }
    get channel() {
        if (!this._channel) {
            throw new Error('value rabbitMQ Channel not initializer!');
        }
        return this._channel;
    }
    get params() {
        if (!this._params) {
            throw new Error('value rabbitMQ Params not initializer!');
        }
        return this._params;
    }
    getRabbitMQCredentials(secretName = 'hello-world-default-user', namespace = 'default') {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const kc = new client_node_1.KubeConfig();
                kc.loadFromDefault();
                const api = kc.makeApiClient(client_node_1.CoreV1Api);
                // const secretName = 'hello-world-default-user';// 實際的 Secret 名稱
                // const namespace = 'default'// RabbitMQ 所在的 Kubernetes 命名空間
                const secret = yield api.readNamespacedSecret(secretName, namespace);
                if (secret.body.data) {
                    const username = Buffer.from(secret.body.data.username, 'base64').toString('utf8');
                    const password = Buffer.from(secret.body.data.password, 'base64').toString('utf8');
                    return { username, password };
                }
                else {
                    throw new Error('RabbitMQ credentials not found in Kubernetes Secret.');
                }
            }
            catch (error) {
                console.error('Error fetching RabbitMQ credentials:', error);
                throw error;
            }
        });
    }
    retry(ms) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, timeout_1.timeout)(ms);
            this.connect(this.params.hostname, this.params.port, this.params.queue, this.params.username, this.params.password, this.params.subjects, this.params.subscribers);
        });
    }
}
exports.default = new RabbitmqGlobal();

import Redis from 'ioredis';
export declare class RedisGlobal {
    private _redis;
    connect(host: string, port: number): Promise<void>;
    onConnected(listener: () => Promise<void>): void;
    close(): Promise<void>;
    get redis(): Redis;
}
declare const _default: RedisGlobal;
export default _default;

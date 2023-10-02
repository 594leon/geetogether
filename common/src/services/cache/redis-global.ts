import Redis from 'ioredis';

export class RedisGlobal {

    private _redis: Redis | undefined;

    async connect(host: string, port: number) {
        this._redis = new Redis({
            host: host,
            port: port,
            retryStrategy: (times) => {
                // 自定義重連策略
                console.log(`Trying to reconnect (times: ${times})`);//重連次數
                return 5000; // 5 秒後進行重連
                //return null; // 不再進行重連
            },
        });

        // console.log('Connected to Redis Success!');

        this._redis.on('connect', () => {
            console.log('Connected to Redis Success!');
        });

        this._redis.on('error', (error) => {
            console.error('Redis connection error:', error.message);
        });
    }

    onConnected(listener: () => Promise<void>) {
        this.redis.on('connect', async () => {
            try {
                await listener();
            } catch (error) {
                console.log(error);
            }
        });
    }

    async close() {
        await this.redis.quit();
    }

    public get redis(): Redis {
        if (!this._redis) {
            throw new Error('Value redis not initializer!')
        }
        return this._redis;
    }
}

//Singleton Pattern
export default new RedisGlobal();
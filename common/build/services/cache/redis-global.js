"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisGlobal = void 0;
const ioredis_1 = __importDefault(require("ioredis"));
class RedisGlobal {
    connect(host, port) {
        return __awaiter(this, void 0, void 0, function* () {
            this._redis = new ioredis_1.default({
                host: host,
                port: port,
                retryStrategy: (times) => {
                    // 自定義重連策略
                    console.log(`Trying to reconnect (times: ${times})`); //重連次數
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
        });
    }
    onConnected(listener) {
        this.redis.on('connect', () => __awaiter(this, void 0, void 0, function* () {
            try {
                yield listener();
            }
            catch (error) {
                console.log(error);
            }
        }));
    }
    close() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.redis.quit();
        });
    }
    get redis() {
        if (!this._redis) {
            throw new Error('Value redis not initializer!');
        }
        return this._redis;
    }
}
exports.RedisGlobal = RedisGlobal;
//Singleton Pattern
exports.default = new RedisGlobal();

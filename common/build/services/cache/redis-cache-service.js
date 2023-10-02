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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisCacheService = void 0;
const __1 = require("../..");
const cache_service_1 = require("./cache-service");
class RedisCacheService {
    constructor() {
        this.key = 'initial_status';
    }
    onConnected(listener) {
        __1.cache.onConnected(listener);
    }
    ;
    readCacheStatus() {
        return __awaiter(this, void 0, void 0, function* () {
            const initialStatus = yield __1.cache.redis.get(this.key);
            return initialStatus ? initialStatus : cache_service_1.CacheStatus.Uninitialized;
        });
    }
    setCacheStatus(cacheStatus) {
        return __awaiter(this, void 0, void 0, function* () {
            yield __1.cache.redis.set(this.key, cacheStatus);
        });
    }
}
exports.RedisCacheService = RedisCacheService;

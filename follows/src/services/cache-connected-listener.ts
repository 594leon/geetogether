import { CacheStatus } from '@serjin/common';
import { getCacheService, getFeedService, getFeedCacheService } from '../service-injection';

const cacheConnectedListener = (cacheService = getCacheService(), feedService = getFeedService(), feedCacheService = getFeedCacheService()) => {
    return async () => {
        console.log('Execute Cache Data Initial...')
        const cacheStatus = await cacheService.readCacheStatus();

        //當連上cache server後，檢查快取資料是否初始化
        if (cacheStatus === CacheStatus.Uninitialized) {

            //先設成初始化中，避免其它副本也重複做快取初始化
            await cacheService.setCacheStatus(CacheStatus.Initializing);

            const feeds = await feedService.find();
            for (const feed of feeds) {
                const ttlSec = (new Date(feed.closedAt).getTime() - new Date().getTime()) / 1000;
                await feedCacheService.set(feed.id, feed, ttlSec);
            }

            //完成後，把狀態設為已初始化
            await cacheService.setCacheStatus(CacheStatus.Initialized);
        }
    }
}


export { cacheConnectedListener };
import * as serviceInjection from './service-injection';
import { app, initApp } from './app';
import Config from './config';
import { cacheConnectedListener } from './services/cache-connected-listener';

const start = async () => {
    if (!process.env.MONGO_URI) {
        throw new Error('MONGO_URI must be defined');
    }

    if (!process.env.MONGO_DB_NAME) {
        throw new Error('MONGO_DB_NAME must be defined');
    }

    if (!process.env.RABBIT_HOST) {
        throw new Error('RABBIT_HOST must be defined');
    }

    if (!process.env.RABBIT_PORT) {
        throw new Error('RABBIT_PORT must be defined');
    }

    if (!process.env.RABBIT_QUEUE) {
        throw new Error('RABBIT_QUEUE must be defined');
    }

    if (!process.env.RABBIT_USERNAME) {
        throw new Error('RABBIT_USERNAME must be defined');
    }

    if (!process.env.RABBIT_PASSWORD) {
        throw new Error('RABBIT_PASSWORD must be defined');
    }

    if (!process.env.RABBIT_SECRET) {
        throw new Error('RABBIT_SECRET must be defined');
    }

    if (!process.env.K8S_NAMESPACE) {
        throw new Error('K8S_NAMESPACE must be defined');
    }

    if (!process.env.JWT_KEY) {
        throw new Error('JWT_KEY must be defined');
    }

    if (!process.env.REDIS_HOST) {
        throw new Error('REDIS_HOST must be defined');
    }

    if (!process.env.REDIS_PORT) {
        throw new Error('REDIS_PORT must be defined');
    }

    Config.MONGO_URI = process.env.MONGO_URI;
    Config.MONGO_DB_NAME = process.env.MONGO_DB_NAME;
    Config.RABBIT_HOST = process.env.RABBIT_HOST;
    Config.RABBIT_PORT = Number(process.env.RABBIT_PORT);
    Config.RABBIT_QUEUE = process.env.RABBIT_QUEUE;
    Config.RABBIT_USERNAME = process.env.RABBIT_USERNAME;
    Config.RABBIT_PASSWORD = process.env.RABBIT_PASSWORD;
    Config.RABBIT_SECRET = process.env.RABBIT_SECRET;
    Config.K8S_NAMESPACE = process.env.K8S_NAMESPACE;
    Config.JWT_KEY = process.env.JWT_KEY;
    Config.REDIS_HOST = process.env.REDIS_HOST;
    Config.REDIS_PORT = Number(process.env.REDIS_PORT);

    await serviceInjection.initService();

    process.on('SIGINT', cleanup);
    process.on('SIGTERM', cleanup);


    //初始化Feed快取資料
    const connectedlistener = cacheConnectedListener();
    serviceInjection.getCacheService().onConnected(connectedlistener);
    //手動執行，確保app開焒有確實初始化Post快取資料
    await connectedlistener();


    //初始化koa app
    initApp();

    app.listen(3000, async () => {
        console.log('Follows Server listening on port 3000')
    })
}


async function cleanup() {
    await serviceInjection.closeService();
    process.exit(1);
}

start();




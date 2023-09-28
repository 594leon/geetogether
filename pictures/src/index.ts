import * as serviceInjection from './service-injection';
import path from 'path';
import fs from 'fs';
import { app, initApp } from './app';
import Config from './config';

const start = async () => {
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

    if (!process.env.JWT_KEY) {
        throw new Error('JWT_KEY must be defined');
    }

    if (!process.env.RABBIT_SECRET) {
        throw new Error('RABBIT_SECRET must be defined');
    }

    if (!process.env.K8S_NAMESPACE) {
        throw new Error('K8S_NAMESPACE must be defined');
    }

    Config.RABBIT_HOST = process.env.RABBIT_HOST;
    Config.RABBIT_PORT = Number(process.env.RABBIT_PORT);
    Config.RABBIT_QUEUE = process.env.RABBIT_QUEUE;
    Config.RABBIT_USERNAME = process.env.RABBIT_USERNAME;
    Config.RABBIT_PASSWORD = process.env.RABBIT_PASSWORD;
    Config.JWT_KEY = process.env.JWT_KEY;
    Config.RABBIT_SECRET = process.env.RABBIT_SECRET;
    Config.K8S_NAMESPACE = process.env.K8S_NAMESPACE;

    await serviceInjection.initService();


    // 確保 uploads 資料夾存在
    const parentDir = path.dirname(path.dirname(__dirname));
    const folderPath = path.join(parentDir, 'uploads');
    // const folderPath = '/path/to/folder';
    if (!fs.existsSync(folderPath)) {
        await fs.promises.mkdir(path.join(parentDir, 'uploads'), { recursive: true }); // recursive: true } 表示在創建目錄時，如果父級目錄不存在，則會遞迴地創建所有缺少的父級目錄。
    }
    Config.UPLOADS_DIR = folderPath;

    process.on('SIGINT', cleanup);
    process.on('SIGTERM', cleanup);

    initApp();

    app.listen(3000, async () => {
        console.log('Profiles Server listening on port 3000')
    })
}


async function cleanup() {
    // await serviceInjection.closeService();
    process.exit(1);
}

start();




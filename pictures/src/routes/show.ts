import Router from 'koa-router';
import path from 'path';
import fs from 'fs';
import Config from '../config';
import { BadRequestError, requireAuth } from '@serjin/common'

const showRoute = () => {
    const route = new Router();

    route.get('/api/pictures/:imagename', async (ctx) => {
        const { imagename } = ctx.params;
        const accountId = imagename.split('-')[0]

        const imagePath = path.join(Config.UPLOADS_DIR, accountId, imagename);
        if (fs.existsSync(imagePath)) {
            ctx.status = 200;
            ctx.type = 'image/jpeg';
            ctx.body = fs.createReadStream(imagePath);
        } else {
            throw new BadRequestError('Image not found');//找不到該圖片
        }
    });

    return route.routes();
}

export { showRoute };
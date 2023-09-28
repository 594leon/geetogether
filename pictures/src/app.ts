import Koa from 'koa';
import Router from 'koa-router';
import { koaBody } from 'koa-body';
import { NotFoundError, errorHandler, currentUser, BadRequestError } from '@serjin/common';
import { uploadRoute } from './routes/upload';
import { showRoute } from './routes/show';
import Config from './config';


const app = new Koa();

const initApp = () => {

    app.use(errorHandler);

    app.use(koaBody({
        multipart: true, //開放上傳file
        formidable: {
            keepExtensions: true,  //保留文件副檔名
        }
    }));

    app.use(currentUser(Config.JWT_KEY));

    app.use(uploadRoute());
    app.use(showRoute());

    const router = new Router();

    router.all('(.*)', async (ctx) => {
        throw new NotFoundError();
    })
    app.use(router.routes())
};


export { app, initApp };


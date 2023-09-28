import Koa from 'koa';
import Router from 'koa-router';
import { koaBody } from 'koa-body';
import { NotFoundError, errorHandler, currentUser } from '@serjin/common';
import { findMainlineRoute } from './routes/find-mainline';
import { findUserlineRoute } from './routes/find-userline';
import Config from './config';



const app = new Koa();

const initApp = () => {
    app.use(koaBody());

    app.use(errorHandler);

    app.use(currentUser(Config.JWT_KEY));

    app.use(findMainlineRoute());
    app.use(findUserlineRoute());

    const router = new Router();

    router.all('(.*)', async (ctx) => {
        throw new NotFoundError();
    })
    app.use(router.routes())
};


export { app, initApp };


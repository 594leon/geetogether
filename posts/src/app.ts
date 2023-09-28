import Koa from 'koa';
import Router from 'koa-router';
import { koaBody } from 'koa-body';
import { NotFoundError, errorHandler, currentUser } from '@serjin/common';
import { indexRoute } from './routes'
import { insertRoute } from './routes/insert';
import { findProfilesRoute } from './routes/find-profiles';
import Config from './config';
import { findRoute } from './routes/find';



const app = new Koa();

const initApp = () => {
    app.use(koaBody());

    app.use(errorHandler);

    app.use(currentUser(Config.JWT_KEY));

    app.use(indexRoute());
    app.use(insertRoute());
    app.use(findProfilesRoute());
    app.use(findRoute());

    const router = new Router();

    router.all('(.*)', async (ctx) => {
        throw new NotFoundError();
    })
    app.use(router.routes())
};


export { app, initApp };


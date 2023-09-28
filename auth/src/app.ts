import Koa from 'koa';
import Router from 'koa-router';
import { koaBody } from 'koa-body';
import { sginupRoute } from './routes/signup.route';
import { signinRoute } from './routes/signin.route';
import { currentUserRoute } from './routes/current-user.route';
import { NotFoundError, errorHandler } from '@serjin/common';
import { validateTokenRoute } from './routes/validate-token';


const app = new Koa();

const initApp = () => {
    app.use(koaBody());

    app.use(errorHandler);

    app.use(sginupRoute());
    app.use(signinRoute());
    app.use(currentUserRoute());
    app.use(validateTokenRoute());

    const router = new Router();

    router.all('(.*)', async (ctx) => {
        throw new NotFoundError();
    })
    app.use(router.routes())
};


export { app, initApp };


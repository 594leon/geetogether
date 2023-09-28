import Koa from 'koa';
import Router from 'koa-router';
import { koaBody } from 'koa-body';
import { NotFoundError, errorHandler, currentUser } from '@serjin/common';
import { deleteFollowRoute } from './routes/delete-follow';
import { findFollowersRoute } from './routes/find-followers';
import { findFollowingsRoute } from './routes/find-followings';
import { findRecordRoute } from './routes/find-record';
import { findTimelineRoute } from './routes/find-timeline';
import { insertFollowRoute } from './routes/insert-follow';
import Config from './config';
import { findFollowingRoute } from './routes/find-following';



const app = new Koa();

const initApp = () => {
    app.use(koaBody());

    app.use(errorHandler);

    app.use(currentUser(Config.JWT_KEY));

    app.use(deleteFollowRoute());
    app.use(findFollowersRoute());
    app.use(findFollowingsRoute());
    app.use(findRecordRoute());
    app.use(findTimelineRoute());
    app.use(insertFollowRoute());
    app.use(findFollowingRoute());

    const router = new Router();

    router.all('(.*)', async (ctx) => {
        throw new NotFoundError();
    })
    app.use(router.routes())
};


export { app, initApp };


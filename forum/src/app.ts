import Koa from 'koa';
import Router from 'koa-router';
import { koaBody } from 'koa-body';
import { NotFoundError, errorHandler, currentUser } from '@serjin/common';
import { findCommentRoute } from './routes/find-comment';
import { findPlayersRoute } from './routes/find-players';
import { insertCommentRoute } from './routes/insert-comment';
import { insertPlayerRoute } from './routes/insert-player';
import { insertRoomRoute } from './routes/insert-room';
import Config from './config';
import { findRoomRoute } from './routes/find-room';
import { findPostRoute } from './routes/find-post';
import { findPlayerRoute } from './routes/find-player';
import { findEnrollsRoute } from './routes/find-enrolls';



const app = new Koa();

const initApp = () => {
    app.use(koaBody());

    app.use(errorHandler);

    app.use(currentUser(Config.JWT_KEY));

    app.use(findCommentRoute());
    app.use(findPlayersRoute());
    app.use(findPlayerRoute());
    app.use(findRoomRoute());
    app.use(findPostRoute());
    app.use(insertCommentRoute());
    app.use(insertPlayerRoute());
    app.use(insertRoomRoute());
    app.use(findEnrollsRoute());

    const router = new Router();

    router.all('(.*)', async (ctx) => {
        throw new NotFoundError();
    })
    app.use(router.routes())
};


export { app, initApp };


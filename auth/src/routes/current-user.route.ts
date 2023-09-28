import Router from 'koa-router';
import Config from '../config';
import { currentUser } from '@serjin/common';

const currentUserRoute = () => {

    const router = new Router();

    router.get('/api/auth/currentuser', currentUser(Config.JWT_KEY), (ctx) => {
        ctx.status = 201;
        ctx.body = { currentUser: ctx.request.currentUser || null };
    });

    return router.routes();

}


export { currentUserRoute };
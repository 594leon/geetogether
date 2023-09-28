// import Koa from 'koa';
// import Router from 'koa-router';
// import { koaBody } from 'koa-body';
// import { NotFoundError, errorHandler, currentUser } from '@serjin/common';
// import { indexRoute } from './routes'
// import { insertRoute } from './routes/insert';
// import { findRoute } from './routes/find';
// import { updateNameRoute } from './routes/update-name';
// import { updateTagsRoute } from './routes/update-tags';
// import Config from './config';



// const app = new Koa();

// const initApp = () => {
//     app.use(koaBody());

//     app.use(errorHandler);

//     app.use(currentUser(Config.JWT_KEY));

//     app.use(indexRoute());
//     app.use(findRoute());
//     app.use(insertRoute());
//     app.use(updateNameRoute());
//     app.use(updateTagsRoute());

//     const router = new Router();

//     router.all('(.*)', async (ctx) => {
//         throw new NotFoundError();
//     })
//     app.use(router.routes())
// };


// export { app, initApp };


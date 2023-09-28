import Router from 'koa-router';
import { getDatabaseService, getMessageService } from '../service-injection';
import { BadRequestError, requireAuth, validateBody } from '@serjin/common';
import Joi from 'joi';
import { PostCreatedPublisher } from '../events/publishers/post-created-publisher';
import Config from '../config';

const insertRoute = (databaseService = getDatabaseService(), messageService = getMessageService(), expirationSeconds = Config.POST_EXPIRATION_SECONDS) => {

    const router = new Router();

    router.post('/api/posts', requireAuth(), validateBody(
        Joi.object({
            title: Joi.string().max(12).required(),
            content: Joi.string().max(140).required(),
            limitMembers: Joi.number().strict().integer().min(1).max(5).required(),//strict設true，可以轉數值的字串將不會通過檢查
        })
    ), async (ctx) => {

        const accountId = ctx.request.currentUser?.id!;

        const exitingProfile = await databaseService.findProfileById(accountId);
        if (!exitingProfile) {
            throw new BadRequestError('Profiles has not created!');
        }

        // const count = await databaseService.countPostsByAccountId(accountId);
        // if (count > 3) {
        //     throw new BadRequestError('No more than 3 posts can be published!');
        // }

        const { title, content, limitMembers } = ctx.request.body;

        //先註解掉Transaction，因為mongoDB限定Transaction機制要在replica set下才能工作
        // const result = await databaseService.withTransaction<string>(async (session) => {
        //     const insertedId = await databaseService.insertPost(accountId, exitingProfile.id, title, content, session);
        //     const newPost = await databaseService.findPostById(insertedId);
        //     if (!newPost) {
        //         throw new Error('find inserted post fail!');
        //     }
        //     messageService.publish(new PostCreatedPublisher({
        //         id: newPost.id,
        //         accountId: newPost.accountId,
        //         profile: { name: newPost.profile.name, avatar: newPost.profile.avatar },
        //         title: newPost.title,
        //         content: newPost.content,
        //         createdAt: newPost.createdAt,
        //         closedAt: newPost.closedAt, //截止日期
        //         expiresAt: newPost.expiresAt, //截止日期後多久會expires
        //         status: newPost.status
        //     }));
        //     return insertedId;
        // });

        const insertedId = await databaseService.insertPost(accountId, exitingProfile.id, title, content, limitMembers, expirationSeconds);
        console.log('insertedId: ' + insertedId);
        const newPost = await databaseService.findPostById(insertedId);
        if (!newPost) {
            throw new Error('find inserted post fail!');
        }
        messageService.publish(new PostCreatedPublisher({
            id: newPost.id,
            accountId: newPost.accountId,
            profile: { name: newPost.profile.name, avatar: newPost.profile.avatar },
            title: newPost.title,
            content: newPost.content,
            limitMembers: newPost.limitMembers,
            createdAt: newPost.createdAt.toISOString(),
            closedAt: newPost.closedAt.toISOString(), //截止日期
            expiresAt: newPost.expiresAt.toISOString(), //截止日期後多久會expires
            status: newPost.status
        }));

        ctx.status = 201;
        ctx.body = { insertedId };
    });

    return router.routes();

}


export { insertRoute };
import Router from 'koa-router';
import { getAccountService, getMessageService } from '../service-injection';
import { validateBody, BadRequestError } from '@serjin/common';
import Joi from 'joi';
import { Password } from '../utilities/password';
import Config from '../config';
import { signJWT } from '../utilities/jwt-tool';
import { AccountLoginPublisher } from '../events/publishers/account-login-publisher';


const signinRoute = (accountService = getAccountService(), messageService = getMessageService()) => {
    const router = new Router();

    router.post('/api/auth/signin', validateBody(
        Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().required().trim().min(3).max(20)
        })
    ), async (ctx) => {
        const { email, password } = ctx.request.body;

        const existingUser = await accountService.findByEmail(email);

        if (!existingUser) {
            throw new BadRequestError('Ivalid credentials');
        }

        const passwordMatch = await Password.compare(existingUser.password, password);

        if (!passwordMatch) {
            throw new BadRequestError('Ivalid credentials');
        }

        //創建jwt
        const userJwtoken = signJWT(Config.JWT_KEY, existingUser);

        //發送AccountLogin事件
        // messageService.publish(new AccountLoginPublisher({
        //     accountId: existingUser.id
        // }));

        ctx.status = 201
        ctx.body = {
            accountId: existingUser.id,
            token: userJwtoken
        }
    })


    return router.routes();
}

export { signinRoute }
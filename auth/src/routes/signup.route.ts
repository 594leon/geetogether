import Router from "koa-router";
import { validateBody, BadRequestError, InternalError } from '@serjin/common'
import Joi from 'joi';
import { getAccountService, getMessageService } from '../service-injection'
import { Password } from '../utilities/password';
import Config from '../config';
import { signJWT } from '../utilities/jwt-tool';
import { AccountCreatedPublisher } from "../events/publishers/account-created-publisher";

const sginupRoute = (accountService = getAccountService(), messageService = getMessageService()) => {
    const router = new Router();

    router.post('/api/auth/signup', validateBody(
        Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().required().trim().min(3).max(10)
        })
    ), async (ctx) => {

        const { email, password } = ctx.request.body;

        const exitingAccount = await accountService.findByEmail(email);

        if (exitingAccount) {
            throw new BadRequestError('Email in use');
        }

        const hashedPassword = await Password.toHash(password);
        const insertedId = await accountService.insert(email, hashedPassword);

        const account = await accountService.findById(insertedId);

        if (!account) {
            throw new InternalError();
        }

        //創建jwt
        const userJwtoken = signJWT(Config.JWT_KEY, account);

        //發送AccountCreated事件
        messageService.publish(new AccountCreatedPublisher({
            accountId: account.id
        }));


        ctx.status = 201
        ctx.body = {
            accountId: account.id,
            token: userJwtoken
        }

    });

    return router.routes();
}

export { sginupRoute }

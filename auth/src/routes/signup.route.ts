import Router from "koa-router";
import { validateBody, BadRequestError, InternalError } from '@serjin/common'
import Joi from 'joi';
import { getAccountService, getMessageService } from '../service-injection'
import { Password } from '../utilities/password';
import Config from '../config';
import { signJWT } from '../utilities/jwt-tool';
import { AccountCreatedPublisher } from "../events/publishers/account-created-publisher";

const sginupRoute = (accountService = getAccountService(), messageService = getMessageService(),CLIENT_SIGNUP_PASSWORD = Config.CLIENT_SIGNUP_PASSWORD) => {
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

        //註冊geetogether帳號都要使用CLIENT_SIGNUP_PASSWORD內的密碼，防止上線環境被惡意大量建帳號.
        if(CLIENT_SIGNUP_PASSWORD !== password){
            throw new BadRequestError('Registration is not open to general users!');
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

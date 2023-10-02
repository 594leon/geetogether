import { Context, Next } from 'koa'
import Joi, { ValidationError } from 'joi';
import { RequestValidationError } from '../errors/request-validation-error';

const validateQuery = (schema: Joi.ObjectSchema) => {
    return async (ctx: Context, next: Next) => {
        try {
            await schema.validateAsync(ctx.request.query, { abortEarly: false })//abortEarly: true的話就只要第一個email參數錯誤就回傳error，直接忽略後面的password參數驗証

        } catch (err) {
            if (err instanceof ValidationError) {
                throw new RequestValidationError(err);
            }
            throw err;
        }

        await next();
    }
}

export { validateQuery };
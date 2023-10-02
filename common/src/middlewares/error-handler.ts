import { Context, Next } from 'koa';
import { CustomError } from '../errors/custom-error';

export const errorHandler = async (ctx: Context, next: Next) => {
    try {

        await next();

    } catch (err) {
        console.log(err);
        if (err instanceof CustomError) {
            ctx.status = err.statusCode;
            ctx.body = { errors: err.serializeErrors() };
        } else {
            ctx.status = 500;
            ctx.body = { errors: [{ message: 'an internal error has occurred' }] };
        }
    }
}
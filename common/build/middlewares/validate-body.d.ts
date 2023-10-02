import { Context, Next } from 'koa';
import Joi from 'joi';
declare const validateBody: (schema: Joi.ObjectSchema) => (ctx: Context, next: Next) => Promise<void>;
export { validateBody };

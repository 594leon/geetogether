import { Context, Next } from 'koa';
declare const requireAuth: (requireActive?: boolean) => (ctx: Context, next: Next) => Promise<void>;
export { requireAuth };

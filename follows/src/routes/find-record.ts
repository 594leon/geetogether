import Router from "koa-router";
import { BadRequestError, requireAuth, validateQuery } from '@serjin/common';
import { getRecordService } from '../service-injection';
import Joi from "joi";

const findRecordRoute = (recordService = getRecordService()) => {
    const route = new Router();

    route.get('/api/follows/:profileId/record', requireAuth(), async (ctx) => {

        const { profileId } = ctx.params;

        const record = await recordService.findById(profileId);

        if (!record) {
            throw new BadRequestError('Record not Found!');
        }

        ctx.status = 201;
        ctx.body = { record };
    });

    return route.routes();
}

export { findRecordRoute };
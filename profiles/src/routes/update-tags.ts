import Router from "koa-router";
import { requireAuth, validateBody, InternalError } from '@serjin/common';
import Joi from "joi";
import { getProfileService, getMessageService } from "../service-injection";
import { ProfileUpdatedPublisher } from '../events/publishers/profile-updated-publisher';

const updateTagsRoute = (profileService = getProfileService(), messageService = getMessageService()) => {

    const route = new Router();

    route.put('/api/profiles/me/tags', requireAuth(), validateBody(
        Joi.object({
            myTags: Joi.array().items(Joi.string().min(1).max(8)).min(1).max(15).required()
        })
    ), async (ctx) => {

    
        const accountId = ctx.request.currentUser?.id!;
        const { myTags } = ctx.request.body;

        const updatedCount = await profileService.update(accountId, { myTags: myTags });

        if (updatedCount > 0) {
            const profile = await profileService.findById(accountId);

            if (!profile) {
                console.log('Not found profile');
                throw new InternalError();
            }

            messageService.publish(new ProfileUpdatedPublisher({
                id: profile.id,
                name: profile.name,
                age: profile.age,
                gender: profile.gender,
                zodiacSign: profile.zodiacSign,
                myTags: profile.myTags,
                avatar: profile.avatar,
                version: profile.version,

            }));
        }

        ctx.status = 201;
        ctx.body = { updatedCount };
    })

    return route.routes();
};

export { updateTagsRoute };
import Router from 'koa-router';
import { getProfileService, getMessageService } from '../service-injection';
import { BadRequestError, requireAuth, validateBody, Gender, ZodiacSign } from '@serjin/common';
import Joi from 'joi';
import { ProfileCompletedPublisher } from '../events/publishers/profile-completed-publisher';

const insertRoute = (profileService = getProfileService(), messageService = getMessageService()) => {

    const router = new Router();

    router.post('/api/profiles', requireAuth(), validateBody(
        Joi.object({
            name: Joi.string().required(),
            age: Joi.number().strict().integer().min(1).required(),//strict設true，可以轉數值的字串將不會通過檢查
            gender: Joi.string().valid(...Object.values(Gender)).required(),
            zodiacSign: Joi.string().valid(...Object.values(ZodiacSign)).required(),
            myTags: Joi.array().items(Joi.string().min(1).max(8)).min(1).max(15).required()
        })
    ), async (ctx) => {

        const accountId = ctx.request.currentUser?.id!;
        const exitingProfile = await profileService.findById(accountId);

        if (!exitingProfile) {
            throw new BadRequestError('You haven not registered an account yet!');
        }

        //代表使用者已設定過Profile
        if (exitingProfile.age > 0) {
            throw new BadRequestError('Profile already exists!');
        }

        const { name, age, gender, zodiacSign, myTags } = ctx.request.body;
        const genderEnum = gender as Gender;
        const zodiacSignEnum = zodiacSign as ZodiacSign;

        // const result = await profileService.insert(accountId, name, age, genderEnum, zodiacSignEnum, myTags);


        const result = await profileService.update(exitingProfile.id, {
            name,
            age,
            gender: genderEnum,
            zodiacSign: zodiacSignEnum,
            myTags,
        })
        // const profile = await profileService.findById(result);
        // if (profile) {
        //     messageService.publish(new ProfileCompletedPublisher({
        //         id: profile.id,
        //         accountId: profile.accountId,
        //         name: profile.name,
        //         age: profile.age,
        //         gender: profile.gender,
        //         zodiacSign: profile.zodiacSign,
        //         myTags: profile.myTags,
        //         avatar: profile.avatar,
        //         version: profile.version
        //     }));
        // }


        ctx.status = 201;
        ctx.body = { result };
    });

    return router.routes();

}


export { insertRoute };
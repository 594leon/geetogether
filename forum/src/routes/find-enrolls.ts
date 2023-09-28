import Router from "koa-router";
import { BadRequestError, requireAuth } from '@serjin/common';
import { getPostService, getPlayerService, getProfileService } from '../service-injection';
import { Post } from "../models/post.model";
import { Player } from "../models/player.model";
import { Profile } from "../models/profile.model";

const findEnrollsRoute = (postService = getPostService(), playerService = getPlayerService(), profileService = getProfileService()) => {
    const route = new Router();

    route.get('/api/forum/enrolls/me', requireAuth(), async (ctx) => {

        const accountId = ctx.request.currentUser?.id!;

        const players = await playerService.findByAccountId(accountId);

        let enrolls: { player: Player, post: Post, author: Profile }[] = [];
        for (const player of players) {
            const post = await postService.findById(player.postId);
            if (post) {
                const profile = await profileService.findById(post.accountId);
                if (profile) {
                    enrolls.push({ player, post, author: profile });
                }
            }
        }

        ctx.status = 201;
        ctx.body = { enrolls };
    });

    return route.routes();
}

export { findEnrollsRoute };
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = void 0;
const not_authorized_error_1 = require("../errors/not-authorized-error");
const token_expired_error_1 = require("../errors/token-expired-error");
const requireAuth = (requireActive = true) => {
    return (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
        if (!ctx.request.currentUser) {
            throw new not_authorized_error_1.NotAuthorizedError();
        }
        const currentTimestamp = Math.floor(Date.now() / 1000);
        if (ctx.request.currentUser.exp < currentTimestamp) {
            throw new token_expired_error_1.TokenExpiredError();
        }
        // if (requireActive) {
        //     if (ctx.request.currentUser.status === AccountStatus.Inactive) {
        //         throw new NotAuthorizedError();
        //     }
        // }
        yield next();
    });
};
exports.requireAuth = requireAuth;

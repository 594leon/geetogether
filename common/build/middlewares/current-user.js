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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.currentUser = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const currentUser = (jwtKey) => {
    return (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
        const { authorization = '' } = ctx.request.header;
        const token = authorization.replace('Bearer ', '');
        if (token) {
            try {
                const payload = jsonwebtoken_1.default.verify(token, jwtKey);
                ctx.request.currentUser = payload;
            }
            catch (err) {
                console.log(err);
            }
        }
        yield next();
    });
};
exports.currentUser = currentUser;

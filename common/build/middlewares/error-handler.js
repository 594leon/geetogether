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
exports.errorHandler = void 0;
const custom_error_1 = require("../errors/custom-error");
const errorHandler = (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield next();
    }
    catch (err) {
        console.log(err);
        if (err instanceof custom_error_1.CustomError) {
            ctx.status = err.statusCode;
            ctx.body = { errors: err.serializeErrors() };
        }
        else {
            ctx.status = 500;
            ctx.body = { errors: [{ message: 'an internal error has occurred' }] };
        }
    }
});
exports.errorHandler = errorHandler;

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
exports.validateQuery = void 0;
const joi_1 = require("joi");
const request_validation_error_1 = require("../errors/request-validation-error");
const validateQuery = (schema) => {
    return (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield schema.validateAsync(ctx.request.query, { abortEarly: false }); //abortEarly: true的話就只要第一個email參數錯誤就回傳error，直接忽略後面的password參數驗証
        }
        catch (err) {
            if (err instanceof joi_1.ValidationError) {
                throw new request_validation_error_1.RequestValidationError(err);
            }
            throw err;
        }
        yield next();
    });
};
exports.validateQuery = validateQuery;

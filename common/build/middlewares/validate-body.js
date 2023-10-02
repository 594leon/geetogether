"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.validateBody = void 0;
const joi_1 = __importStar(require("joi"));
const request_validation_error_1 = require("../errors/request-validation-error");
const schema = joi_1.default.object({
    email: joi_1.default.string().email().required().error,
    password: joi_1.default.string().required().trim().min(3).max(10)
});
const validateBody = (schema) => {
    return (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield schema.validateAsync(ctx.request.body, { abortEarly: false }); //abortEarly: true的話就只要第一個email參數錯誤就回傳error，直接忽略後面的password參數驗証
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
exports.validateBody = validateBody;

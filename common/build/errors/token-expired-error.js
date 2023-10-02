"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenExpiredError = void 0;
const custom_error_1 = require("./custom-error");
class TokenExpiredError extends custom_error_1.CustomError {
    constructor() {
        super('Token has expired');
        this.statusCode = 401;
    }
    serializeErrors() {
        return [{ message: 'Token has expiredv' }];
    }
}
exports.TokenExpiredError = TokenExpiredError;

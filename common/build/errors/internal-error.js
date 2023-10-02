"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InternalError = void 0;
const custom_error_1 = require("./custom-error");
class InternalError extends custom_error_1.CustomError {
    constructor() {
        super('an internal error has occurred');
        this.statusCode = 500;
    }
    serializeErrors() {
        return [{ message: 'an internal error has occurred' }];
    }
}
exports.InternalError = InternalError;

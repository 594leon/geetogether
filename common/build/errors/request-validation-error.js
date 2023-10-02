"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestValidationError = void 0;
const custom_error_1 = require("./custom-error");
class RequestValidationError extends custom_error_1.CustomError {
    constructor(validationError) {
        super('Invalid request parameters');
        this.validationError = validationError;
        this.statusCode = 400;
    }
    serializeErrors() {
        return this.validationError.details.map(item => {
            var _a;
            return { message: item.message, field: (_a = item.context) === null || _a === void 0 ? void 0 : _a.label };
        });
    }
}
exports.RequestValidationError = RequestValidationError;

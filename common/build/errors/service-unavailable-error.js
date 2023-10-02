"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceUnavailableError = void 0;
const custom_error_1 = require("./custom-error");
class ServiceUnavailableError extends custom_error_1.CustomError {
    constructor(message) {
        super(message);
        this.message = message;
        this.statusCode = 503;
    }
    serializeErrors() {
        return [{ message: this.message }];
    }
}
exports.ServiceUnavailableError = ServiceUnavailableError;

import { CustomError } from "./custom-error";

export class ServiceUnavailableError extends CustomError {
    statusCode = 503;

    constructor(public message: string) {
        super(message)
    }

    serializeErrors(): { message: string; field?: string | undefined; }[] {
        return [{ message: this.message }];
    }

}
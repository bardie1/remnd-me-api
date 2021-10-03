export class ErrorResponse {

    constructor (message: string) {
        this.message = message;
        this.isError = true;
    }
    message: string;
    isError: boolean;
}
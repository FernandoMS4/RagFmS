export class ResponseModel {
    code: string;
    message: string;
    error: boolean;
    data: any;

    constructor() {
        this.code = '';
        this.message = '';
        this.error = true;
    }
}
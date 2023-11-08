export class TokenRefreshRequestModel {
    token: string;
    refreshToken: string;

    constructor() {
        this.token = '';
        this.refreshToken = '';
    }
}
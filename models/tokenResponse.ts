export class TokenResponse {

    constructor(token: string, refreshToken: string) {
        this.token = token;
        this.refreshToken = refreshToken;
    }

    token: string;
    refreshToken: string;
}
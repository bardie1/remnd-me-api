import bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
//const config = require("config");
const jwtAccessKey = process.env["JWT_SECRET"];
const refreshAccessKey  = process.env["JWT_REFRESH_SECRET"];
const saltRounds = 10;

export class AuthUtil {
    static async hashPassword(value:string): Promise<string> {
        try {
            return await bcrypt.hash(value, saltRounds)
        } catch (err) {
            throw (err)
        }
    }

    static async comparePassword(value: string, hashed: string): Promise<boolean> {
        try {
             return await bcrypt.compare(value, hashed);
        } catch (err) {
            throw (err);
        }
    }

    static generateJwtToken(payload: any): any {
        const token = jwt.sign(payload, jwtAccessKey || '', {
            expiresIn : "1h"
        });

        return token;
    }

    static generateRefreshJwtToken(payload: any): any {
        const token = jwt.sign(payload, refreshAccessKey || '', {
            expiresIn : "5d"
        });

        return token;
    }

    static generateBothJwtTokens(payload: any): any {
        const token = this.generateJwtToken(payload);
        const refreshToken = this.generateRefreshJwtToken(payload);

        return {
            token: token,
            refreshToken: refreshToken
        };
    }

    static verifyToken(token: string) {
        try {
            let payload = jwt.verify(token,jwtAccessKey || '');
            return payload;
        } catch (err) {
            throw err;
        }
    }

    static verifyRefreshToken(token: string) {
        try {
            let payload = jwt.verify(token, refreshAccessKey || '');
            return payload;
        } catch (err) {
            throw err;
        }
    }
}

import * as jwt from 'jsonwebtoken';
import { Response, Request } from 'express';
const jwtAccessKey = process.env["JWT_SECRET"];
const refreshAccessKey  = process.env["JWT_REFRESH_SECRET"];

const verifyToken = (req: Request, res: Response, next: Function) => {
    const token = req.headers["x-access-token"] as string;

    if (!token) {
        return res.status(403).send("A token is required for authentication");
    }

    try {
        const decoded = jwt.verify(token, jwtAccessKey || '');
        req.body.user = decoded;
    } catch (err) {
        return res.status(401).send("Invalid Token");
    }

    return next();
}

module.exports = verifyToken;
import * as jwt from 'jsonwebtoken';
import { Response, Request } from 'express';
import { ErrorResponse } from '../models/errorResponse';
const jwtAccessKey = process.env["JWT_SECRET"];
const refreshAccessKey  = process.env["JWT_REFRESH_SECRET"];

const verifyToken = (req: Request, res: Response, next: Function) => {
    const token = req.headers["x-access-token"] as string;

    if (!token) {
        let err = new Error("Token is required");
        console.log(err);
        return res.status(401).json(new ErrorResponse("Token is required"));
    }

    try {
        const decoded = jwt.verify(token, jwtAccessKey || '');
        req.body.user = decoded;
    } catch (err) {
        
        return res.status(401).json(new ErrorResponse("Invalid Token"));
    }

    return next();
}

module.exports = verifyToken;
import express, { Application, Request, Response, Router } from 'express';
import {AuthUtil} from '../utils/authUtil';
import user from "../db/user";
import { ErrorResponse } from '../models/errorResponse';
const router: Router = express.Router();

router.post("/login", async (req: Request, res: Response) => {
    try {

        const {username, password} = req.body;
        const loginUser = await user.getUserByUsername(username);

        if (loginUser) {
            const validPassword = await AuthUtil.comparePassword(password, loginUser.password);
            if (validPassword) {
                const tokens = AuthUtil.generateBothJwtTokens({
                    username: loginUser.username,
                    externalRef: loginUser.external_ref,
                    role: loginUser.role
                });
                res.status(200);
                res.send({
                    message: "Login Successful",
                    tokens: tokens
                })
            } else {
                res.status(401);
                res.send(new ErrorResponse("Login details are incorrect"));
            }
        } else {
            res.status(404);
            res.send(new ErrorResponse("No Username Found"));
        }

    } catch (err) {
        res.status(400);
        res.json(new ErrorResponse(err.message));
    }
})

module.exports = router;
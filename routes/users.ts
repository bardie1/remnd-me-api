import express, { Application, Request, Response, Router } from 'express';
const router: Router = express.Router();
const verifyToken = require("../middleware/jwt");
import user from '../db/user'
import { AuthUtil } from "../utils/authUtil";

router.get("/", async (req: Request, res: Response) => {
    try {
        let users: any;
        users = await user.getAllUsers();

        res.status(200);
        res.send({
            users: users
        });
    } catch (err) {
        res.status(400)
        res.send(err.message);
    }

});

router.get("/:id", verifyToken , async (req: Request, res: Response) => {
    try {
        console.log(req.body);
        let returnedUser = await user.getUserByExternalRef(req.params.id);
        if (!returnedUser) {
            throw new Error ("No User Found");
        }
        res.status(200);
        res.send({
            user: returnedUser
        })

    } catch (err) {
        res.status(404);
        res.send(err.message);
    }
})

router.post("/", async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;
        const hashedPassword = await AuthUtil.hashPassword(password);

        let newUser = await user.createUser(username, hashedPassword);

        res.status(200);
        res.send({
            newUser
        });
        
    } catch (err) {
        res.status(400);
        res.send(err.message);
    }
})

router.put("/", verifyToken, async (req: Request, res: Response) => {
    try {

        const requestUser = req.body;

        if (!requestUser) {
            throw new Error("Invalid request");
        }

        let updatedUser = await user.updateUser(user);

        let finalUser;
        if (updatedUser) {
            finalUser = await user.getUserByExternalRef(requestUser.externalRef);
            res.status(200);
            res.send(finalUser);
        } else {
            throw new Error ("Unable to update user");
        }

        
    } catch (err) {
        res.status(400);
        res.send(err.message);
    }
})

router.delete("/:id", async (req: Request, res: Response) => {
    try {

        if (!req.params.id) {
            throw new Error("Invalid ID provided");
        }
        
        const results = await user.deleteUser(req.params.id);

        if (results) {
            res.status(200);
            res.send({
                message: `User ${req.params.id} deleted successfully`
            });
        }

    } catch (err) {
        res.status(400);
        res.send(err.message);
    }
})

module.exports = router;
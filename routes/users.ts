import express, { Application, Request, Response, Router } from 'express';
const router: Router = express.Router();
const verifyToken = require("../middleware/jwt");
import userDb from '../db/user'
import { AuthUtil } from "../utils/authUtil";
import { ErrorResponse } from '../models/errorResponse';
import { User } from '../models/user';

router.get("/", async (req: Request, res: Response) => {
    try {
        let users: any[];
        users = await userDb.getAllUsers();

        if (!users) {
            res.status(400).json(new ErrorResponse("Unable to retrieve Users"));
        }

        let changedUsers: User[] = users.map((u) => User.dloToDto(u));

        res.status(200);
        res.json(changedUsers);
    } catch (err) {
        res.status(400).json(new ErrorResponse(err.message));
    }

});

router.get("/:id", verifyToken , async (req: Request, res: Response) => {
    try {
        let returnedUser = await userDb.getUserByExternalRef(req.params.id);
        if (!returnedUser) {
            res.status(404).json(new ErrorResponse("No User Found"));
        }
        let changedUser: User = User.dloToDto(returnedUser);
        res.status(200);
        res.json(changedUser)

    } catch (err) {
        res.status(404).json( new ErrorResponse(err.message));
    }
})

router.post("/", async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;
        const hashedPassword = await AuthUtil.hashPassword(password);
        let existingUser = await userDb.getUserByUsername(username);
        if (existingUser) {
            res.status(400).json(new ErrorResponse("This username is already taken")).end();
        } else {
            let newUser = await userDb.createUser(username, hashedPassword);
    
            
            if (!newUser) {
                res.status(400).json(new ErrorResponse("Unable to create user"));
            }
            
            let user = User.dloToDto(newUser);
            res.status(202);
            res.json(user);
        }
    } catch (err) {
        res.status(400).json(new ErrorResponse(err.message));
    }
})

router.put("/", verifyToken, async (req: Request, res: Response) => {
    try {

        const requestUser = new  User(req.body);

        if (!requestUser) {
            throw new Error("Invalid request");
        }

        let updatedUser = await userDb.updateUser(requestUser);

        if (!updatedUser) {
            res.status(400).json(new ErrorResponse("Unable to update user"));
        }
        
        let finalUser: User = User.dloToDto(updatedUser);

        res.status(200).json(finalUser);
        
    } catch (err) {
        res.status(400).json(new ErrorResponse(err.message));
    }
})

router.delete("/:id", async (req: Request, res: Response) => {
    try {

        if (!req.params.id) {
            res.status(400).json(new ErrorResponse("Invalid ID provided"));
        }
        
        const results = await userDb.deleteUser(req.params.id);

        if (!results) {
            res.status(404).json(new ErrorResponse("No User Found"));
        }
        
        
        res.status(200);
        res.json({
            message: `User ${req.params.id} deleted successfully`
        });

    } catch (err) {
        res.status(400).json( new ErrorResponse(err.message));
    }
})

module.exports = router;
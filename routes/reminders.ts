import express, { Request, Response} from 'express';
import { Reminder } from '../models/reminder';
import remindersDb from "../db/reminders";
const verifyToken = require("../middleware/jwt");
const router = express.Router();


// Create reminder
router.post("/", verifyToken, async (req: Request, res: Response) => {
    try {

        let reminder: Reminder = new Reminder(req.body);
        const user = req.body.user;

        reminder.userId = user.externalRef;

        let newReminder = await remindersDb.createReminder(reminder);

        if (!newReminder) {
            throw new Error ("Unable to create reminder");
        }

        reminder = Reminder.dloToDto(newReminder);

        res.status(200).send(reminder);

    } catch (err) {
        res.status(400).send(err.message);
    }
});



// update reminder
router.put("/", verifyToken, async (req: Request, res: Response) => {

});

// delete reminder
router.delete("/:id", verifyToken, async (req: Request, res: Response) => {

});

// get reminder by id
router.get("/:id", verifyToken, async (req: Request, res: Response) => {

});

// get all reminders by user
router.get("/", verifyToken, async (req: Request, res: Response) => {

});



module.exports = router;
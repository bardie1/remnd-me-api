import express, { Request, Response} from 'express';
import { Reminder } from '../models/reminder';
import remindersDb from "../db/reminders";
import { ObjectUtil } from '../utils/objectUtil';
import user from '../db/user';
import { ErrorResponse } from '../models/errorResponse';
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
            res.status(400).json(new ErrorResponse("Unable to create reminder"));
        }

        reminder = Reminder.dloToDto(newReminder);

        res.status(200).json(reminder);

    } catch (err) {
        res.status(400).send(err.message);
    }
});



// update reminder
router.put("/", verifyToken, async (req: Request, res: Response) => {
    try {
        let reminder = new Reminder (req.body);
        const user = req.body.user;

        if (user.externalRef !== reminder.userId) {
            res.status(403).json( new ErrorResponse("Unauthorized"));
        }
    
        let updatedReminder = await remindersDb.updateReminder(reminder);
    
        if (!updatedReminder) {
            res.status(400).json(new ErrorResponse("Unable to update reminder")); 
        }
    
        reminder = Reminder.dloToDto(updatedReminder);
    
        res.status(200).send(reminder);
    } catch (err) {
        res.status(400).json( new ErrorResponse(err.message));
    }
});

// delete reminder
router.delete("/:id", verifyToken, async (req: Request, res: Response) => {

    try {
        let reminder = await remindersDb.getReminderByExternalRef(req.params.id);
        const user = req.body.user;
        if (!reminder) {
            res.status(404).json(new ErrorResponse("Reminder not found"));
        }

        let reminderDto = Reminder.dloToDto(reminder);

        if (reminderDto.userId !== user.externalRef) {
            res.status(403).json(new ErrorResponse("You are not authorized to access this resource"));
        }

        let deletedReminder = await remindersDb.deleteReminder(req.params.id);
        if (!deletedReminder) {
            res.status(400).json(new ErrorResponse("Unable to delete reminder"));
        }

        res.status(200).send(reminderDto);
    } catch (error) {
        res.status(400).json(new ErrorResponse(error.message));
    }
});

// get reminder by id
router.get("/:id", verifyToken, async (req: Request, res: Response) => {
    try {
        let reminder = await remindersDb.getReminderByExternalRef(req.params.id);
        const user = req.body.user;
        if (!reminder) {
            res.status(404).json(new ErrorResponse("Unable to Find Reminder"));
        }

        let reminderDto:Reminder = Reminder.dloToDto(reminder);
        if (reminderDto.userId !== user.externalRef) {
            res.status(403).json(new ErrorResponse("You are unauthorized to access this resource"));
        }

        res.status(200).send(reminderDto);
    } catch (error) {
        res.status(400).json( new ErrorResponse(error.message));
    }
});

// get all reminders by user
router.get("/", verifyToken, async (req: Request, res: Response) => {
    try {
        const user = req.body.user;

        let reminders:any[] = await remindersDb.getRemindersForUser(user.externalRef);

        if (!reminders) {
            res.status(400).json(new ErrorResponse("Unable to retrieve reminders"));
        }

        let rems: Reminder[] = reminders.map((r) => Reminder.dloToDto(r));

        res.status(200).send(rems);


    } catch (err) {
        res.status(400).json(new ErrorResponse(err.message));
    }
});



module.exports = router;
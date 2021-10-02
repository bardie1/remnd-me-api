require('dotenv').config();
const cors = require("cors");
import express, { Application, Request, Response } from 'express';
import * as cron from 'node-cron';
const app: Application = express();
const port: number = 4141;

const users = require("./routes/users");
const auth = require("./routes/auth");
const phoneNumbers = require("./routes/phoneNumbers");
const reminders = require("./routes/reminders");

import { TwilioUtil } from "./utils/twilioUtil";
import { SMSVerificationSchedule } from './schedules/sendVerificationCodes';
import { SendReminderSchedule } from './schedules/sendReminders';

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({
        extended: true,
    })
);

app.get("/", async (req: Request, res: Response): Promise<Response> => {
    return res.status(200).send({
        message: "Hello World",
    });
});

app.use("/users", users);
app.use("/auth", auth);
app.use("/phone-numbers", phoneNumbers);
app.use("/reminders", reminders);

var corsOptions = {
    origin: function(origin:any, callback:any){
        var originIsWhitelisted = true;
        //whitelist.indexOf(origin) !== -1;
        callback(null, originIsWhitelisted);
    },
    credentials: true
  };
  app.use(cors(corsOptions));

const scheduler = new SMSVerificationSchedule();
scheduler.start();

const reminderScheduler = new SendReminderSchedule();
reminderScheduler.start();


try {
    app.listen(port, (): void => {
        console.log(`Connected successfully on port ${port}`);
    });
} catch (error) {
    console.error(`Error occured: ${error.message}`);
}

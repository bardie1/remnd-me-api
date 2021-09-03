import * as cron from 'node-cron';
import { VerificationSMSItem } from '../models/verificationSMS';
import remindersDb from "../db/reminders";
import { TwilioUtil } from '../utils/twilioUtil';
import { Reminder } from '../models/reminder';
import phoneDb from '../db/phoneNumbers';
import { PhoneNumberDto } from '../models/phoneNumberDto';

export class SendReminderSchedule {
    constructor(){

    }

    start() {
        cron.schedule("*/10 * * * * *", () => {
            console.log("Reminder")
            this.sendMessages();
        })
    }

    async sendMessages(){
        try {
            let codes: any[] = await remindersDb.getUnsentReminders();
            console.log("Reminder", codes);
            if (codes.length > 0) {
                codes.forEach(async (r) => {
                    let reminder = Reminder.dloToDto(r);
                    let message = `Here is your reminder! \n \nTitle: ${reminder.title} \nDescription: ${reminder.description} \nDue Date: ${reminder.dueDate}`;
                    let p = await phoneDb.getPhoneNumberByExternalRef(reminder.phoneId);
                    let phone = PhoneNumberDto.dloToDto(p);
                    if (reminder.externalRef) {
                        TwilioUtil.sendReminderMessage(phone.phoneNumber, message, reminder.externalRef);
                    }
                });
            }
        } catch(err) {
            console.log(err);
        }


    }
}
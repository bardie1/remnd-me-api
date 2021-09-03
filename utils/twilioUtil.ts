const accountSid = process.env["TWILIO_ACCOUNT_SID"];
const authToken = process.env["TWILIO_AUTH_TOKEN"];
const twilioNumber = process.env["TWILIO_FROM_NUMBER"];
import verificationQueue from "../db/verificationQueue";
import { Twilio } from 'twilio';
import remindersDb from "../db/reminders";

console.log(accountSid, authToken, twilioNumber);
const client = new Twilio(accountSid || '', authToken || '');


export class TwilioUtil {
    public static  sendMessage(toNumber: string, body: string, externalRef: string) {
        client.messages.create({
            body: body,
            from: twilioNumber,
            to: toNumber
    
        }).then((message:any) => verificationQueue.markAsSent(externalRef))
    }

    public static sendReminderMessage(toNumber: string, body: string, externalRef: string) {
        client.messages.create({
            body: body,
            from: twilioNumber,
            to: toNumber
    
        }).then((message:any) => remindersDb.markAsSent(externalRef))
    }
} 
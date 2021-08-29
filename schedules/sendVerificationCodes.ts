import * as cron from 'node-cron';
import { VerificationSMSItem } from '../models/verificationSMS';
import verificationQueue from "../db/verificationQueue";
import { TwilioUtil } from '../utils/twilioUtil';

export class SMSVerificationSchedule {

    codesToSend: VerificationSMSItem[] = [];

    constructor(){
    }
    
    
    start() {
        cron.schedule("*/10 * * * * *", () => {
            console.log("Again")
            this.sendMessages();
        })
    }

    async sendMessages(){
        try {
            let codes: any[] = await verificationQueue.getUnsentMessages();
            console.log(codes);
            if (codes.length > 0) {
                codes.forEach((c) => {
                    let item = VerificationSMSItem.dloToDto(c);
                    TwilioUtil.sendMessage(item.phoneNumber, `Here is your RemindMe verification code ${item.verificationCode}`, item.externalRef);
                });
            }
        } catch(err) {
            console.log(err);
        }


    }
}
import express, { Application, Request, Response, Router } from 'express';
import { PhoneNumberDto } from '../models/phoneNumberDto';
const router: Router = express.Router();
const verifyToken = require("../middleware/jwt");
import phoneDb from "../db/phoneNumbers";
import { GenerateUtil } from '../utils/generateUtil';

router.get("/:id", verifyToken, async (req: Request, res: Response) => {
    try {
        const phone = await phoneDb.getPhoneNumberByExternalRef(req.params.id);
        const user = req.body.user;
        let dtoPhone: PhoneNumberDto;
        if (phone) {
            dtoPhone = PhoneNumberDto.dloToDto(phone);
            if (dtoPhone.userId !== user.externalRef) {
                throw new Error ("Unauthorized!");
            }
        } else {
            throw new Error ("No Phone found");
        }

        res.status(200).send(dtoPhone);
    } catch (err) {
        res.status(400).send(err.message);
    }
});


router.post("/", verifyToken , async (req: Request, res: Response) => {
    try {
        req.body.userId = req.body.user.externalRef;
        const newPhone = new PhoneNumberDto(req.body);
        const addedPhone = await phoneDb.insertPhoneNumber(newPhone);
        let dtoPhone: PhoneNumberDto;
        if (addedPhone) {
           dtoPhone = PhoneNumberDto.dloToDto(addedPhone);
        } else {
            throw new Error ("Unable to add phone");
        }

        res.status(200).send(dtoPhone);

    } catch (err) {
        res.status(400).send(err.message);
    }
})

router.put("/", verifyToken, async (req: Request, res: Response) => {
    
})

router.post("/send-verification-code", verifyToken, async (req: Request, res: Response) => {

    try {
        //get phone number from req
        let phoneToSendTo = new PhoneNumberDto(req.body);
        //make sure the phone number belongs to the signed in user
        const userId = req.body.user.externalRef;
        let phone = await phoneDb.getPhoneNumberByExternalRef(phoneToSendTo.externalRef);
    
        if (phone) {
            phoneToSendTo = PhoneNumberDto.dloToDto(phone);
        }
    
        if (phoneToSendTo.userId !== userId) {
            throw new Error ("Unauthorized!");
        }
        //Create a 6 digit random code 
        let digString = GenerateUtil.generateVerificationCode();
    
        // add entry to the queue database
        await phoneDb.addVerificationToQueue(phoneToSendTo.externalRef, phoneToSendTo.phoneNumber, digString);

        res.status(200).send("Success")
    } catch (error) {
        res.status(400).send("Failed")
    }
});

router.post("/verify", verifyToken, async (req: Request, res: Response) => {

    try {        
        let phone: PhoneNumberDto = new PhoneNumberDto(req.body);
        const code:string = req.body.code;
    
        let phoneToVerify = await phoneDb.getPhoneNumberByExternalRef(phone.externalRef);
    
        if (phoneToVerify) {
            phone = PhoneNumberDto.dloToDto(phoneToVerify);
        } else {
            throw new Error ();
        }

        let updateRes;
    
        if (code === phone.verificationCode) {
           updateRes = await phoneDb.updatePhoneVerificationStatus(phone.externalRef, true);
        } else {
            throw new Error("Incorrect Code");
        }
        
        if (updateRes) {
            phone = PhoneNumberDto.dloToDto(updateRes);
        }

        res.status(200).send(phone)
    } catch (error) {
        res.status(400).send(error.message);
    }
});

module.exports = router;
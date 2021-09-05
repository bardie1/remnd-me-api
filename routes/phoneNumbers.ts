import express, { Application, Request, Response, Router } from 'express';
import { PhoneNumberDto } from '../models/phoneNumberDto';
const router: Router = express.Router();
const verifyToken = require("../middleware/jwt");
import phoneDb from "../db/phoneNumbers";
import { GenerateUtil } from '../utils/generateUtil';
import { ErrorResponse } from '../models/errorResponse';

router.get("/:id", verifyToken, async (req: Request, res: Response) => {
    try {
        const phone = await phoneDb.getPhoneNumberByExternalRef(req.params.id);
        const user = req.body.user;
        let dtoPhone: PhoneNumberDto;
        if (!phone) {
            res.status(404).json(new ErrorResponse("No Phone found"));
        }
        
        dtoPhone = PhoneNumberDto.dloToDto(phone);
        if (dtoPhone.userId !== user.externalRef) {
            res.status(403).json(new ErrorResponse("You are unauthorized to access this resource"));
        }
        res.status(200).json(dtoPhone);
    } catch (err) {
        res.status(400).json(new ErrorResponse(err.message));
    }
});


router.post("/", verifyToken , async (req: Request, res: Response) => {
    try {
        req.body.userId = req.body.user.externalRef;
        const newPhone = new PhoneNumberDto(req.body);
        const addedPhone = await phoneDb.insertPhoneNumber(newPhone);
        let dtoPhone: PhoneNumberDto;
        if (!addedPhone) {
            res.status(400).json(new ErrorResponse("Unable to add phone"));
        }
        dtoPhone = PhoneNumberDto.dloToDto(addedPhone);

        res.status(202).json(dtoPhone);

    } catch (err) {
        res.status(400).json(new ErrorResponse(err.message));
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
    
        if (!phone) {
            res.status(404).json(new ErrorResponse("Unable to find this resource"));
        }
        
        phoneToSendTo = PhoneNumberDto.dloToDto(phone);
        if (phoneToSendTo.userId !== userId) {
            res.status(403).json(new ErrorResponse("You are unauthorized to access this resource"));
        }
        //Create a 6 digit random code 
        let digString = GenerateUtil.generateVerificationCode();
    
        // add entry to the queue database
        await phoneDb.addVerificationToQueue(phoneToSendTo.externalRef, phoneToSendTo.phoneNumber, digString);

        res.status(200).json({success: true})
    } catch (error) {
        res.status(400).json(new ErrorResponse(error.message));
    }
});

router.post("/verify", verifyToken, async (req: Request, res: Response) => {

    try {        
        let phone: PhoneNumberDto = new PhoneNumberDto(req.body);
        const code:string = req.body.code;
    
        let phoneToVerify = await phoneDb.getPhoneNumberByExternalRef(phone.externalRef);
    
        if (!phoneToVerify) {
            res.status(404).json(new ErrorResponse("Unable to find resource"));
        }

        phone = PhoneNumberDto.dloToDto(phoneToVerify);
        
        let updateRes;
    
        if (code === phone.verificationCode) {
           updateRes = await phoneDb.updatePhoneVerificationStatus(phone.externalRef, true);
        } else {
            res.status(200).json({verified: false});
        }
        
        if (!updateRes) {
            res.status(400).json(new ErrorResponse("Unable to update verification status"))
        }
        
        phone = PhoneNumberDto.dloToDto(updateRes);
        res.status(200).json(phone)
    } catch (error) {
        res.status(400).json(new ErrorResponse(error.message));
    }
});

module.exports = router;
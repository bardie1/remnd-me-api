export class VerificationSMSItem {
    constructor(item: any) {
        this.id = item.id;
        this.externalRef = item.externalRef;
        this.phoneId = item.phoneId;
        this.phoneNumber = item.phoneNumber;
        this.verificationCode = item.verificationCode;
        this.sentDate = item.sentDate;
        this.createdAt = item.createdAt;
        this.verified = item.verified;
    }

    id: number;
    externalRef: string;
    phoneId: string;
    phoneNumber: string;
    verificationCode: string;
    sentDate: string;
    createdAt: string;
    verified: boolean;

    public static dloToDto(itemDlo:any) {
        let dto = {
            id: itemDlo.id,
            externalRef: itemDlo.external_ref,
            phoneId: itemDlo.phone_id,
            phoneNumber: itemDlo.phone_number,
            verificationCode: itemDlo.verification_code,
            sentDate: itemDlo.sent_date,
            createdAt: itemDlo.created_at,
            verified: itemDlo.verified
        }

        return new VerificationSMSItem(dto);
    }
}
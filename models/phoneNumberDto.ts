export class PhoneNumberDto {

    constructor (phoneNumber: any) {
        this.id = phoneNumber.id || null;
        this.externalRef = phoneNumber.externalRef || null;
        this.phoneNumber = phoneNumber.phoneNumber;
        this.phoneExtension = phoneNumber.phoneExtension;
        this.verified = phoneNumber.verified || false;
        this.userId = phoneNumber.userId;
        this.createdAt = phoneNumber.created_at || null;
        this.updatedAt = phoneNumber.updated_at || null;
        this.verificationCode = phoneNumber.verificationCode || null;
    }

    id: number;
    externalRef: string;
    phoneNumber: string;
    phoneExtension: string;
    verified: boolean;
    verificationCode: string;
    userId: string;
    createdAt?: string;
    updatedAt?: string;

    public static dloToDto(phoneDlo:any): PhoneNumberDto {
        let phone = {
            id: phoneDlo.id,
            externalRef: phoneDlo.external_ref,
            phoneNumber: phoneDlo.phone_number,
            phoneExtension: phoneDlo.phone_extension,
            verified: phoneDlo.verified,
            userId: phoneDlo.user_id,
            createdAt: phoneDlo.created_at,
            updatedAt: phoneDlo.updated_at,
            verificationCode: phoneDlo.verification_code
        }

        return new PhoneNumberDto(phone);
    }
}
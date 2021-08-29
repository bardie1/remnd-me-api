import { Pool } from "pg";
import { PhoneNumberDto } from "../models/phoneNumberDto";

const pool: Pool = new Pool({
    user: 'saul_bard',
    host: 'localhost',
    database: 'remnd_me',
    password: 'saul',
    port: 5432
});

const insertPhoneNumber = (phoneNumber: PhoneNumberDto): Promise<any> => {
    return new Promise ((resolve, reject) => {
        pool.query("INSERT INTO phone_numbers (phone_number, phone_extension, user_id) VALUES ($1, $2, $3) RETURNING *", 
            [phoneNumber.phoneNumber,phoneNumber.phoneExtension, phoneNumber.userId], (error, results) => {
                if (error) {
                    reject ( new Error (error.message));
                }

                resolve(results.rows[0]);
            })
    })
}

const updatePhoneVerificationCode = (phoneId: string, verificationCode: string): Promise<any> => {
    return new Promise((resolve, reject) => {
        pool.query("UPDATE phone_numbers SET verification_code = $1 WHERE external_ref = $2 RETURNING *", [verificationCode, phoneId], (err, results) => {
            console.log(results);
            if (err) {
                reject (new Error(err.message));
            }

            resolve (results.rows[0]);
        });
    });
}

const updatePhoneVerificationStatus = (phoneId: string, verified: boolean): Promise<any> => {
    let verifiedStatus = (verified) ? 'TRUE' : "FALSE";
    return new Promise((resolve, reject) => {
        pool.query("UPDATE phone_numbers SET verified = $1, verification_code = $3 WHERE external_ref = $2 RETURNING *", [verifiedStatus, phoneId, null], (err, results) => {
            console.log(results);
            if (err) {
                reject (new Error(err.message));
            }

            resolve (results.rows[0]);
        });
    });
}

const getPhoneNumberByExternalRef = (phoneExternalRef: string): Promise<any> => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT * from phone_numbers WHERE external_ref = $1", [phoneExternalRef], (error, results) => {
            if (error) {
                reject (new Error (error.message));
            }

            resolve (results.rows[0]);
        })
    })
}

const addVerificationToQueue = async (phoneId: string, phoneNumber:string, verificationCode: string): Promise<any> => {
    return new Promise(async (resolve, reject) => {
        try {
            await pool.query("BEGIN");
            const res = await pool.query("INSERT INTO phone_verification_queue(phone_id, phone_number, verification_code) VALUES ($1, $2, $3)", [phoneId, phoneNumber, verificationCode]);
            const updatedPhoneCode = await updatePhoneVerificationCode(phoneId, verificationCode);
            console.log(updatedPhoneCode);
            if (updatedPhoneCode) {
                await pool.query("COMMIT");
                resolve("success");
            } else {
                throw new Error();
            }
        } catch (err) {
            await pool.query("ROLLBACK");
            reject ( new Error (err.message));
        }
    });
}

const phoneDb = {
    insertPhoneNumber,
    getPhoneNumberByExternalRef,
    addVerificationToQueue,
    updatePhoneVerificationCode,
    updatePhoneVerificationStatus
}

export default phoneDb;
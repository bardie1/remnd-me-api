import { Pool } from "pg";

const pool: Pool = new Pool({
    user: 'saul_bard',
    host: 'localhost',
    database: 'remnd_me',
    password: 'saul',
    port: 5432
});

const getUnsentMessages = (): Promise<any[]> => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT * from phone_verification_queue where sent_date IS NULL ORDER BY created_at ASC", [], (err, results) => {
            if (err) {
                reject(new Error( err.message));
            }

            resolve(results.rows);
        })
    })
}

const markAsSent = (externalRef: string): Promise<any> => {
    return new Promise((resolve, reject) => {
        pool.query("UPDATE phone_verification_queue SET sent_date = NOW() WHERE external_ref = $1 RETURNING *", [externalRef], (err, results) => {
            if (err) {
                reject(new Error(err.message));
            }

            resolve(results.rows[0]);
        })
    })
}

const verificationQueue = {
    getUnsentMessages,
    markAsSent
}

export default verificationQueue;
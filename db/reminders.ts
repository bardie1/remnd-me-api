import { Pool } from "pg";
import { Reminder } from "../models/reminder";

const pool: Pool = new Pool({
    user: 'saul_bard',
    host: 'localhost',
    database: 'remnd_me',
    password: 'saul',
    port: 5432
});


const createReminder = (reminder: Reminder) : Promise<any> => {
    return new Promise((resolve, reject) => {
        pool.query("INSERT INTO reminders (title, description, due_date, recurring, recurring_timeframe, remind_date_time, user_id, phone_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
        [reminder.title, reminder.description, reminder.dueDate, reminder.recurring, reminder.recurringTimeframe, reminder.remindDateTime, reminder.userId, reminder.phoneId], (error, results) => {
            if (error) {
                reject( new Error( error.message));
            }

            resolve(results.rows[0]);
        });
    });
}

const updateReminder = (reminder: Reminder) : Promise<any> => {
    return new Promise((resolve, reject) => {
        pool.query("UPDATE reminders SET title = $1, description = $2, due_date = $3, recurring = $4, recurring_timeframe = $5, remind_date_time = $6, phone_id = $7, updated_at = NOW() WHERE external_ref = $8 RETURNING *",
        [reminder.title, reminder.description, reminder.dueDate, reminder.recurring, reminder.recurringTimeframe, reminder.remindDateTime, reminder.phoneId, reminder.externalRef], (error, results) => {
            if (error) {
                reject(new Error(error.message));
            }

            resolve( results.rows[0])
        })
    });
}

const getReminderByExternalRef = (reminderExternalRef: string): Promise<any> => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT * FROM reminders where external_ref = $1", [reminderExternalRef], (err, results) => {
            if (err) {
                reject( new Error(err.message));
            }

            resolve(results.rows[0]);
        })
    })
}

const getRemindersForUser = (userExternalRef: string) : Promise<any> => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT * FROM reminders WHERE user_id = $1", [userExternalRef], (error, results) => {
            if (error) {
                reject(new Error(error.message));
            }

            resolve(results.rows);
        });
    });
}

const deleteReminder = (reminderExternalRef: string) : Promise<any> => {
    return new Promise((resolve, reject) => {
        pool.query("DELETE FROM reminders WHERE external_ref = $1 RETURNING *",  [reminderExternalRef], (err, results) => {
            if (err) {
                reject(new Error(err.message));
            }

            resolve(results.rows[0]);
        })
    })
}



const remindersDb = {
    createReminder,
    updateReminder,
    getRemindersForUser,
    deleteReminder,
    getReminderByExternalRef
}

export default remindersDb;
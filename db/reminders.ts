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



const remindersDb = {
    createReminder,
}

export default remindersDb;
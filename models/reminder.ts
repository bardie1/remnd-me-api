export class Reminder {
    constructor(reminder: Reminder) {
        this.id = reminder.id || null;
        this.externalRef = reminder.externalRef || null;
        this.title = reminder.title;
        this.description = reminder.description;
        this.dueDate = reminder.dueDate;
        this.recurring = reminder.recurring;
        this.recurringTimeframe = reminder.recurringTimeframe || null;
        this.remindDateTime = reminder.remindDateTime;
        this.done = reminder.done || false;
        this.userId = reminder.userId;
        this.phoneId = reminder.phoneId;
        this.createdAt = reminder.createdAt;
        this.updatedAt = reminder.updatedAt;
        this.sentDate = reminder.sentDate || null;
    }


    public static dloToDto(rem:any): Reminder {
        return new Reminder({
            id: rem.id,
            externalRef: rem.external_ref,
            title: rem.title,
            description: rem.description,
            dueDate: rem.due_date,
            recurring: rem.recurring,
            recurringTimeframe: rem.recurring_timeframe,
            remindDateTime: rem.remind_date_time,
            done: rem.done,
            userId: rem.user_id,
            phoneId: rem.phone_id,
            createdAt: rem.created_at,
            updatedAt: rem.updated_at,
            sentDate : rem.sent_date
        });
    }

    id: number | null;
    externalRef: string | null;
    title: string;
    description: string;
    dueDate: string;
    recurring: boolean;
    recurringTimeframe: string | null;
    remindDateTime: string;
    done: boolean;
    userId: string;
    phoneId: string;
    createdAt: string | null;
    updatedAt: string | null;
    sentDate: string | null;
}
export class Reminder {
    constructor(reminder: Reminder) {
        this.id = reminder.id;
        this.externalRef = reminder.externalRef;
        this.title = reminder.title;
        this.description = reminder.description;
        this.dueDate = reminder.dueDate;
        this.recurring = reminder.recurring;
        this.recurringTimeframe = reminder.recurringTimeframe;
        this.remindDateTime = reminder.remindDateTime;
        this.done = reminder.done;
        this.userId = reminder.userId;
        this.phoneId = reminder.phoneId;
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
            phoneId: rem.phone_id
        });
    }

    id: number;
    externalRef: string;
    title: string;
    description: string;
    dueDate: string;
    recurring: boolean;
    recurringTimeframe: string;
    remindDateTime: string;
    done: boolean;
    userId: string;
    phoneId: string;
}
import { UUID } from "crypto";
import { ChoresModelAttributes } from "./ChoresModel";

export enum RecurrenceType {
    DAILY = 'DAILY',
    WEEKLY = 'WEEKLY',
    MONTHLY = 'MONTHLY',
}

export interface RecurringChoresModelAttributes {
    id: UUID;
    choreId: ChoresModelAttributes['id'];
    recurrenceType: RecurrenceType;
    //Every 3 days implemntation etc.
    startDate: Date;
    endDate: Date | null;
}
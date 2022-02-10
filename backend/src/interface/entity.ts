export enum ScheduleValidType {
  POSIBLE = "POSIBLE",
  IMPOSIBLE = "IMPOSIBLE",
}

export interface Schedule {
  valid: ScheduleValidType;
  start: string;
  end: string;
}

export interface User {
  _id?: string;
  name: string;
  color: string;
  schedules: Schedule[];
}

export enum CalendarType {
  MONTHLY = "MONTHLY",
  WEEKLY = "WEEKLY",
}

export interface Calendar {
  _id?: string;
  name: string;
  type: CalendarType;
  start?: string;
  end?: string;
  users: User[];
}

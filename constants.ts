import { DaySetting, Member } from "./types";

const memberNames = ['Alice', 'Bob', 'Charlie', 'Diana', 'Edward', 'Fiona', 'George', 'Hannah', 'Ian', 'Jane'];

export const INITIAL_MEMBERS: Member[] = memberNames.map(name => ({
    name,
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff&rounded=true&size=40`
}));

export const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export const INITIAL_DAY_SETTINGS: DaySetting[] = [
    { day: 'Monday', hasService: true, serviceName: 'Prayer Service' },
    { day: 'Tuesday', hasService: false, serviceName: 'Day Off' },
    { day: 'Wednesday', hasService: true, serviceName: 'Bible Study' },
    { day: 'Thursday', hasService: false, serviceName: 'Day Off' },
    { day: 'Friday', hasService: true, serviceName: 'Liberation Service' },
    { day: 'Saturday', hasService: true, serviceName: 'Youth Service' },
    { day: 'Sunday', hasService: true, serviceName: 'Celebration Service' },
];
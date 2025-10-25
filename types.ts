export interface Member {
  name: string;
  avatar: string;
}

export interface Hymn {
  person: string;
  hymn: number;
}

export interface DaySchedule {
  day: string;
  service: string;
  ushers: string[];
  hymns: Hymn[];
}

export interface DaySetting {
  day: string;
  hasService: boolean;
  serviceName: string;
}

export type WeeklySchedule = DaySchedule[];

export type ViewMode = 'member' | 'admin';
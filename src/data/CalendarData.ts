export interface CalendarEntry {
  id: string;
  date: string;
  month: number;
  year: number;
  title: string;
  description: string;
  images?: string[];
}

export const calendarEntries: CalendarEntry[] = [
  {
    id: "cal-1",
    date: "1 января 2022",
    month: 1,
    year: 2022,
    title: "Пример события",
    description: "Описание события в календаре",
    images: []
  }
];

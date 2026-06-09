export interface MapMarker {
  id: string;
  eventId: string;
  title: string;
  category: "campaign" | "battle" | "unit" | "politics" | "weapons";
  coordinates: [number, number];
  date: string;
  image?: string;
}

export const markers: MapMarker[] = [
  {
    id: "m1",
    eventId: "1",
    title: "Начало СВО",
    category: "politics",
    coordinates: [50.4501, 30.5234],
    date: "24 февраля 2022",
  },
  {
    id: "m2",
    eventId: "2",
    title: "Киевская операция",
    category: "campaign",
    coordinates: [50.4501, 30.5234],
    date: "Март 2022",
  },
  {
    id: "m3",
    eventId: "5",
    title: "Битва за Мариуполь",
    category: "battle",
    coordinates: [47.0971, 37.5432],
    date: "Май 2022",
  },
  {
    id: "m4",
    eventId: "4",
    title: "Референдумы",
    category: "politics",
    coordinates: [47.8388, 35.1396],
    date: "Сентябрь 2022",
  },
  {
    id: "m5",
    eventId: "5",
    title: "Добровольческие формирования",
    category: "unit",
    coordinates: [48.5132, 39.2085],
    date: "Декабрь 2022",
  },
  {
    id: "m5a",
    eventId: "3",
    title: "Высадка гостомельского десанта",
    category: "battle",
    coordinates: [50.6037, 30.1919],
    date: "24 февраля 2022",
  },
  {
    id: "m6",
    eventId: "6",
    title: "Взятие Артёмовска",
    category: "battle",
    coordinates: [48.5924, 37.9991],
    date: "Май 2023",
  },
  {
    id: "m7",
    eventId: "7",
    title: "Калибр",
    category: "weapons",
    coordinates: [46.4825, 30.7233],
    date: "Март 2022",
  },
  {
    id: "m8",
    eventId: "8",
    title: "БПЛА",
    category: "weapons",
    coordinates: [48.0159, 37.8028],
    date: "Июнь 2022",
  },
  {
    id: "m9",
    eventId: "9",
    title: "Кинжал",
    category: "weapons",
    coordinates: [49.5883, 34.5514],
    date: "Октябрь 2022",
  },
];

export const categoryColors: Record<MapMarker["category"], string> = {
  campaign: "bg-primary hover:bg-primary/80",
  battle: "bg-secondary hover:bg-secondary/80",
  unit: "bg-accent hover:bg-accent/80",
  politics: "bg-muted hover:bg-muted/80",
  weapons: "bg-[#6b5a2d] hover:bg-[#7d6a35]",
};

export const categoryIcons: Record<MapMarker["category"], string> = {
  campaign: "Target",
  battle: "Swords",
  unit: "Shield",
  politics: "Landmark",
  weapons: "Crosshair",
};

import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { events } from "./TimelineData";

interface MapMarker {
  id: string;
  eventId: string;
  title: string;
  category: "campaign" | "battle" | "unit" | "politics" | "weapons";
  coordinates: [number, number];
  date: string;
  image?: string;
}

const markers: MapMarker[] = [
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

const categoryColors = {
  campaign: "bg-primary hover:bg-primary/80",
  battle: "bg-secondary hover:bg-secondary/80",
  unit: "bg-accent hover:bg-accent/80",
  politics: "bg-muted hover:bg-muted/80",
  weapons: "bg-[#6b5a2d] hover:bg-[#7d6a35]",
};

const categoryIcons = {
  campaign: "Target",
  battle: "Swords",
  unit: "Shield",
  politics: "Landmark",
  weapons: "Crosshair",
};

interface InteractiveMapProps {
  onMarkerClick?: (eventId: string) => void;
  selectedEventId?: string | null;
}

export default function InteractiveMap({
  onMarkerClick,
  selectedEventId,
}: InteractiveMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapInstance, setMapInstance] = useState<unknown>(null);
  const [ymapsReady, setYmapsReady] = useState(false);
  const [mapType, setMapType] = useState<"map" | "satellite" | "hybrid">("map");

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://api-maps.yandex.ru/2.1/?lang=ru_RU&apikey=";
    script.async = true;
    script.onload = () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).ymaps.ready(() => {
        setYmapsReady(true);
      });
    };
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  useEffect(() => {
    if (!ymapsReady || !mapRef.current || mapInstance) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ymaps = (window as any).ymaps;
    const map = new ymaps.Map(mapRef.current, {
      center: [48.5, 34.5],
      zoom: 6,
      controls: ["zoomControl", "fullscreenControl"],
      type: "yandex#hybrid",
    });

    map.options.set("suppressMapOpenBlock", true);
    map.behaviors.disable("scrollZoom");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const addPolygons = (geom: any, styleOptions: any) => {
      const polygons: number[][][][] =
        geom.type === "MultiPolygon" ? geom.coordinates : [geom.coordinates];
      polygons.forEach((rings) => {
        const yRings = rings.map((ring: [number, number][]) =>
          ring.map(([lng, lat]) => [lat, lng])
        );
        const polygon = new ymaps.Polygon(yRings, {}, styleOptions);
        map.geoObjects.add(polygon);
      });
    };

    // Контур России
    fetch("https://raw.githubusercontent.com/datasets/geo-boundaries-world-110m/master/countries.geojson")
      .then((res) => res.json())
      .then((data) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const russia = data.features.find((f: any) => f.properties.admin === "Russia");
        if (russia) {
          addPolygons(russia.geometry, {
            fillColor: "#2d7a4f",
            fillOpacity: 0.07,
            strokeColor: "#000000",
            strokeWidth: 2,
            strokeOpacity: 0.8,
            interactivityModel: "default#transparent",
          });
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const ukraine = data.features.find((f: any) => f.properties.admin === "Ukraine");
        if (ukraine) {
          addPolygons(ukraine.geometry, {
            fillColor: "#000000",
            fillOpacity: 0,
            strokeColor: "#000000",
            strokeWidth: 2,
            strokeOpacity: 0.8,
            interactivityModel: "default#transparent",
          });
        }
      })
      .catch(() => {});

    // Регионы Украины — новые территории РФ + Крым
    fetch("https://raw.githubusercontent.com/slawomirmatuszak/ukrainian_geodata/master/regiony.geojson")
      .then((res) => res.json())
      .then((data) => {
        const rfRegions = [
          "Донецька область",
          "Луганська область",
          "Запорізька область",
          "Херсонська область",
        ];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data.features.forEach((f: any) => {
          const name: string = f.properties.region || "";
          if (rfRegions.some((r) => name.includes(r.split(" ")[0]))) {
            addPolygons(f.geometry, {
              fillColor: "#1a3d28",
              fillOpacity: 0.55,
              strokeColor: "#2d7a4f",
              strokeWidth: 1.5,
              strokeOpacity: 0.9,
              interactivityModel: "default#transparent",
            });
          }
        });
      })
      .catch(() => {});

    const mapContainer = mapRef.current;
    if (mapContainer) {
      const style = document.createElement("style");
      style.textContent = `
        ymaps[class*="ground-pane"] {
          filter: brightness(0.7) saturate(0.8) hue-rotate(-10deg);
        }
        ymaps[class*="places-pane"] text {
          fill: #2d7a4f !important;
          stroke: #0f2e1c !important;
          stroke-width: 2px;
          paint-order: stroke;
        }
        ymaps[class*="copyrights-pane"] {
          opacity: 0.5;
        }
      `;
      document.head.appendChild(style);
    }

    markers
      .filter((marker) => marker.category === "battle")
      .forEach((marker) => {
        const event = events.find((e) => e.id === marker.eventId);
        const imageUrl = event?.preview || event?.images[0];

        const balloonContent = imageUrl
          ? `<div style="padding: 10px; min-width: 250px; max-width: 300px;">
              <img src="${imageUrl}" alt="${marker.title}" style="width: 100%; height: 150px; object-fit: cover; border-radius: 8px; margin-bottom: 8px;" />
              <strong style="font-size: 14px; color: #2d7a4f; display: block; margin-bottom: 4px;">${marker.title}</strong>
              <span style="color: #666; font-size: 12px;">${marker.date}</span>
            </div>`
          : `<div style="padding: 10px; min-width: 200px;">
              <strong style="font-size: 14px; color: #2d7a4f;">${marker.title}</strong>
              <br><span style="color: #666; font-size: 12px;">${marker.date}</span>
            </div>`;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let placemarkOptions: any;

        if (imageUrl) {
          const ImageIconLayout = ymaps.templateLayoutFactory.createClass(
            `<div style="position: relative; width: 40px; height: 40px;">
              <div style="position: absolute; top: 0; left: 0; width: 40px; height: 40px; border-radius: 50%; border: 3px solid #2d7a4f; overflow: hidden; box-shadow: 0 0 10px rgba(45, 122, 79, 0.6), 0 0 20px rgba(45, 122, 79, 0.3); animation: pulse-border 2s ease-in-out infinite;">
                <img src="${imageUrl}" style="width: 100%; height: 100%; object-fit: cover;" />
              </div>
              <style>
                @keyframes pulse-border {
                  0%, 100% { box-shadow: 0 0 10px rgba(45, 122, 79, 0.6), 0 0 20px rgba(45, 122, 79, 0.3); }
                  50% { box-shadow: 0 0 15px rgba(45, 122, 79, 0.8), 0 0 30px rgba(45, 122, 79, 0.5); }
                }
              </style>
            </div>`,
          );

          placemarkOptions = {
            iconLayout: ImageIconLayout,
            iconShape: {
              type: "Circle",
              coordinates: [0, 0],
              radius: 20,
            },
          };
        } else {
          placemarkOptions = {
            iconLayout: "default#image",
            iconImageHref:
              "data:image/svg+xml;base64," +
              btoa(`
              <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                <style>
                  @keyframes pulse {
                    0%, 100% { opacity: 0.3; r: 18; }
                    50% { opacity: 0; r: 23; }
                  }
                  .pulse-ring {
                    animation: pulse 2s ease-in-out infinite;
                    transform-origin: center;
                  }
                </style>
                <circle class="pulse-ring" cx="20" cy="20" r="18" fill="none" stroke="#2d7a4f" stroke-width="2"/>
                <circle cx="20" cy="20" r="12" fill="#2d7a4f" stroke="#1a4d30" stroke-width="2"/>
                <path d="M16 20 L20 16 L24 20 L20 24 Z" fill="#e8f5ee" stroke="#1a4d30" stroke-width="1"/>
                <circle cx="20" cy="20" r="2" fill="#1a4d30"/>
              </svg>
            `),
            iconImageSize: [40, 40],
            iconImageOffset: [-20, -20],
          };
        }

        const placemark = new ymaps.Placemark(
          marker.coordinates,
          {
            hintContent: marker.title + " — нажмите для перехода к статье",
          },
          { ...placemarkOptions, cursor: "pointer" },
        );

        placemark.events.add("click", (e: unknown) => {
          (e as { preventDefault: () => void }).preventDefault();
          if (onMarkerClick) {
            onMarkerClick(marker.eventId);
          }
        });

        map.geoObjects.add(placemark);
      });

    setMapInstance(map);

    const handleResize = () => {
      map.container.fitToViewport();
    };
    window.addEventListener("resize", handleResize);
    document.addEventListener("fullscreenchange", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("fullscreenchange", handleResize);
    };
  }, [ymapsReady, mapInstance, onMarkerClick]);

  useEffect(() => {
    if (!mapInstance) return;
    const typeMap = {
      map: "yandex#map",
      satellite: "yandex#satellite",
      hybrid: "yandex#hybrid",
    };
    mapInstance.setType(typeMap[mapType]);
  }, [mapType, mapInstance]);

  useEffect(() => {
    if (!mapInstance || !selectedEventId) return;
    const marker = markers.find((m) => m.eventId === selectedEventId);
    if (marker) {
      mapInstance.setCenter(marker.coordinates, 8, { duration: 500 });
    }
  }, [selectedEventId, mapInstance]);

  const activeCategories = [
    ...new Set(markers.map((m) => m.category)),
  ] as MapMarker["category"][];

  return (
    <div className="space-y-4">
      <Card className="border-border/50">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              {activeCategories.map((cat) => (
                <TooltipProvider key={cat}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge
                        variant="secondary"
                        className={`${categoryColors[cat]} text-white cursor-default`}
                      >
                        <Icon name={categoryIcons[cat] as string} size={12} className="mr-1" />
                        {cat === "campaign" && "Операции"}
                        {cat === "battle" && "Сражения"}
                        {cat === "unit" && "Формирования"}
                        {cat === "politics" && "Политика"}
                        {cat === "weapons" && "Вооружение"}
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Категория: {cat}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>
            <div className="flex gap-1">
              {(["map", "satellite", "hybrid"] as const).map((type) => (
                <Button
                  key={type}
                  variant={mapType === type ? "default" : "outline"}
                  size="sm"
                  onClick={() => setMapType(type)}
                  className="text-xs h-7"
                >
                  {type === "map" && "Карта"}
                  {type === "satellite" && "Спутник"}
                  {type === "hybrid" && "Гибрид"}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div
        ref={mapRef}
        className="w-full h-full min-h-[600px] rounded-lg overflow-hidden"
      />
    </div>
  );
}
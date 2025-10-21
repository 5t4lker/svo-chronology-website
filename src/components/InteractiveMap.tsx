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
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
    eventId: "3",
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
    eventId: "5a",
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
  weapons: "bg-destructive hover:bg-destructive/80",
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
  const [mapInstance, setMapInstance] = useState<any>(null);
  const [ymapsReady, setYmapsReady] = useState(false);
  const [mapType, setMapType] = useState<"map" | "satellite" | "hybrid">("map");
  const [markerSize, setMarkerSize] = useState<number>(60);
  const [markerStyle, setMarkerStyle] = useState<"circle" | "square" | "rounded">("circle");
  const [balloonImageHeight, setBalloonImageHeight] = useState<number>(150);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://api-maps.yandex.ru/2.1/?lang=ru_RU&apikey=";
    script.async = true;
    script.onload = () => {
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
    if (!ymapsReady || !mapRef.current) return;
    
    if (mapInstance) {
      mapInstance.geoObjects.removeAll();
    } else {
      const ymaps = (window as any).ymaps;
      const map = new ymaps.Map(mapRef.current, {
        center: [48.5, 34.5],
        zoom: 6,
        controls: ["zoomControl", "fullscreenControl"],
        type: "yandex#hybrid",
      });

      map.options.set("suppressMapOpenBlock", true);
      map.behaviors.disable("scrollZoom");
      setMapInstance(map);
    }

    const ymaps = (window as any).ymaps;
    const map = mapInstance || new ymaps.Map(mapRef.current, {
      center: [48.5, 34.5],
      zoom: 6,
      controls: ["zoomControl", "fullscreenControl"],
      type: "yandex#hybrid",
    });

    map.options.set("suppressMapOpenBlock", true);
    map.behaviors.disable("scrollZoom");

    const mapContainer = mapRef.current;
    if (mapContainer) {
      const style = document.createElement("style");
      style.textContent = `
        ymaps[class*="ground-pane"] {
          filter: brightness(0.7) saturate(0.8) hue-rotate(-10deg);
        }
        ymaps[class*="places-pane"] text {
          fill: #ff4444 !important;
          stroke: #330000 !important;
          stroke-width: 2px;
          paint-order: stroke;
        }
        ymaps[class*="copyrights-pane"] {
          opacity: 0.5;
        }
      `;
      document.head.appendChild(style);
    }

    const getBorderRadius = () => {
      switch(markerStyle) {
        case 'circle': return '50%';
        case 'square': return '0';
        case 'rounded': return '12px';
        default: return '50%';
      }
    };

    markers
      .filter((marker) => marker.category === "battle")
      .forEach((marker) => {
        const event = events.find(e => e.id === marker.eventId);
        const imageUrl = event?.preview || event?.images[0];
        
        const balloonContent = imageUrl 
          ? `<div style="padding: 10px; min-width: 250px; max-width: 300px;">
              <img src="${imageUrl}" alt="${marker.title}" style="width: 100%; height: ${balloonImageHeight}px; object-fit: cover; border-radius: 8px; margin-bottom: 8px;" />
              <strong style="font-size: 14px; color: #dc2626; display: block; margin-bottom: 4px;">${marker.title}</strong>
              <span style="color: #666; font-size: 12px;">${marker.date}</span>
            </div>`
          : `<div style="padding: 10px; min-width: 200px;">
              <strong style="font-size: 14px; color: #dc2626;">${marker.title}</strong>
              <br><span style="color: #666; font-size: 12px;">${marker.date}</span>
            </div>`;
        
        let placemarkOptions: any;
        
        if (imageUrl) {
          const borderRadius = getBorderRadius();
          const ImageIconLayout = ymaps.templateLayoutFactory.createClass(
            `<div style="position: relative; width: ${markerSize}px; height: ${markerSize}px;">
              <div style="position: absolute; top: 0; left: 0; width: ${markerSize}px; height: ${markerSize}px; border-radius: ${borderRadius}; border: 4px solid #dc2626; overflow: hidden; box-shadow: 0 0 15px rgba(220, 38, 38, 0.6), 0 0 30px rgba(220, 38, 38, 0.3); animation: pulse-border 2s ease-in-out infinite;">
                <img src="${imageUrl}" style="width: 100%; height: 100%; object-fit: cover;" />
              </div>
              <style>
                @keyframes pulse-border {
                  0%, 100% { box-shadow: 0 0 15px rgba(220, 38, 38, 0.6), 0 0 30px rgba(220, 38, 38, 0.3); }
                  50% { box-shadow: 0 0 25px rgba(220, 38, 38, 0.8), 0 0 45px rgba(220, 38, 38, 0.5); }
                }
              </style>
            </div>`
          );
          
          placemarkOptions = {
            iconLayout: ImageIconLayout,
            iconShape: {
              type: markerStyle === 'circle' ? 'Circle' : 'Rectangle',
              coordinates: [0, 0],
              radius: markerSize / 2
            }
          };
        } else {
          placemarkOptions = {
            iconLayout: "default#image",
            iconImageHref:
              "data:image/svg+xml;base64," +
              btoa(`
              <svg width="${markerSize}" height="${markerSize}" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
                <style>
                  @keyframes pulse {
                    0%, 100% { opacity: 0.3; r: 28; }
                    50% { opacity: 0; r: 35; }
                  }
                  .pulse-ring {
                    animation: pulse 2s ease-in-out infinite;
                    transform-origin: center;
                  }
                </style>
                <circle class="pulse-ring" cx="30" cy="30" r="28" fill="none" stroke="#dc2626" stroke-width="2"/>
                <circle cx="30" cy="30" r="18" fill="#dc2626" stroke="#7f1d1d" stroke-width="3"/>
                <path d="M24 30 L30 24 L36 30 L30 36 Z" fill="#fef2f2" stroke="#991b1b" stroke-width="1.5"/>
                <circle cx="30" cy="30" r="3" fill="#991b1b"/>
              </svg>
            `),
            iconImageSize: [markerSize, markerSize],
            iconImageOffset: [-markerSize/2, -markerSize/2],
          };
        }
        
        const placemark = new ymaps.Placemark(
          marker.coordinates,
          {
            hintContent: marker.title,
            balloonContent: balloonContent,
          },
          placemarkOptions
        );

        placemark.events.add("click", () => {
          onMarkerClick?.(marker.eventId);
        });

        map.geoObjects.add(placemark);
      });

    if (!mapInstance) {
      setMapInstance(map);
    }
  }, [ymapsReady, mapRef.current, markerSize, markerStyle, balloonImageHeight]);

  useEffect(() => {
    if (!mapInstance) return;

    let newType = "yandex#hybrid";
    if (mapType === "satellite") {
      newType = "yandex#satellite";
    } else if (mapType === "map") {
      newType = "yandex#map";
    }
    mapInstance.setType(newType);
  }, [mapType, mapInstance]);



  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="relative w-full aspect-video bg-muted">
          <div ref={mapRef} className="w-full h-full" />

          <div className="absolute top-2 left-2 right-2 md:top-4 md:left-4 md:right-4 flex flex-wrap gap-1 md:gap-2 pointer-events-none z-30">
            <div className="backdrop-blur-sm rounded-md md:rounded-lg p-1.5 md:p-3 shadow-lg pointer-events-auto bg-[#000000]">
              <h3 className="font-semibold text-[10px] md:text-sm mb-1 md:mb-2 flex items-center gap-1 md:gap-2 text-gray-50">
                <Icon name="Map" size={12} className="md:w-4 md:h-4" />
                <span className="hidden xs:inline">Театр военных действий</span>
                <span className="xs:hidden">ТВД</span>
              </h3>
              <div className="flex flex-wrap gap-1 md:gap-2 text-[9px] md:text-xs bg-[#000000]">
                <div className="flex items-center gap-0.5 md:gap-1">
                  <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-red-700" />
                  <span>Сражение</span>
                </div>
              </div>

            </div>
            
            <div className="backdrop-blur-sm rounded-md md:rounded-lg p-2 md:p-3 shadow-lg pointer-events-auto bg-[#000000] text-gray-50">
              <h4 className="font-semibold text-[10px] md:text-xs mb-2 flex items-center gap-1">
                <Icon name="Settings" size={12} className="md:w-3.5 md:h-3.5" />
                <span>Настройки</span>
              </h4>
              
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label htmlFor="marker-size" className="text-[9px] md:text-xs text-gray-300">
                    Размер меток: {markerSize}px
                  </Label>
                  <Slider
                    id="marker-size"
                    min={40}
                    max={100}
                    step={10}
                    value={[markerSize]}
                    onValueChange={(value) => setMarkerSize(value[0])}
                    className="w-32 md:w-40"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="marker-style" className="text-[9px] md:text-xs text-gray-300">
                    Стиль меток
                  </Label>
                  <Select value={markerStyle} onValueChange={(value: any) => setMarkerStyle(value)}>
                    <SelectTrigger id="marker-style" className="h-7 text-[10px] md:text-xs w-32 md:w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="circle">Круглые</SelectItem>
                      <SelectItem value="rounded">Скругленные</SelectItem>
                      <SelectItem value="square">Квадратные</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="balloon-height" className="text-[9px] md:text-xs text-gray-300">
                    Высота превью: {balloonImageHeight}px
                  </Label>
                  <Slider
                    id="balloon-height"
                    min={100}
                    max={300}
                    step={25}
                    value={[balloonImageHeight]}
                    onValueChange={(value) => setBalloonImageHeight(value[0])}
                    className="w-32 md:w-40"
                  />
                </div>
              </div>
            </div>

            <div className="backdrop-blur-sm p-1 md:p-2 shadow-lg pointer-events-auto rounded-lg md:rounded-xl bg-[#000000]">
              <div className="flex gap-0.5 md:gap-1">
                <Button
                  variant={mapType === "hybrid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setMapType("hybrid")}
                  className="h-6 px-1.5 md:h-8 md:px-3 text-[10px] md:text-sm"
                >
                  <Icon
                    name="Layers"
                    size={12}
                    className="mr-0.5 md:mr-1 md:w-3.5 md:h-3.5"
                  />
                  <span className="hidden xs:inline">Темная</span>
                </Button>
                <Button
                  variant={mapType === "satellite" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setMapType("satellite")}
                  className="h-6 px-1.5 md:h-8 md:px-3 text-[10px] md:text-sm"
                >
                  <Icon
                    name="Satellite"
                    size={12}
                    className="mr-0.5 md:mr-1 md:w-3.5 md:h-3.5"
                  />
                  <span className="hidden xs:inline">Спутник</span>
                </Button>
                <Button
                  variant={mapType === "map" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setMapType("map")}
                  className="h-6 px-1.5 md:h-8 md:px-3 text-[10px] md:text-sm"
                >
                  <Icon
                    name="Map"
                    size={12}
                    className="mr-0.5 md:mr-1 md:w-3.5 md:h-3.5"
                  />
                  <span className="hidden xs:inline">Светлая</span>
                </Button>
              </div>
            </div>
          </div>

          <div className="absolute bottom-4 right-4 pointer-events-none z-10">
            <Button
              variant="secondary"
              size="sm"
              className="backdrop-blur-sm bg-background/90 pointer-events-auto"
              onClick={() => onMarkerClick?.("")}
            >
              <Icon name="ZoomOut" size={16} className="mr-2" />
              Сбросить выделение
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
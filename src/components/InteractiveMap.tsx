import { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface MapMarker {
  id: string;
  eventId: string;
  title: string;
  category: 'campaign' | 'battle' | 'unit' | 'politics' | 'weapons';
  coordinates: [number, number];
  date: string;
}

const markers: MapMarker[] = [
  {
    id: 'm1',
    eventId: '1',
    title: 'Начало СВО',
    category: 'politics',
    coordinates: [50.4501, 30.5234],
    date: '24 февраля 2022',
  },
  {
    id: 'm2',
    eventId: '2',
    title: 'Киевская операция',
    category: 'campaign',
    coordinates: [50.4501, 30.5234],
    date: 'Март 2022',
  },
  {
    id: 'm3',
    eventId: '3',
    title: 'Битва за Мариуполь',
    category: 'battle',
    coordinates: [47.0971, 37.5432],
    date: 'Май 2022',
  },
  {
    id: 'm4',
    eventId: '4',
    title: 'Референдумы',
    category: 'politics',
    coordinates: [47.8388, 35.1396],
    date: 'Сентябрь 2022',
  },
  {
    id: 'm5',
    eventId: '5',
    title: 'Добровольческие формирования',
    category: 'unit',
    coordinates: [48.5132, 39.2085],
    date: 'Декабрь 2022',
  },
  {
    id: 'm5a',
    eventId: '5a',
    title: 'Высадка гостомельского десанта',
    category: 'battle',
    coordinates: [50.6037, 30.1919],
    date: '24 февраля 2022',
  },
  {
    id: 'm6',
    eventId: '6',
    title: 'Взятие Артёмовска',
    category: 'battle',
    coordinates: [48.5924, 37.9991],
    date: 'Май 2023',
  },
  {
    id: 'm7',
    eventId: '7',
    title: 'Калибр',
    category: 'weapons',
    coordinates: [46.4825, 30.7233],
    date: 'Март 2022',
  },
  {
    id: 'm8',
    eventId: '8',
    title: 'БПЛА',
    category: 'weapons',
    coordinates: [48.0159, 37.8028],
    date: 'Июнь 2022',
  },
  {
    id: 'm9',
    eventId: '9',
    title: 'Кинжал',
    category: 'weapons',
    coordinates: [49.5883, 34.5514],
    date: 'Октябрь 2022',
  },
];

const categoryColors = {
  campaign: 'bg-primary hover:bg-primary/80',
  battle: 'bg-secondary hover:bg-secondary/80',
  unit: 'bg-accent hover:bg-accent/80',
  politics: 'bg-muted hover:bg-muted/80',
  weapons: 'bg-destructive hover:bg-destructive/80',
};

const categoryIcons = {
  campaign: 'Target',
  battle: 'Swords',
  unit: 'Shield',
  politics: 'Landmark',
  weapons: 'Crosshair',
};

interface InteractiveMapProps {
  onMarkerClick?: (eventId: string) => void;
  selectedEventId?: string | null;
}

export default function InteractiveMap({ onMarkerClick, selectedEventId }: InteractiveMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapInstance, setMapInstance] = useState<any>(null);
  const [ymapsReady, setYmapsReady] = useState(false);
  const [mapType, setMapType] = useState<'map' | 'satellite' | 'hybrid'>('map');

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://api-maps.yandex.ru/2.1/?lang=ru_RU&apikey=';
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
    if (!ymapsReady || !mapRef.current || mapInstance) return;

    const ymaps = (window as any).ymaps;
    const map = new ymaps.Map(mapRef.current, {
      center: [48.5, 34.5],
      zoom: 6,
      controls: ['zoomControl', 'fullscreenControl'],
      type: 'yandex#map',
    });

    markers
      .filter((marker) => marker.category === 'battle')
      .forEach((marker) => {
        const placemark = new ymaps.Placemark(
          marker.coordinates,
          {
            hintContent: marker.title,
            balloonContent: `<div style="padding: 10px; min-width: 200px;">
              <strong style="font-size: 14px; color: #dc2626;">${marker.title}</strong>
              <br><span style="color: #666; font-size: 12px;">${marker.date}</span>
            </div>`,
          },
          {
            iconLayout: 'default#image',
            iconImageHref: 'data:image/svg+xml;base64,' + btoa(`
              <svg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
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
            iconImageSize: [60, 60],
            iconImageOffset: [-30, -30],
          }
        );

        placemark.events.add('click', () => {
          onMarkerClick?.(marker.eventId);
        });

        map.geoObjects.add(placemark);
      });

    setMapInstance(map);
  }, [ymapsReady, mapRef.current]);

  useEffect(() => {
    if (!mapInstance) return;
    
    let newType = 'yandex#map';
    if (mapType === 'satellite') {
      newType = 'yandex#satellite';
    } else if (mapType === 'hybrid') {
      newType = 'yandex#hybrid';
    }
    mapInstance.setType(newType);
  }, [mapType, mapInstance]);

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="relative w-full aspect-video bg-muted">
          <div ref={mapRef} className="w-full h-full" />

          <div className="absolute top-2 left-2 right-2 md:top-4 md:left-4 md:right-4 flex flex-wrap gap-1 md:gap-2 pointer-events-none z-10">
            <div className="backdrop-blur-sm rounded-md md:rounded-lg p-1.5 md:p-3 shadow-lg pointer-events-auto bg-[#000000]">
              <h3 className="font-semibold text-[10px] md:text-sm mb-1 md:mb-2 flex items-center gap-1 md:gap-2 text-gray-50">
                <Icon name="Map" size={12} className="md:w-4 md:h-4" />
                <span className="hidden xs:inline">Театр военных действий</span>
                <span className="xs:hidden">ТВД</span>
              </h3>
              <div className="flex flex-wrap gap-1 md:gap-2 text-[9px] md:text-xs bg-[#000000]">
                <div className="flex items-center gap-0.5 md:gap-1">
                  <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-red-800" />
                  <span>Сражение</span>
                </div>
              </div>
            </div>
            
            <div className="backdrop-blur-sm p-1 md:p-2 shadow-lg pointer-events-auto rounded-lg md:rounded-xl bg-[#000000]">
              <div className="flex gap-0.5 md:gap-1">
                <Button
                  variant={mapType === 'map' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setMapType('map')}
                  className="h-6 px-1.5 md:h-8 md:px-3 text-[10px] md:text-sm"
                >
                  <Icon name="Map" size={12} className="mr-0.5 md:mr-1 md:w-3.5 md:h-3.5" />
                  <span className="hidden xs:inline">Карта</span>
                </Button>
                <Button
                  variant={mapType === 'satellite' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setMapType('satellite')}
                  className="h-6 px-1.5 md:h-8 md:px-3 text-[10px] md:text-sm"
                >
                  <Icon name="Satellite" size={12} className="mr-0.5 md:mr-1 md:w-3.5 md:h-3.5" />
                  <span className="hidden xs:inline">Спутник</span>
                </Button>
                <Button
                  variant={mapType === 'hybrid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setMapType('hybrid')}
                  className="h-6 px-1.5 md:h-8 md:px-3 text-[10px] md:text-sm"
                >
                  <Icon name="Layers" size={12} className="mr-0.5 md:mr-1 md:w-3.5 md:h-3.5" />
                  <span className="hidden xs:inline">Гибрид</span>
                </Button>
              </div>
            </div>
          </div>

          <div className="absolute bottom-4 right-4 pointer-events-none z-10">
            <Button
              variant="secondary"
              size="sm"
              className="backdrop-blur-sm bg-background/90 pointer-events-auto"
              onClick={() => onMarkerClick?.('')}
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
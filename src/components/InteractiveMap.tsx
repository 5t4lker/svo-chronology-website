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
  const [hoveredMarker, setHoveredMarker] = useState<string | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const [ymapsReady, setYmapsReady] = useState(false);
  const [mapInstance, setMapInstance] = useState<any>(null);

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
    });

    markers
      .filter((marker) => marker.category === 'battle')
      .forEach((marker) => {
        const placemark = new ymaps.Placemark(
          marker.coordinates,
          {
            hintContent: marker.title,
            balloonContent: `<strong>${marker.title}</strong><br>${marker.date}`,
          },
          {
            preset: 'islands#icon',
            iconColor: getCategoryColor(marker.category),
          }
        );

        placemark.events.add('click', () => {
          onMarkerClick?.(marker.eventId);
        });

        map.geoObjects.add(placemark);
      });

    setMapInstance(map);
  }, [ymapsReady, mapRef.current]);

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      campaign: '#0088ff',
      battle: '#ff4444',
      unit: '#44ff44',
      politics: '#888888',
      weapons: '#ff8800',
    };
    return colors[category] || '#0088ff';
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="relative w-full aspect-video bg-muted">
          <div ref={mapRef} className="w-full h-full" />

          <div className="absolute top-4 left-4 right-4 flex flex-wrap gap-2 pointer-events-none">
            <div className="bg-background/90 backdrop-blur-sm rounded-lg p-3 shadow-lg pointer-events-auto">
              <h3 className="font-semibold text-sm mb-2 flex items-center gap-2">
                <Icon name="Map" size={16} />
                Театр военных действий
              </h3>
              <div className="flex flex-wrap gap-2 text-xs">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-secondary" />
                  <span>Сражение</span>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute bottom-4 right-4 pointer-events-none">
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
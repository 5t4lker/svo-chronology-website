import { useState } from 'react';
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
  category: 'campaign' | 'battle' | 'unit' | 'politics';
  position: { x: number; y: number };
  date: string;
}

const markers: MapMarker[] = [
  {
    id: 'm1',
    eventId: '1',
    title: 'Начало СВО',
    category: 'politics',
    position: { x: 45, y: 50 },
    date: '24 февраля 2022',
  },
  {
    id: 'm2',
    eventId: '2',
    title: 'Киевская операция',
    category: 'campaign',
    position: { x: 50, y: 30 },
    date: 'Март 2022',
  },
  {
    id: 'm3',
    eventId: '3',
    title: 'Битва за Мариуполь',
    category: 'battle',
    position: { x: 75, y: 65 },
    date: 'Май 2022',
  },
  {
    id: 'm4',
    eventId: '4',
    title: 'Референдумы',
    category: 'politics',
    position: { x: 65, y: 55 },
    date: 'Сентябрь 2022',
  },
  {
    id: 'm5',
    eventId: '5',
    title: 'Добровольческие формирования',
    category: 'unit',
    position: { x: 70, y: 60 },
    date: 'Декабрь 2022',
  },
  {
    id: 'm6',
    eventId: '3',
    title: 'Взятие Артёмовска',
    category: 'battle',
    position: { x: 68, y: 48 },
    date: 'Май 2023',
  },
];

const categoryColors = {
  campaign: 'bg-primary hover:bg-primary/80',
  battle: 'bg-secondary hover:bg-secondary/80',
  unit: 'bg-accent hover:bg-accent/80',
  politics: 'bg-muted hover:bg-muted/80',
};

const categoryIcons = {
  campaign: 'Target',
  battle: 'Swords',
  unit: 'Shield',
  politics: 'Landmark',
};

interface InteractiveMapProps {
  onMarkerClick?: (eventId: string) => void;
  selectedEventId?: string | null;
}

export default function InteractiveMap({ onMarkerClick, selectedEventId }: InteractiveMapProps) {
  const [hoveredMarker, setHoveredMarker] = useState<string | null>(null);

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="relative w-full aspect-video bg-muted">
          <img
            src="https://cdn.poehali.dev/projects/43268c76-63e5-42b2-a2b6-42db7f46e265/files/18b77d0b-c9e6-487d-8292-a59b03278183.jpg"
            alt="Карта театра военных действий"
            className="w-full h-full object-cover opacity-70"
          />
          
          <div className="absolute inset-0">
            <TooltipProvider>
              {markers.map((marker) => (
                <Tooltip key={marker.id}>
                  <TooltipTrigger asChild>
                    <button
                      className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${
                        selectedEventId === marker.eventId
                          ? 'scale-125 z-20'
                          : hoveredMarker === marker.id
                          ? 'scale-110 z-10'
                          : 'scale-100 z-0'
                      }`}
                      style={{
                        left: `${marker.position.x}%`,
                        top: `${marker.position.y}%`,
                      }}
                      onClick={() => onMarkerClick?.(marker.eventId)}
                      onMouseEnter={() => setHoveredMarker(marker.id)}
                      onMouseLeave={() => setHoveredMarker(null)}
                    >
                      <div
                        className={`w-10 h-10 rounded-full border-4 border-background shadow-lg flex items-center justify-center ${
                          categoryColors[marker.category]
                        } ${
                          selectedEventId === marker.eventId
                            ? 'ring-4 ring-primary/50'
                            : ''
                        }`}
                      >
                        <Icon
                          name={categoryIcons[marker.category] as any}
                          size={20}
                          className="text-white"
                        />
                      </div>
                      {(hoveredMarker === marker.id || selectedEventId === marker.eventId) && (
                        <div className="absolute top-12 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                          <Badge className="shadow-lg">{marker.date}</Badge>
                        </div>
                      )}
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="font-semibold">{marker.title}</p>
                    <p className="text-xs text-muted-foreground">{marker.date}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </TooltipProvider>
          </div>

          <div className="absolute top-4 left-4 right-4 flex flex-wrap gap-2">
            <div className="bg-background/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
              <h3 className="font-semibold text-sm mb-2 flex items-center gap-2">
                <Icon name="Map" size={16} />
                Театр военных действий
              </h3>
              <div className="flex flex-wrap gap-2 text-xs">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-primary" />
                  <span>Кампания</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-secondary" />
                  <span>Сражение</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-accent" />
                  <span>Подразделение</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-muted" />
                  <span>Политика</span>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute bottom-4 right-4">
            <Button
              variant="secondary"
              size="sm"
              className="backdrop-blur-sm bg-background/90"
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

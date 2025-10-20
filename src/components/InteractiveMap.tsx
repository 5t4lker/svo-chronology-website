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

    const ukraineBorder = new ymaps.Polygon(
      [[
        [52.379189, 22.137059], [51.618017, 23.521729], [51.520802, 24.005127],
        [51.383896, 25.773926], [51.106056, 26.630859], [50.454450, 27.686768],
        [50.004444, 28.222656], [49.635665, 29.140625], [49.320062, 30.014648],
        [48.922499, 31.783447], [48.574790, 33.046875], [48.370848, 34.057617],
        [48.166085, 35.024414], [47.989922, 35.815430], [47.754098, 36.562500],
        [47.517201, 37.617188], [47.279229, 38.364258], [46.800059, 39.331055],
        [46.377254, 40.078125], [45.890008, 40.605469], [45.583290, 40.078125],
        [45.367584, 39.199219], [45.274886, 37.968750], [45.213004, 36.694336],
        [45.521744, 35.859375], [45.951150, 35.156250], [46.316584, 34.628906],
        [46.800059, 34.057617], [47.219568, 33.398438], [47.694975, 32.871094],
        [48.048711, 32.387695], [48.458352, 31.992188], [48.922499, 31.640625],
        [49.496675, 31.201172], [49.894634, 30.805664], [50.233152, 30.410156],
        [50.680797, 30.014648], [51.013755, 29.663086], [51.344339, 29.267578],
        [51.618017, 28.828125], [51.944265, 28.564453], [52.187405, 28.300781],
        [52.375599, 27.949219], [52.536273, 27.553711], [52.642431, 27.114258],
        [52.696361, 26.630859], [52.696361, 26.103516], [52.642431, 25.488281],
        [52.536273, 24.873047], [52.348763, 24.082031], [52.160455, 23.466797],
        [51.971485, 22.851563], [51.835778, 22.368164], [52.379189, 22.137059]
      ]],
      {},
      {
        fillColor: '#0066cc20',
        strokeColor: '#0066cc',
        strokeWidth: 3,
        strokeStyle: 'solid',
      }
    );

    const belarusBorder = new ymaps.Polygon(
      [[
        [56.172195, 23.178711], [55.776573, 23.950195], [55.379110, 25.224609],
        [55.078367, 26.323242], [54.724620, 27.421875], [54.316523, 28.520508],
        [53.904338, 29.179688], [53.540307, 29.838867], [53.225768, 30.102539],
        [52.855864, 30.498047], [52.482780, 30.761719], [52.160455, 31.113281],
        [51.835778, 31.201172], [51.618017, 30.541992], [51.454451, 29.926758],
        [51.344339, 29.355469], [51.289406, 28.872070], [51.289406, 28.300781],
        [51.399206, 27.773438], [51.618017, 27.158203], [51.890054, 26.586914],
        [52.214339, 26.059570], [52.536273, 25.576172], [52.802761, 25.180664],
        [53.067627, 24.829102], [53.435719, 24.477539], [53.800651, 24.213867],
        [54.162434, 23.994141], [54.571508, 23.730469], [54.977614, 23.510742],
        [55.428838, 23.334961], [55.825973, 23.203125], [56.172195, 23.178711]
      ]],
      {},
      {
        fillColor: '#88888820',
        strokeColor: '#888888',
        strokeWidth: 2,
        strokeStyle: 'solid',
      }
    );

    const dnrBorder = new ymaps.Polygon(
      [[
        [48.700, 37.500], [48.550, 38.200], [48.400, 38.800],
        [48.200, 39.300], [48.000, 39.700], [47.800, 40.000],
        [47.600, 40.100], [47.400, 40.000], [47.200, 39.700],
        [47.000, 39.300], [46.900, 38.800], [46.900, 38.200],
        [47.000, 37.700], [47.200, 37.300], [47.400, 37.100],
        [47.700, 37.000], [48.000, 37.100], [48.300, 37.300],
        [48.500, 37.400], [48.700, 37.500]
      ]],
      {},
      {
        fillColor: '#dc262620',
        strokeColor: '#dc2626',
        strokeWidth: 3,
        strokeStyle: 'solid',
      }
    );

    const lnrBorder = new ymaps.Polygon(
      [[
        [49.300, 38.000], [49.200, 38.500], [49.100, 39.200],
        [49.000, 39.700], [48.900, 40.000], [48.700, 40.100],
        [48.500, 40.000], [48.400, 39.600], [48.400, 39.100],
        [48.500, 38.500], [48.600, 38.000], [48.700, 37.600],
        [48.900, 37.400], [49.100, 37.500], [49.200, 37.700],
        [49.300, 38.000]
      ]],
      {},
      {
        fillColor: '#dc262620',
        strokeColor: '#dc2626',
        strokeWidth: 3,
        strokeStyle: 'solid',
      }
    );

    const zaporizhzhiaBorder = new ymaps.Polygon(
      [[
        [47.800, 34.800], [47.600, 35.400], [47.400, 36.000],
        [47.100, 36.500], [46.900, 36.800], [46.600, 37.000],
        [46.400, 36.900], [46.300, 36.600], [46.300, 36.200],
        [46.400, 35.700], [46.600, 35.200], [46.900, 34.800],
        [47.200, 34.600], [47.500, 34.700], [47.800, 34.800]
      ]],
      {},
      {
        fillColor: '#dc262620',
        strokeColor: '#dc2626',
        strokeWidth: 3,
        strokeStyle: 'solid',
      }
    );

    const khersonBorder = new ymaps.Polygon(
      [[
        [46.600, 32.500], [46.400, 33.200], [46.200, 33.800],
        [46.000, 34.300], [45.700, 34.700], [45.500, 35.000],
        [45.300, 35.100], [45.100, 34.900], [45.000, 34.500],
        [45.000, 34.000], [45.100, 33.400], [45.300, 32.900],
        [45.600, 32.500], [45.900, 32.300], [46.200, 32.400],
        [46.400, 32.400], [46.600, 32.500]
      ]],
      {},
      {
        fillColor: '#dc262620',
        strokeColor: '#dc2626',
        strokeWidth: 3,
        strokeStyle: 'solid',
      }
    );

    map.geoObjects.add(ukraineBorder);
    map.geoObjects.add(belarusBorder);
    map.geoObjects.add(dnrBorder);
    map.geoObjects.add(lnrBorder);
    map.geoObjects.add(zaporizhzhiaBorder);
    map.geoObjects.add(khersonBorder);

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
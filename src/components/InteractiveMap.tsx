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
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapInstance, setMapInstance] = useState<any>(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=&language=ru`;
    script.async = true;
    script.onload = initMap;
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  const initMap = () => {
    if (!mapRef.current) return;

    const mapStyles = [
      {
        "featureType": "all",
        "elementType": "geometry",
        "stylers": [{ "color": "#242f3e" }]
      },
      {
        "featureType": "all",
        "elementType": "labels.text.stroke",
        "stylers": [{ "lightness": -80 }]
      },
      {
        "featureType": "administrative",
        "elementType": "labels.text.fill",
        "stylers": [{ "color": "#746855" }]
      },
      {
        "featureType": "landscape",
        "elementType": "geometry",
        "stylers": [{ "color": "#1e2838" }]
      },
      {
        "featureType": "poi",
        "elementType": "geometry",
        "stylers": [{ "color": "#283d5a" }]
      },
      {
        "featureType": "road",
        "elementType": "geometry.fill",
        "stylers": [{ "color": "#2c3e50" }]
      },
      {
        "featureType": "road",
        "elementType": "geometry.stroke",
        "stylers": [{ "color": "#1a252f" }]
      },
      {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [{ "color": "#17263c" }]
      }
    ];

    const google = (window as any).google;
    const map = new google.maps.Map(mapRef.current, {
      center: { lat: 48.5, lng: 34.5 },
      zoom: 6,
      styles: mapStyles,
      disableDefaultUI: false,
      zoomControl: true,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: true,
    });

    markers
      .filter((marker) => marker.category === 'battle')
      .forEach((marker) => {
        const svgMarker = {
          path: 'M 20,0 C 8.954,0 0,8.954 0,20 c 0,11.046 8.954,20 20,20 11.046,0 20,-8.954 20,-20 C 40,8.954 31.046,0 20,0 Z m 0,6 l 6,6 -6,6 -6,-6 z m 0,8 c 1.657,0 3,1.343 3,3 0,1.657 -1.343,3 -3,3 -1.657,0 -3,-1.343 -3,-3 0,-1.657 1.343,-3 3,-3 z',
          fillColor: '#dc2626',
          fillOpacity: 1,
          strokeColor: '#7f1d1d',
          strokeWeight: 2,
          scale: 1,
          anchor: new google.maps.Point(20, 20),
        };

        const gMarker = new google.maps.Marker({
          position: { lat: marker.coordinates[0], lng: marker.coordinates[1] },
          map: map,
          icon: svgMarker,
          title: marker.title,
          animation: google.maps.Animation.DROP,
        });

        const infoWindow = new google.maps.InfoWindow({
          content: `
            <div style="padding: 10px; min-width: 200px; color: #000;">
              <strong style="font-size: 14px; color: #dc2626;">${marker.title}</strong>
              <br><span style="color: #666; font-size: 12px;">${marker.date}</span>
            </div>
          `,
        });

        gMarker.addListener('click', () => {
          infoWindow.open(map, gMarker);
          onMarkerClick?.(marker.eventId);
        });
      });

    setMapInstance(map);
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="relative w-full aspect-video bg-muted">
          <div ref={mapRef} className="w-full h-full" />

          <div className="absolute top-4 left-4 right-4 flex flex-wrap gap-2 pointer-events-none z-10">
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
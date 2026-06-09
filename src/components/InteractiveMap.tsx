import { useState, useEffect, useRef } from "react";
import { markers, MapMarker } from "./mapData";
import { useMapInstance } from "./useMapInstance";
import MapToolbar from "./MapToolbar";

interface InteractiveMapProps {
  onMarkerClick?: (eventId: string) => void;
  selectedEventId?: string | null;
}

export default function InteractiveMap({
  onMarkerClick,
  selectedEventId,
}: InteractiveMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
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

  const mapInstance = useMapInstance(mapRef, { ymapsReady, onMarkerClick });

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
      <MapToolbar
        activeCategories={activeCategories}
        mapType={mapType}
        onMapTypeChange={setMapType}
      />
      <div
        ref={mapRef}
        className="w-full h-full min-h-[600px] rounded-lg overflow-hidden"
      />
    </div>
  );
}

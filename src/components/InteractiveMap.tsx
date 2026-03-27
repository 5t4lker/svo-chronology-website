import { useEffect, useRef } from "react";

interface InteractiveMapProps {
  onMarkerClick?: (eventId: string) => void;
  selectedEventId?: string | null;
}

export default function InteractiveMap(_props: InteractiveMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const div = document.createElement("div");
    div.setAttribute("data-uid", "1795199102");
    container.appendChild(div);

    const script = document.createElement("script");
    script.src =
      "https://cdndc.img.ria.ru/dc/kay-n/2022/special-operation-map-fullscreen//inject.js?uid=1795199102&t=7a&v=3058";
    script.async = true;
    container.appendChild(script);

    return () => {
      container.innerHTML = "";
    };
  }, []);

  return (
    <div className="w-full rounded-lg overflow-hidden" style={{ minHeight: 600 }}>
      <div ref={containerRef} className="w-full h-full" style={{ minHeight: 600 }} />
    </div>
  );
}
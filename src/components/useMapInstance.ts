import { useEffect, useRef, useState } from "react";
import { markers } from "./mapData";
import { events } from "./TimelineData";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type YmapsInstance = any;

interface UseMapInstanceProps {
  ymapsReady: boolean;
  onMarkerClick?: (eventId: string) => void;
}

export function useMapInstance(
  mapRef: React.RefObject<HTMLDivElement>,
  { ymapsReady, onMarkerClick }: UseMapInstanceProps,
) {
  const [mapInstance, setMapInstance] = useState<YmapsInstance>(null);
  const onMarkerClickRef = useRef(onMarkerClick);
  onMarkerClickRef.current = onMarkerClick;

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

    fetch("https://raw.githubusercontent.com/datasets/geo-boundaries-world-110m/master/countries.geojson")
      .then((res) => res.json())
      .then((data) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const russia = data.features.find((f: any) => f.properties.admin === "Russia");
        if (russia) {
          addPolygons(russia.geometry, {
            fillColor: "#ffffff",
            fillOpacity: 0,
            strokeColor: "#ffffff",
            strokeWidth: 1.5,
            strokeOpacity: 0.3,
            interactivityModel: "default#transparent",
          });
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const ukraine = data.features.find((f: any) => f.properties.admin === "Ukraine");
        if (ukraine) {
          addPolygons(ukraine.geometry, {
            fillColor: "#ffffff",
            fillOpacity: 0,
            strokeColor: "#ffffff",
            strokeWidth: 3,
            strokeOpacity: 0.9,
            interactivityModel: "default#transparent",
          });
        }
      })
      .catch(() => {});

    fetch("https://raw.githubusercontent.com/slawomirmatuszak/ukrainian_geodata/master/regiony.geojson")
      .then((res) => res.json())
      .then((data) => {
        const rfRegions = [
          "Донецька область",
          "Луганська область",
          "Запорізька область",
          "Херсонська область",
          "Автономна Республіка Крим",
          "Севастополь",
        ];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data.features.forEach((f: any) => {
          const name: string = f.properties.region || "";
          if (rfRegions.some((r) => name.includes(r.split(" ")[0]))) {
            addPolygons(f.geometry, {
              fillColor: "#8b1a1a",
              fillOpacity: 0.65,
              strokeColor: "#c0392b",
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
          filter: brightness(0.55) saturate(0.5) hue-rotate(200deg);
        }
        ymaps[class*="places-pane"] text {
          fill: #e0e8ff !important;
          stroke: #0a1628 !important;
          stroke-width: 2px;
          paint-order: stroke;
        }
        ymaps[class*="copyrights-pane"] {
          opacity: 0.5;
        }
        ymaps[class*="balloon__layout"],
        ymaps[class*="balloon__content"],
        ymaps[class*="balloon__tail"],
        ymaps[class*="balloon__shadow"],
        ymaps[class*="balloon"] {
          background: transparent !important;
          border: none !important;
          box-shadow: none !important;
          padding: 0 !important;
        }
        ymaps[class*="balloon__close"],
        ymaps[class*="balloon__close-button"] {
          display: none !important;
        }
      `;
      document.head.appendChild(style);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).__mapGoToEvent = (eventId: string) => {
      if (onMarkerClickRef.current) onMarkerClickRef.current(eventId);
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).__mapCloseBalloon = (markerId: string) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).__balloonRefs?.[markerId]?.balloon.close();
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).__balloonRefs = {};

    markers
      .filter((marker) => marker.category === "battle")
      .forEach((marker) => {
        const event = events.find((e) => e.id === marker.eventId);
        const imageUrl = event?.preview || event?.images[0];

        const eventDesc = event?.description
          ? event.description.slice(0, 100) + (event.description.length > 100 ? "…" : "")
          : "";

        const cardStyle = `
          background: #0d1b2e;
          border: 1px solid #c0392b;
          border-radius: 10px;
          padding: 14px;
          min-width: 260px;
          max-width: 300px;
          font-family: sans-serif;
          box-shadow: 0 8px 32px rgba(0,0,0,0.7), 0 0 20px rgba(192,57,43,0.25);
          animation: balloonFadeIn 0.25s ease-out both;
        `;
        const animStyle = `<style>
          @keyframes balloonFadeIn {
            from { opacity: 0; transform: translateY(8px) scale(0.97); }
            to   { opacity: 1; transform: translateY(0) scale(1); }
          }
          .map-goto-btn:hover { background: #e74c3c !important; transform: translateY(-1px); }
          .map-goto-btn { transition: background 0.2s, transform 0.15s !important; }
          .map-close-btn:hover { background: rgba(255,255,255,0.15) !important; }
          .map-close-btn { transition: background 0.15s !important; }
        </style>`;
        const btnStyle = `class="map-goto-btn" style="width:100%;padding:9px 12px;background:#c0392b;color:#fff;border:none;border-radius:7px;cursor:pointer;font-size:13px;font-weight:700;letter-spacing:0.3px;"`;
        const closeBtn = `<button class="map-close-btn" onclick="window.__mapCloseBalloon && window.__mapCloseBalloon('${marker.id}')" style="position:absolute;top:8px;right:8px;width:24px;height:24px;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.15);border-radius:50%;color:#c8d8f0;cursor:pointer;font-size:14px;line-height:1;display:flex;align-items:center;justify-content:center;padding:0;">✕</button>`;

        const balloonContent = imageUrl
          ? `${animStyle}<div style="${cardStyle}position:relative;">
              ${closeBtn}
              <img src="${imageUrl}" alt="${marker.title}" style="width:100%;height:140px;object-fit:cover;border-radius:7px;margin-bottom:10px;border:1px solid #8b1a1a;" />
              <strong style="font-size:14px;color:#e87070;display:block;margin-bottom:3px;">${marker.title}</strong>
              <span style="color:#7a9abf;font-size:11px;display:block;margin-bottom:8px;text-transform:uppercase;letter-spacing:0.5px;">${marker.date}</span>
              ${eventDesc ? `<p style="color:#b0c4de;font-size:12px;margin:0 0 12px;line-height:1.6;">${eventDesc}</p>` : ""}
              <button onclick="window.__mapGoToEvent && window.__mapGoToEvent('${marker.eventId}')" ${btnStyle}>
                ➜ Перейти к статье
              </button>
            </div>`
          : `${animStyle}<div style="${cardStyle}position:relative;">
              ${closeBtn}
              <strong style="font-size:14px;color:#e87070;display:block;margin-bottom:3px;">${marker.title}</strong>
              <span style="color:#7a9abf;font-size:11px;display:block;margin-bottom:8px;text-transform:uppercase;letter-spacing:0.5px;">${marker.date}</span>
              ${eventDesc ? `<p style="color:#b0c4de;font-size:12px;margin:0 0 12px;line-height:1.6;">${eventDesc}</p>` : ""}
              <button onclick="window.__mapGoToEvent && window.__mapGoToEvent('${marker.eventId}')" ${btnStyle}>
                ➜ Перейти к статье
              </button>
            </div>`;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let placemarkOptions: any;

        const hoverStyle = `
          transition: transform 0.2s ease;
          transform-origin: center;
          display: block;
        `;

        if (imageUrl) {
          const ImageIconLayout = ymaps.templateLayoutFactory.createClass(
            `<div class="marker-wrap" style="position:relative;width:56px;height:56px;${hoverStyle}">
              <div style="position:absolute;top:0;left:0;width:56px;height:56px;border-radius:50%;border:3px solid #c0392b;overflow:hidden;box-shadow:0 0 14px rgba(192,57,43,0.8),0 0 28px rgba(192,57,43,0.4);animation:pulse-border 2s ease-in-out infinite;">
                <img src="${imageUrl}" style="width:100%;height:100%;object-fit:cover;" />
              </div>
              <style>
                @keyframes pulse-border {
                  0%,100% { box-shadow: 0 0 14px rgba(192,57,43,0.8), 0 0 28px rgba(192,57,43,0.4); }
                  50%      { box-shadow: 0 0 22px rgba(231,76,60,1), 0 0 44px rgba(192,57,43,0.6); }
                }
                .marker-wrap:hover { transform: scale(1.35); }
              </style>
            </div>`,
          );

          placemarkOptions = {
            iconLayout: ImageIconLayout,
            iconShape: { type: "Circle", coordinates: [0, 0], radius: 36 },
          };
        } else {
          const SvgIconLayout = ymaps.templateLayoutFactory.createClass(
            `<div class="marker-svg-wrap" style="${hoverStyle} width:56px;height:56px;">
              <svg width="56" height="56" viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg">
                <style>
                  @keyframes pulse { 0%,100% { opacity:0.4; } 50% { opacity:0; } }
                  .pulse-ring { animation: pulse 2s ease-in-out infinite; }
                  .marker-svg-wrap:hover { transform: scale(1.35); }
                </style>
                <circle class="pulse-ring" cx="28" cy="28" r="26" fill="none" stroke="#e74c3c" stroke-width="2"/>
                <circle cx="28" cy="28" r="17" fill="#0d1b2e" stroke="#c0392b" stroke-width="2.5"/>
                <path d="M22 28 L28 22 L34 28 L28 34 Z" fill="#e87070" stroke="#8b1a1a" stroke-width="1"/>
                <circle cx="28" cy="28" r="3" fill="#8b1a1a"/>
              </svg>
            </div>`,
          );

          placemarkOptions = {
            iconLayout: SvgIconLayout,
            iconShape: { type: "Circle", coordinates: [0, 0], radius: 36 },
          };
        }

        const placemark = new ymaps.Placemark(
          marker.coordinates,
          {
            balloonContent,
            hintContent: marker.title,
          },
          {
            ...placemarkOptions,
            cursor: "pointer",
            balloonCloseButton: true,
            hideIconOnBalloonOpen: false,
          },
        );

        placemark.events.add("mouseenter", () => {
          placemark.balloon.open();
        });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).__balloonRefs[marker.id] = placemark;

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
  }, [ymapsReady, mapInstance, mapRef]);

  return mapInstance;
}
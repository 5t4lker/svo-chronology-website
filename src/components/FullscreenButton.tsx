import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";

export default function FullscreenButton() {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleChange);
    return () => document.removeEventListener("fullscreenchange", handleChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  return (
    <Button
      onClick={toggleFullscreen}
      size="icon"
      variant="outline"
      className="fixed bottom-4 right-4 z-50 rounded-full shadow-lg bg-background/80 backdrop-blur-sm"
      aria-label={isFullscreen ? "Свернуть окно" : "Развернуть на весь экран"}
    >
      <Icon name={isFullscreen ? "Minimize" : "Maximize"} size={18} />
    </Button>
  );
}

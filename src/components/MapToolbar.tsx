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
import { MapMarker, categoryColors, categoryIcons } from "./mapData";

interface MapToolbarProps {
  activeCategories: MapMarker["category"][];
  mapType: "map" | "satellite" | "hybrid";
  onMapTypeChange: (type: "map" | "satellite" | "hybrid") => void;
}

export default function MapToolbar({
  activeCategories,
  mapType,
  onMapTypeChange,
}: MapToolbarProps) {
  return (
    <Card className="border-border/50">
      <CardContent className="p-4">
        <div className="flex flex-wrap items-center justify-between gap-3 my-0 mx-0 py-[5px]">
          <div className="flex flex-wrap gap-2">
            {activeCategories.map((cat) => (
              <TooltipProvider key={cat}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge
                      variant="secondary"
                      className={`${categoryColors[cat]} text-white cursor-default`}
                    >
                      <Icon name={categoryIcons[cat]} size={12} className="mr-1" />
                      {cat === "campaign" && "Операции"}
                      {cat === "battle" && "Сражения"}
                      {cat === "unit" && "Формирования"}
                      {cat === "politics" && "Политика"}
                      {cat === "weapons" && "Вооружение"}
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Категория: {cat}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>
          <div className="flex gap-1">
            {(["map", "satellite", "hybrid"] as const).map((type) => (
              <Button
                key={type}
                variant={mapType === type ? "default" : "outline"}
                size="sm"
                onClick={() => onMapTypeChange(type)}
                className="text-xs h-7"
              >
                {type === "map" && "Карта"}
                {type === "satellite" && "Спутник"}
                {type === "hybrid" && "Гибрид"}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
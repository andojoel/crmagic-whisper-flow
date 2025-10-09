import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Skeleton } from "@/components/ui/skeleton";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface HeatmapPoint {
  x: number;
  y: number;
  intensity: number;
  clicks: number;
  element?: string;
}

interface VariantPreviewProps {
  imageUrl: string;
  heatmapPoints: HeatmapPoint[];
  imageWidth: number;
  imageHeight: number;
  isLoading?: boolean;
}

export const VariantPreviewWithHeatmap = ({
  imageUrl,
  heatmapPoints,
  imageWidth,
  imageHeight,
  isLoading = false,
}: VariantPreviewProps) => {
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [opacity, setOpacity] = useState(55);

  const getHeatmapColor = (intensity: number) => {
    // Color scale: cool→hot
    const colors = [
      { pos: 0, color: "#2E7BFF" },    // Low - blue
      { pos: 0.25, color: "#33C3A6" }, // Low-mid - teal
      { pos: 0.5, color: "#F5D90A" },  // Mid - yellow
      { pos: 0.75, color: "#FF6A3A" }, // High - orange
      { pos: 1, color: "#E5484D" },    // Very high - red
    ];

    for (let i = 0; i < colors.length - 1; i++) {
      if (intensity >= colors[i].pos && intensity <= colors[i + 1].pos) {
        const range = colors[i + 1].pos - colors[i].pos;
        const rangeIntensity = (intensity - colors[i].pos) / range;
        return interpolateColor(colors[i].color, colors[i + 1].color, rangeIntensity);
      }
    }
    return colors[colors.length - 1].color;
  };

  const interpolateColor = (color1: string, color2: string, factor: number) => {
    const c1 = hexToRgb(color1);
    const c2 = hexToRgb(color2);
    const r = Math.round(c1.r + (c2.r - c1.r) * factor);
    const g = Math.round(c1.g + (c2.g - c1.g) * factor);
    const b = Math.round(c1.b + (c2.b - c1.b) * factor);
    return `rgb(${r}, ${g}, ${b})`;
  };

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : { r: 0, g: 0, b: 0 };
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-40" />
        <Skeleton className="w-full aspect-[1200/628] rounded-lg" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowHeatmap(!showHeatmap)}
          className="gap-2"
        >
          {showHeatmap ? (
            <>
              <EyeOff className="h-4 w-4" />
              Hide heatmap
            </>
          ) : (
            <>
              <Eye className="h-4 w-4" />
              Show heatmap
            </>
          )}
        </Button>

        {showHeatmap && (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Opacity:</span>
              <Slider
                value={[opacity]}
                onValueChange={(value) => setOpacity(value[0])}
                max={100}
                step={5}
                className="w-24"
              />
              <span className="text-sm text-muted-foreground w-10">{opacity}%</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-muted-foreground">Low</span>
              <div className="flex gap-0.5">
                <div className="w-4 h-4 rounded-sm" style={{ backgroundColor: "#2E7BFF" }} />
                <div className="w-4 h-4 rounded-sm" style={{ backgroundColor: "#33C3A6" }} />
                <div className="w-4 h-4 rounded-sm" style={{ backgroundColor: "#F5D90A" }} />
                <div className="w-4 h-4 rounded-sm" style={{ backgroundColor: "#FF6A3A" }} />
                <div className="w-4 h-4 rounded-sm" style={{ backgroundColor: "#E5484D" }} />
              </div>
              <span className="text-muted-foreground">High</span>
            </div>
          </div>
        )}
      </div>

      <div className="relative w-full aspect-[1200/628] bg-muted rounded-lg overflow-hidden">
        <img
          src={imageUrl}
          alt="Campaign variant"
          className="w-full h-full object-contain"
        />

        {showHeatmap && (
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ mixBlendMode: "multiply" }}
          >
            <defs>
              {heatmapPoints.map((point, idx) => (
                <radialGradient key={idx} id={`heat-${idx}`}>
                  <stop
                    offset="0%"
                    stopColor={getHeatmapColor(point.intensity)}
                    stopOpacity={opacity / 100}
                  />
                  <stop
                    offset="50%"
                    stopColor={getHeatmapColor(point.intensity)}
                    stopOpacity={(opacity / 100) * 0.5}
                  />
                  <stop offset="100%" stopColor="transparent" stopOpacity="0" />
                </radialGradient>
              ))}
            </defs>
            {heatmapPoints.map((point, idx) => {
              const radius = 30 + point.intensity * 50;
              return (
                <TooltipProvider key={idx}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <circle
                        cx={`${(point.x / imageWidth) * 100}%`}
                        cy={`${(point.y / imageHeight) * 100}%`}
                        r={radius}
                        fill={`url(#heat-${idx})`}
                        className="pointer-events-auto cursor-pointer"
                        style={{ filter: "blur(20px)" }}
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      <div className="space-y-1">
                        <p className="font-medium">{point.clicks} clicks</p>
                        <p className="text-sm text-muted-foreground">
                          Density: {(point.intensity * 100).toFixed(1)}%
                        </p>
                        {point.element && (
                          <p className="text-sm text-muted-foreground">Element: {point.element}</p>
                        )}
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              );
            })}
          </svg>
        )}
      </div>
    </div>
  );
};

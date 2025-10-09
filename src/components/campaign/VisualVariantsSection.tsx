import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VariantPreviewWithHeatmap } from "./VariantPreviewWithHeatmap";
import { VariantMeta } from "./VariantMeta";

interface HeatmapPoint {
  x: number;
  y: number;
  intensity: number;
  clicks: number;
  element?: string;
}

interface VariantData {
  imageUrl: string;
  heatmapPoints: HeatmapPoint[];
  performance: {
    ctr: number;
    conversionRate: number;
    revenue: number;
  };
}

interface VisualVariantsSectionProps {
  variantAImageUrl: string;
  variantBImageUrl: string;
  startDate: string;
  endDate: string;
  environment?: string;
  campaignType?: string;
  isLoading?: boolean;
}

// Mock function to generate realistic heatmap data
const generateMockHeatmapPoints = (seed: number): HeatmapPoint[] => {
  const points: HeatmapPoint[] = [];
  const numClusters = 3 + Math.floor(Math.random() * 3);

  for (let cluster = 0; cluster < numClusters; cluster++) {
    const centerX = 200 + Math.random() * 800;
    const centerY = 100 + Math.random() * 400;
    const clusterSize = 15 + Math.floor(Math.random() * 20);
    const baseIntensity = 0.4 + Math.random() * 0.6;

    for (let i = 0; i < clusterSize; i++) {
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * 80;
      const x = centerX + Math.cos(angle) * distance;
      const y = centerY + Math.sin(angle) * distance;
      const intensity = Math.max(
        0.1,
        baseIntensity - (distance / 80) * 0.3 + (Math.random() - 0.5) * 0.2
      );
      const clicks = Math.floor(50 + intensity * 200);

      points.push({
        x: Math.max(50, Math.min(1150, x)),
        y: Math.max(50, Math.min(578, y)),
        intensity: Math.min(1, intensity),
        clicks,
        element: cluster === 0 ? "CTA Button" : cluster === 1 ? "Card Image" : undefined,
      });
    }
  }

  return points;
};

export const VisualVariantsSection = ({
  variantAImageUrl,
  variantBImageUrl,
  startDate,
  endDate,
  environment = "Web",
  campaignType = "Banner",
  isLoading = false,
}: VisualVariantsSectionProps) => {
  const [activeVariant, setActiveVariant] = useState<"A" | "B">("A");

  // Mock data - in production, this would come from API
  const variantAData: VariantData = {
    imageUrl: variantAImageUrl,
    heatmapPoints: generateMockHeatmapPoints(1),
    performance: {
      ctr: 3.2,
      conversionRate: 2.1,
      revenue: 15420.5,
    },
  };

  const variantBData: VariantData = {
    imageUrl: variantBImageUrl,
    heatmapPoints: generateMockHeatmapPoints(2),
    performance: {
      ctr: 3.8,
      conversionRate: 2.6,
      revenue: 18230.75,
    },
  };

  const currentData = activeVariant === "A" ? variantAData : variantBData;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Visual Variants</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs
          value={activeVariant}
          onValueChange={(value) => setActiveVariant(value as "A" | "B")}
          className="w-full"
        >
          <TabsList className="mb-6">
            <TabsTrigger value="A">Version 1</TabsTrigger>
            <TabsTrigger value="B">Version 2</TabsTrigger>
          </TabsList>

          <TabsContent value="A" className="mt-0">
            <div className="space-y-8">
              <VariantPreviewWithHeatmap
                imageUrl={variantAData.imageUrl}
                heatmapPoints={variantAData.heatmapPoints}
                imageWidth={1200}
                imageHeight={628}
                isLoading={isLoading}
              />
              <VariantMeta
                environment={environment}
                campaignType={campaignType}
                startDate={startDate}
                endDate={endDate}
                performance={variantAData.performance}
              />
            </div>
          </TabsContent>

          <TabsContent value="B" className="mt-0">
            <div className="space-y-8">
              <VariantPreviewWithHeatmap
                imageUrl={variantBData.imageUrl}
                heatmapPoints={variantBData.heatmapPoints}
                imageWidth={1200}
                imageHeight={628}
                isLoading={isLoading}
              />
              <VariantMeta
                environment={environment}
                campaignType={campaignType}
                startDate={startDate}
                endDate={endDate}
                performance={variantBData.performance}
              />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

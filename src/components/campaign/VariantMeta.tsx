import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";

interface PerformanceSnapshot {
  ctr: number;
  conversionRate: number;
  revenue: number;
}

interface VariantMetaProps {
  environment?: string;
  campaignType?: string;
  startDate: string;
  endDate: string;
  performance?: PerformanceSnapshot;
}

export const VariantMeta = ({
  environment = "Web",
  campaignType = "Banner",
  startDate,
  endDate,
  performance,
}: VariantMetaProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Variant details</h3>
        <dl className="space-y-3">
          <div className="flex justify-between py-2 border-b border-border">
            <dt className="text-sm text-muted-foreground">Environment</dt>
            <dd className="text-sm font-medium">{environment}</dd>
          </div>
          <div className="flex justify-between py-2 border-b border-border">
            <dt className="text-sm text-muted-foreground">Campaign type</dt>
            <dd className="text-sm font-medium">{campaignType}</dd>
          </div>
          <div className="flex justify-between py-2 border-b border-border">
            <dt className="text-sm text-muted-foreground">Start date</dt>
            <dd className="text-sm font-medium">
              {format(new Date(startDate), "dd MMM yyyy")}
            </dd>
          </div>
          <div className="flex justify-between py-2 border-b border-border">
            <dt className="text-sm text-muted-foreground">End date</dt>
            <dd className="text-sm font-medium">
              {format(new Date(endDate), "dd MMM yyyy")}
            </dd>
          </div>
        </dl>
      </div>

      {performance && (
        <div>
          <h4 className="text-sm font-semibold mb-3">Performance snapshot</h4>
          <div className="grid grid-cols-1 gap-3">
            <Card className="bg-muted/50">
              <CardContent className="pt-4 pb-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">CTR</p>
                  <p className="text-2xl font-semibold">{performance.ctr.toFixed(1)}%</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-muted/50">
              <CardContent className="pt-4 pb-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Conversion rate</p>
                  <p className="text-2xl font-semibold">{performance.conversionRate.toFixed(1)}%</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-muted/50">
              <CardContent className="pt-4 pb-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Revenue</p>
                  <p className="text-2xl font-semibold">
                    €{performance.revenue.toLocaleString("en-GB", { maximumFractionDigits: 0 })}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

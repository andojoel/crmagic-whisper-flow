import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { format } from "date-fns";
import { TrendingUp, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface PerformanceSnapshot {
  ctr: number;
  conversionRate: number;
  revenue: number;
  targets?: {
    ctr: number;
    conversionRate: number;
    revenue: number;
  };
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
  const navigate = useNavigate();
  
  const getMetricStatus = (actual: number, target: number) => {
    return actual >= target ? "success" : "error";
  };

  const getProgressPercentage = (actual: number, target: number) => {
    return Math.min((actual / target) * 100, 100);
  };

  const hasUnmetTargets = performance?.targets && (
    performance.ctr < performance.targets.ctr ||
    performance.conversionRate < performance.targets.conversionRate ||
    performance.revenue < performance.targets.revenue
  );

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
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-semibold">Performance snapshot</h4>
            {hasUnmetTargets && (
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 text-accent hover:text-accent hover:bg-accent/10"
                onClick={() => navigate('/campaign/1/improve')}
              >
                <AlertCircle className="h-4 w-4" />
                <span className="hidden sm:inline">Improve</span>
              </Button>
            )}
          </div>
          <div className="grid grid-cols-1 gap-4">
            {/* CTR Card */}
            <Card className={
              performance.targets
                ? getMetricStatus(performance.ctr, performance.targets.ctr) === "success"
                  ? "bg-gradient-to-br from-success/10 via-success/5 to-transparent border-success/30 shadow-sm hover:shadow-md transition-smooth"
                  : "bg-gradient-to-br from-destructive/10 via-destructive/5 to-transparent border-destructive/30 shadow-sm hover:shadow-md transition-smooth"
                : "bg-gradient-to-br from-muted/50 to-transparent shadow-sm hover:shadow-md transition-smooth"
            }>
              <CardContent className="pt-5 pb-5">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">CTR</p>
                    {performance.targets && (
                      getMetricStatus(performance.ctr, performance.targets.ctr) === "success" ? (
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-success/20">
                          <TrendingUp className="h-4 w-4 text-success" />
                        </div>
                      ) : (
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-destructive/20">
                          <AlertCircle className="h-4 w-4 text-destructive" />
                        </div>
                      )
                    )}
                  </div>
                  <p className="text-3xl font-bold tracking-tight">{performance.ctr.toFixed(1)}%</p>
                  {performance.targets && (
                    <>
                      <Progress 
                        value={getProgressPercentage(performance.ctr, performance.targets.ctr)}
                        className="h-2.5"
                      />
                      <p className="text-xs text-muted-foreground font-medium">
                        Target: {performance.targets.ctr.toFixed(1)}%
                      </p>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Conversion Rate Card */}
            <Card className={
              performance.targets
                ? getMetricStatus(performance.conversionRate, performance.targets.conversionRate) === "success"
                  ? "bg-gradient-to-br from-success/10 via-success/5 to-transparent border-success/30 shadow-sm hover:shadow-md transition-smooth"
                  : "bg-gradient-to-br from-destructive/10 via-destructive/5 to-transparent border-destructive/30 shadow-sm hover:shadow-md transition-smooth"
                : "bg-gradient-to-br from-muted/50 to-transparent shadow-sm hover:shadow-md transition-smooth"
            }>
              <CardContent className="pt-5 pb-5">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Conversion rate</p>
                    {performance.targets && (
                      getMetricStatus(performance.conversionRate, performance.targets.conversionRate) === "success" ? (
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-success/20">
                          <TrendingUp className="h-4 w-4 text-success" />
                        </div>
                      ) : (
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-destructive/20">
                          <AlertCircle className="h-4 w-4 text-destructive" />
                        </div>
                      )
                    )}
                  </div>
                  <p className="text-3xl font-bold tracking-tight">{performance.conversionRate.toFixed(1)}%</p>
                  {performance.targets && (
                    <>
                      <Progress 
                        value={getProgressPercentage(performance.conversionRate, performance.targets.conversionRate)}
                        className="h-2.5"
                      />
                      <p className="text-xs text-muted-foreground font-medium">
                        Target: {performance.targets.conversionRate.toFixed(1)}%
                      </p>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Revenue Card */}
            <Card className={
              performance.targets
                ? getMetricStatus(performance.revenue, performance.targets.revenue) === "success"
                  ? "bg-gradient-to-br from-success/10 via-success/5 to-transparent border-success/30 shadow-sm hover:shadow-md transition-smooth"
                  : "bg-gradient-to-br from-destructive/10 via-destructive/5 to-transparent border-destructive/30 shadow-sm hover:shadow-md transition-smooth"
                : "bg-gradient-to-br from-muted/50 to-transparent shadow-sm hover:shadow-md transition-smooth"
            }>
              <CardContent className="pt-5 pb-5">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Revenue</p>
                    {performance.targets && (
                      getMetricStatus(performance.revenue, performance.targets.revenue) === "success" ? (
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-success/20">
                          <TrendingUp className="h-4 w-4 text-success" />
                        </div>
                      ) : (
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-destructive/20">
                          <AlertCircle className="h-4 w-4 text-destructive" />
                        </div>
                      )
                    )}
                  </div>
                  <p className="text-3xl font-bold tracking-tight">
                    €{performance.revenue.toLocaleString("en-GB", { maximumFractionDigits: 0 })}
                  </p>
                  {performance.targets && (
                    <>
                      <Progress 
                        value={getProgressPercentage(performance.revenue, performance.targets.revenue)}
                        className="h-2.5"
                      />
                      <p className="text-xs text-muted-foreground font-medium">
                        Target: €{performance.targets.revenue.toLocaleString("en-GB", { maximumFractionDigits: 0 })}
                      </p>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

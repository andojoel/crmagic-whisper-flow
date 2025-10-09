import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface KPICardProps {
  title: string;
  value: string | number;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  suffix?: string;
}

export function KPICard({ title, value, trend, suffix }: KPICardProps) {
  return (
    <div className="bg-card rounded-lg border border-border-subtle p-5 shadow-card transition-smooth hover:shadow-card-lg">
      <p className="text-sm text-muted-foreground mb-2">{title}</p>
      <div className="flex items-end gap-3">
        <p className="text-3xl font-heading font-semibold">
          {value}
          {suffix && <span className="text-xl ml-1">{suffix}</span>}
        </p>
        {trend && (
          <div
            className={cn(
              'flex items-center gap-1 text-sm font-medium mb-1',
              trend.isPositive ? 'text-success' : 'text-danger'
            )}
          >
            {trend.isPositive ? (
              <TrendingUp className="h-4 w-4" />
            ) : (
              <TrendingDown className="h-4 w-4" />
            )}
            <span>{Math.abs(trend.value)}%</span>
          </div>
        )}
      </div>
    </div>
  );
}

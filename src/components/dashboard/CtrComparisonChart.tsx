import { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Calendar, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format, startOfYear, endOfDay } from 'date-fns';
import { cn } from '@/lib/utils';

interface CtrData {
  date: string;
  version: 'A' | 'B';
  clicks: number;
  impressions: number;
}

interface MonthlyData {
  month: string;
  versionA: number;
  versionB: number;
  versionAClicks: number;
  versionAImpressions: number;
  versionBClicks: number;
  versionBImpressions: number;
}

interface CtrComparisonChartProps {
  campaignId: string;
  defaultFrom?: Date;
  defaultTo?: Date;
}

// Generate mock daily CTR data
const generateMockData = (from: Date, to: Date): CtrData[] => {
  const data: CtrData[] = [];
  const current = new Date(from);
  
  while (current <= to) {
    // Version A baseline 2.2-3.8%
    const versionABaseCtr = 2.5 + Math.sin(current.getMonth() / 2) * 0.6 + (Math.random() - 0.5) * 0.8;
    const versionAImpressions = Math.floor(8000 + Math.random() * 15000);
    const versionAClicks = Math.floor(versionAImpressions * (versionABaseCtr / 100));
    
    // Version B baseline 1.8-4.6%
    const versionBBaseCtr = 3.0 + Math.sin(current.getMonth() / 2.5) * 1.0 + (Math.random() - 0.5) * 1.2;
    const versionBImpressions = Math.floor(7000 + Math.random() * 17000);
    const versionBClicks = Math.floor(versionBImpressions * (versionBBaseCtr / 100));
    
    data.push({
      date: format(current, 'yyyy-MM-dd'),
      version: 'A',
      clicks: versionAClicks,
      impressions: versionAImpressions,
    });
    
    data.push({
      date: format(current, 'yyyy-MM-dd'),
      version: 'B',
      clicks: versionBClicks,
      impressions: versionBImpressions,
    });
    
    current.setDate(current.getDate() + 1);
  }
  
  return data;
};

// Aggregate daily data to monthly weighted CTR
const aggregateToMonthly = (data: CtrData[]): MonthlyData[] => {
  const monthlyMap = new Map<string, {
    aClicks: number;
    aImpressions: number;
    bClicks: number;
    bImpressions: number;
  }>();
  
  data.forEach(item => {
    const monthKey = item.date.substring(0, 7); // YYYY-MM
    
    if (!monthlyMap.has(monthKey)) {
      monthlyMap.set(monthKey, {
        aClicks: 0,
        aImpressions: 0,
        bClicks: 0,
        bImpressions: 0,
      });
    }
    
    const monthData = monthlyMap.get(monthKey)!;
    if (item.version === 'A') {
      monthData.aClicks += item.clicks;
      monthData.aImpressions += item.impressions;
    } else {
      monthData.bClicks += item.clicks;
      monthData.bImpressions += item.impressions;
    }
  });
  
  return Array.from(monthlyMap.entries())
    .map(([month, data]) => ({
      month: format(new Date(month + '-01'), 'MMM'),
      versionA: data.aImpressions > 0 ? (data.aClicks / data.aImpressions) * 100 : 0,
      versionB: data.bImpressions > 0 ? (data.bClicks / data.bImpressions) * 100 : 0,
      versionAClicks: data.aClicks,
      versionAImpressions: data.aImpressions,
      versionBClicks: data.bClicks,
      versionBImpressions: data.bImpressions,
    }))
    .sort((a, b) => {
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return monthNames.indexOf(a.month) - monthNames.indexOf(b.month);
    });
};

export function CtrComparisonChart({ campaignId, defaultFrom, defaultTo }: CtrComparisonChartProps) {
  const [dateFrom, setDateFrom] = useState<Date>(defaultFrom || startOfYear(new Date()));
  const [dateTo, setDateTo] = useState<Date>(defaultTo || endOfDay(new Date()));
  const [isLoading] = useState(false);
  const [visibleVersions, setVisibleVersions] = useState({ A: true, B: true });

  const monthlyData = useMemo(() => {
    const dailyData = generateMockData(dateFrom, dateTo);
    return aggregateToMonthly(dailyData);
  }, [dateFrom, dateTo]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload || payload.length === 0) return null;

    const data = payload[0].payload;
    
    return (
      <div className="bg-card border border-border-subtle shadow-lg rounded-lg p-3 text-sm">
        <p className="font-semibold mb-2">{data.month}</p>
        {visibleVersions.A && (
          <div className="mb-2">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#5FD3B3' }} />
              <span className="font-medium">Version A</span>
            </div>
            <p className="text-muted-foreground ml-5">CTR: {data.versionA.toFixed(1)}%</p>
            <p className="text-muted-foreground ml-5">Clicks: {data.versionAClicks.toLocaleString()}</p>
            <p className="text-muted-foreground ml-5">Impressions: {data.versionAImpressions.toLocaleString()}</p>
          </div>
        )}
        {visibleVersions.B && (
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#6F52FF' }} />
              <span className="font-medium">Version B</span>
            </div>
            <p className="text-muted-foreground ml-5">CTR: {data.versionB.toFixed(1)}%</p>
            <p className="text-muted-foreground ml-5">Clicks: {data.versionBClicks.toLocaleString()}</p>
            <p className="text-muted-foreground ml-5">Impressions: {data.versionBImpressions.toLocaleString()}</p>
          </div>
        )}
      </div>
    );
  };

  const toggleVersion = (version: 'A' | 'B') => {
    setVisibleVersions(prev => ({ ...prev, [version]: !prev[version] }));
  };

  if (isLoading) {
    return (
      <div className="bg-card rounded-lg border border-border-subtle shadow-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-heading font-semibold">Total CTR – Version A vs Version B</h3>
        </div>
        <div className="h-64 flex items-center justify-center">
          <div className="space-y-3 w-full">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-8 bg-muted/20 rounded animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (monthlyData.length === 0) {
    return (
      <div className="bg-card rounded-lg border border-border-subtle shadow-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-heading font-semibold">Total CTR – Version A vs Version B</h3>
        </div>
        <div className="h-64 flex items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">No CTR data for the selected range.</p>
            <Button
              variant="outline"
              onClick={() => {
                setDateFrom(startOfYear(new Date()));
                setDateTo(endOfDay(new Date()));
              }}
            >
              Reset filter
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg border border-border-subtle shadow-card p-6">
      <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
        <div>
          <h3 className="text-lg font-heading font-semibold mb-2">Total CTR – Version A vs Version B</h3>
          <div className="flex items-center gap-4 text-sm">
            <button
              onClick={() => toggleVersion('A')}
              className={cn(
                "flex items-center gap-2 transition-opacity",
                !visibleVersions.A && "opacity-40"
              )}
            >
              <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#5FD3B3' }} />
              <span>Version A</span>
            </button>
            <button
              onClick={() => toggleVersion('B')}
              className={cn(
                "flex items-center gap-2 transition-opacity",
                !visibleVersions.B && "opacity-40"
              )}
            >
              <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#6F52FF' }} />
              <span>Version B</span>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Calendar className="h-4 w-4" />
                {format(dateFrom, 'MMM d')} - {format(dateTo, 'MMM d, yyyy')}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <div className="p-4 space-y-4">
                <div>
                  <p className="text-sm font-medium mb-2">From</p>
                  <CalendarComponent
                    mode="single"
                    selected={dateFrom}
                    onSelect={(date) => date && setDateFrom(date)}
                    className="pointer-events-auto"
                  />
                </div>
                <div>
                  <p className="text-sm font-medium mb-2">To</p>
                  <CalendarComponent
                    mode="single"
                    selected={dateTo}
                    onSelect={(date) => date && setDateTo(date)}
                    className="pointer-events-auto"
                  />
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={monthlyData}
            margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
            barGap={4}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#EAECEF" vertical={false} />
            <XAxis
              dataKey="month"
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              axisLine={{ stroke: '#EAECEF' }}
              tickLine={false}
            />
            <YAxis
              domain={[0, 10]}
              ticks={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
              tickFormatter={(value) => `${value}%`}
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              axisLine={{ stroke: '#EAECEF' }}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
            {visibleVersions.A && (
              <Bar
                dataKey="versionA"
                fill="#5FD3B3"
                radius={[4, 4, 0, 0]}
                maxBarSize={40}
              />
            )}
            {visibleVersions.B && (
              <Bar
                dataKey="versionB"
                fill="#6F52FF"
                radius={[4, 4, 0, 0]}
                maxBarSize={40}
              />
            )}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

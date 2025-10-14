import { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import { cn } from '@/lib/utils';

interface MetricData {
  date: string;
  version: 'A' | 'B';
  clicks: number;
  impressions: number;
  conversions: number;
  revenue: number;
}

type MetricType = 'ctr' | 'cr' | 'revenue';

interface DailyData {
  date: string;
  versionA: number;
  versionB: number;
  versionAClicks: number;
  versionAImpressions: number;
  versionBClicks: number;
  versionBImpressions: number;
  versionAConversions: number;
  versionBConversions: number;
  versionARevenue: number;
  versionBRevenue: number;
}

interface CtrComparisonChartProps {
  campaignId: string;
  defaultFrom?: Date;
  defaultTo?: Date;
}

// Generate mock daily metric data where Version B is always better
const generateMockData = (from: Date, to: Date): MetricData[] => {
  const data: MetricData[] = [];
  const current = new Date(from);
  
  while (current <= to) {
    // Version A (lower performance)
    const versionABaseCtr = 3.5 + Math.sin(current.getDate() / 5) * 0.4 + (Math.random() - 0.5) * 0.3;
    const versionABaseCr = 1.8 + Math.sin(current.getDate() / 6) * 0.3 + (Math.random() - 0.5) * 0.2;
    const versionAImpressions = Math.floor(8000 + Math.random() * 12000);
    const versionAClicks = Math.floor(versionAImpressions * (versionABaseCtr / 100));
    const versionAConversions = Math.floor(versionAClicks * (versionABaseCr / 100));
    const versionARevenue = versionAConversions * (60 + Math.random() * 40);
    
    // Version B (higher performance - always 15-25% better)
    const versionBBaseCtr = versionABaseCtr * (1.15 + Math.random() * 0.1);
    const versionBBaseCr = versionABaseCr * (1.15 + Math.random() * 0.1);
    const versionBImpressions = Math.floor(8000 + Math.random() * 12000);
    const versionBClicks = Math.floor(versionBImpressions * (versionBBaseCtr / 100));
    const versionBConversions = Math.floor(versionBClicks * (versionBBaseCr / 100));
    const versionBRevenue = versionBConversions * (70 + Math.random() * 50);
    
    data.push({
      date: format(current, 'yyyy-MM-dd'),
      version: 'A',
      clicks: versionAClicks,
      impressions: versionAImpressions,
      conversions: versionAConversions,
      revenue: versionARevenue,
    });
    
    data.push({
      date: format(current, 'yyyy-MM-dd'),
      version: 'B',
      clicks: versionBClicks,
      impressions: versionBImpressions,
      conversions: versionBConversions,
      revenue: versionBRevenue,
    });
    
    current.setDate(current.getDate() + 1);
  }
  
  return data;
};

// Process daily data
const processToDaily = (data: MetricData[]): DailyData[] => {
  const dailyMap = new Map<string, {
    aClicks: number;
    aImpressions: number;
    aConversions: number;
    aRevenue: number;
    bClicks: number;
    bImpressions: number;
    bConversions: number;
    bRevenue: number;
  }>();
  
  data.forEach(item => {
    const dayKey = item.date; // YYYY-MM-DD
    
    if (!dailyMap.has(dayKey)) {
      dailyMap.set(dayKey, {
        aClicks: 0,
        aImpressions: 0,
        aConversions: 0,
        aRevenue: 0,
        bClicks: 0,
        bImpressions: 0,
        bConversions: 0,
        bRevenue: 0,
      });
    }
    
    const dayData = dailyMap.get(dayKey)!;
    if (item.version === 'A') {
      dayData.aClicks += item.clicks;
      dayData.aImpressions += item.impressions;
      dayData.aConversions += item.conversions;
      dayData.aRevenue += item.revenue;
    } else {
      dayData.bClicks += item.clicks;
      dayData.bImpressions += item.impressions;
      dayData.bConversions += item.conversions;
      dayData.bRevenue += item.revenue;
    }
  });
  
  return Array.from(dailyMap.entries())
    .map(([date, data]) => ({
      date: format(new Date(date), 'MMM d'),
      versionA: data.aImpressions > 0 ? (data.aClicks / data.aImpressions) * 100 : 0,
      versionB: data.bImpressions > 0 ? (data.bClicks / data.bImpressions) * 100 : 0,
      versionAClicks: data.aClicks,
      versionAImpressions: data.aImpressions,
      versionBClicks: data.bClicks,
      versionBImpressions: data.bImpressions,
      versionAConversions: data.aConversions,
      versionBConversions: data.bConversions,
      versionARevenue: data.aRevenue,
      versionBRevenue: data.bRevenue,
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};

export function CtrComparisonChart({ campaignId, defaultFrom, defaultTo }: CtrComparisonChartProps) {
  // Default to September of current year
  const septemberDate = new Date(new Date().getFullYear(), 8, 1); // Month 8 = September
  const [dateFrom, setDateFrom] = useState<Date>(defaultFrom || startOfMonth(septemberDate));
  const [dateTo, setDateTo] = useState<Date>(defaultTo || endOfMonth(septemberDate));
  const [isLoading] = useState(false);
  const [visibleVersions, setVisibleVersions] = useState({ A: true, B: true });
  const [selectedMetric, setSelectedMetric] = useState<MetricType>('ctr');

  const dailyData = useMemo(() => {
    const rawData = generateMockData(dateFrom, dateTo);
    return processToDaily(rawData);
  }, [dateFrom, dateTo]);

  const getMetricValue = (data: DailyData, version: 'A' | 'B'): number => {
    if (selectedMetric === 'ctr') {
      return version === 'A' ? data.versionA : data.versionB;
    } else if (selectedMetric === 'cr') {
      const clicks = version === 'A' ? data.versionAClicks : data.versionBClicks;
      const conversions = version === 'A' ? data.versionAConversions : data.versionBConversions;
      return clicks > 0 ? (conversions / clicks) * 100 : 0;
    } else {
      return version === 'A' ? data.versionARevenue : data.versionBRevenue;
    }
  };

  const formatMetricValue = (value: number): string => {
    if (selectedMetric === 'revenue') {
      return new Intl.NumberFormat('en-GB', { 
        style: 'currency', 
        currency: 'EUR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(value);
    }
    return `${value.toFixed(1)}%`;
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload || payload.length === 0) return null;

    const data = payload[0].payload;
    
    return (
      <div className="bg-card border border-border-subtle shadow-lg rounded-lg p-3 text-sm">
        <p className="font-semibold mb-2">{data.date}</p>
        {visibleVersions.A && (
          <div className="mb-2">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#5FD3B3' }} />
              <span className="font-medium">Version A</span>
            </div>
            <p className="text-muted-foreground ml-5">
              {selectedMetric === 'ctr' && `CTR: ${data.versionA.toFixed(1)}%`}
              {selectedMetric === 'cr' && `CR: ${(data.versionAConversions / data.versionAClicks * 100).toFixed(1)}%`}
              {selectedMetric === 'revenue' && `Revenue: ${formatMetricValue(data.versionARevenue)}`}
            </p>
            {selectedMetric !== 'revenue' && (
              <>
                <p className="text-muted-foreground ml-5">Clicks: {data.versionAClicks.toLocaleString()}</p>
                <p className="text-muted-foreground ml-5">Impressions: {data.versionAImpressions.toLocaleString()}</p>
                {selectedMetric === 'cr' && (
                  <p className="text-muted-foreground ml-5">Conversions: {data.versionAConversions.toLocaleString()}</p>
                )}
              </>
            )}
          </div>
        )}
        {visibleVersions.B && (
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#6F52FF' }} />
              <span className="font-medium">Version B</span>
            </div>
            <p className="text-muted-foreground ml-5">
              {selectedMetric === 'ctr' && `CTR: ${data.versionB.toFixed(1)}%`}
              {selectedMetric === 'cr' && `CR: ${(data.versionBConversions / data.versionBClicks * 100).toFixed(1)}%`}
              {selectedMetric === 'revenue' && `Revenue: ${formatMetricValue(data.versionBRevenue)}`}
            </p>
            {selectedMetric !== 'revenue' && (
              <>
                <p className="text-muted-foreground ml-5">Clicks: {data.versionBClicks.toLocaleString()}</p>
                <p className="text-muted-foreground ml-5">Impressions: {data.versionBImpressions.toLocaleString()}</p>
                {selectedMetric === 'cr' && (
                  <p className="text-muted-foreground ml-5">Conversions: {data.versionBConversions.toLocaleString()}</p>
                )}
              </>
            )}
          </div>
        )}
      </div>
    );
  };

  const toggleVersion = (version: 'A' | 'B') => {
    setVisibleVersions(prev => ({ ...prev, [version]: !prev[version] }));
  };

  const getMetricTitle = () => {
    if (selectedMetric === 'ctr') return 'Click-Through Rate';
    if (selectedMetric === 'cr') return 'Conversion Rate';
    return 'Revenue';
  };

  const getYAxisDomain = () => {
    if (selectedMetric === 'revenue') {
      const maxRevenue = Math.max(
        ...dailyData.map(d => Math.max(d.versionARevenue, d.versionBRevenue))
      );
      const roundedMax = Math.ceil(maxRevenue / 5000) * 5000;
      return [0, roundedMax];
    }
    
    // For CTR and CR, calculate dynamic domain based on actual data
    const values = dailyData.flatMap(d => {
      const versionAValue = getMetricValue(d, 'A');
      const versionBValue = getMetricValue(d, 'B');
      return [versionAValue, versionBValue];
    });
    
    const maxValue = Math.max(...values);
    const minValue = Math.min(...values);
    
    // Add 20% padding above max value for visual clarity
    const paddedMax = Math.ceil((maxValue * 1.2) * 2) / 2; // Round to nearest 0.5
    const paddedMin = Math.max(0, Math.floor((minValue * 0.8) * 2) / 2);
    
    return [paddedMin, paddedMax];
  };

  const getYAxisTicks = () => {
    if (selectedMetric === 'revenue') {
      const [, max] = getYAxisDomain();
      const step = max / 5;
      return Array.from({ length: 6 }, (_, i) => i * step);
    }
    
    // For CTR and CR, generate 6-8 ticks across the domain
    const [min, max] = getYAxisDomain();
    const range = max - min;
    const step = Math.ceil((range / 6) * 2) / 2; // Round to nearest 0.5
    
    const ticks = [];
    for (let i = min; i <= max; i += step) {
      ticks.push(Number(i.toFixed(1)));
    }
    
    return ticks;
  };

  const formatYAxis = (value: number) => {
    if (selectedMetric === 'revenue') {
      return new Intl.NumberFormat('en-GB', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
        notation: 'compact',
        compactDisplay: 'short'
      }).format(value);
    }
    return `${value.toFixed(1)}%`;
  };

  const chartDataWithMetric = useMemo(() => {
    return dailyData.map(d => ({
      ...d,
      versionA: getMetricValue(d, 'A'),
      versionB: getMetricValue(d, 'B'),
    }));
  }, [dailyData, selectedMetric]);

  if (isLoading) {
    return (
      <div className="bg-card rounded-lg border border-border-subtle shadow-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-heading font-semibold">Campaign Performance – Version A vs Version B</h3>
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

  if (dailyData.length === 0) {
    return (
      <div className="bg-card rounded-lg border border-border-subtle shadow-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-heading font-semibold">Campaign Performance – Version A vs Version B</h3>
        </div>
        <div className="h-64 flex items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">No data for the selected range.</p>
            <Button
              variant="outline"
              onClick={() => {
                const septemberDate = new Date(new Date().getFullYear(), 8, 1);
                setDateFrom(startOfMonth(septemberDate));
                setDateTo(endOfMonth(septemberDate));
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
        <div className="flex-1">
          <h3 className="text-lg font-heading font-semibold mb-4">Campaign Performance – Version A vs Version B</h3>
          
          <Tabs value={selectedMetric} onValueChange={(v) => setSelectedMetric(v as MetricType)}>
            <TabsList className="mb-4">
              <TabsTrigger value="cr">Conversion Rate</TabsTrigger>
              <TabsTrigger value="ctr">Click-Through Rate</TabsTrigger>
              <TabsTrigger value="revenue">Revenue (€)</TabsTrigger>
            </TabsList>
          </Tabs>

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
            data={chartDataWithMetric}
            margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
            barGap={4}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#EAECEF" vertical={false} />
            <XAxis
              dataKey="date"
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              axisLine={{ stroke: '#EAECEF' }}
              tickLine={false}
            />
            <YAxis
              domain={getYAxisDomain()}
              ticks={getYAxisTicks()}
              tickFormatter={formatYAxis}
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

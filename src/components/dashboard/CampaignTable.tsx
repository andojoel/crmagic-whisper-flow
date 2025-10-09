import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Search, Calendar, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { Campaign, performanceEmoji } from '@/lib/mock-data';

interface CampaignTableProps {
  campaigns: Campaign[];
}

export function CampaignTable({ campaigns }: CampaignTableProps) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterBy, setFilterBy] = useState('all');

  const filteredCampaigns = campaigns.filter((campaign) => {
    const matchesSearch = campaign.title.toLowerCase().includes(searchQuery.toLowerCase());
    if (filterBy === 'all') return matchesSearch;
    // Add more filters as needed
    return matchesSearch;
  });

  const getStatusVariant = (status: Campaign['status']) => {
    switch (status) {
      case 'Running':
        return 'bg-success/10 text-success border-success/20';
      case 'Testing':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'Scheduled':
        return 'bg-muted text-muted-foreground border-border';
      default:
        return '';
    }
  };

  const getPerformanceBg = (performance: Campaign['performance']) => {
    switch (performance) {
      case 'good':
        return 'hover:bg-success/5';
      case 'average':
        return 'hover:bg-warning/5';
      case 'poor':
        return 'hover:bg-danger/5';
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border-subtle shadow-card">
      {/* Toolbar */}
      <div className="p-4 border-b border-border-subtle flex flex-col sm:flex-row gap-3 justify-between">
        <div className="flex items-center gap-2">
          <Select value={filterBy} onValueChange={setFilterBy}>
            <SelectTrigger className="w-[180px] bg-background">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by" />
            </SelectTrigger>
            <SelectContent className="bg-card">
              <SelectItem value="all">All campaigns</SelectItem>
              <SelectItem value="date">Date range</SelectItem>
              <SelectItem value="conversion">Conversion rate</SelectItem>
              <SelectItem value="ctr">Click-through rate</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search campaign..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 w-full sm:w-[280px] bg-background"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border-subtle bg-muted/30">
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Campaign Title</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Period</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Owner</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Performance</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredCampaigns.map((campaign) => (
              <tr
                key={campaign.id}
                onClick={() => navigate(`/campaign/${campaign.id}`)}
                className={cn(
                  'border-b border-border-subtle cursor-pointer transition-smooth',
                  getPerformanceBg(campaign.performance)
                )}
              >
                <td className="p-4">
                  <span className="font-medium">{campaign.title}</span>
                </td>
                <td className="p-4 text-sm text-muted-foreground">
                  {campaign.startDate}–{campaign.endDate}
                </td>
                <td className="p-4 text-sm">{campaign.owner}</td>
                <td className="p-4">
                  <Badge
                    variant="outline"
                    className={cn('font-normal', getStatusVariant(campaign.status))}
                  >
                    {campaign.status}
                  </Badge>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2 text-sm">
                    <span>CR {campaign.conversionRate}%</span>
                    <span className="text-muted-foreground">•</span>
                    <span>CTR {campaign.clickThroughRate}%</span>
                    <span className="text-lg ml-1">{performanceEmoji(campaign.performance)}</span>
                  </div>
                </td>
                <td className="p-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-2 text-accent hover:text-accent hover:bg-accent/10"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/campaign/${campaign.id}/improve`);
                    }}
                  >
                    <Sparkles className="h-4 w-4" />
                    <span className="hidden sm:inline">AI Suggestion</span>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredCampaigns.length === 0 && (
        <div className="p-12 text-center text-muted-foreground">
          <p>No campaigns found</p>
        </div>
      )}
    </div>
  );
}

import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockCampaigns } from '@/lib/mock-data';
import { ArrowLeft, Calendar, Filter } from 'lucide-react';

export default function CampaignDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const campaign = mockCampaigns.find((c) => c.id === id);
  const [selectedVersion, setSelectedVersion] = useState<'v1' | 'v2'>('v1');

  if (!campaign) {
    return (
      <AppShell>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Campaign not found</p>
          <Button variant="ghost" onClick={() => navigate('/')} className="mt-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </AppShell>
    );
  }

  const { v1, v2 } = campaign.versions;
  const currentVersion = selectedVersion === 'v1' ? v1 : v2;
  const bestCR = v1.conversionRate > v2.conversionRate ? 'V1' : 'V2';
  const bestCTR = v1.clickThroughRate > v2.clickThroughRate ? 'V1' : 'V2';
  const bestRevenue = v1.revenue > v2.revenue ? 'V1' : 'V2';

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Back Button */}
        <Button variant="ghost" onClick={() => navigate('/')} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Button>

        {/* Performance Strip */}
        <div className="bg-card rounded-lg border border-border-subtle shadow-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-heading font-semibold">{campaign.title}</h2>
            <Tabs value={selectedVersion} onValueChange={(v) => setSelectedVersion(v as 'v1' | 'v2')}>
              <TabsList>
                <TabsTrigger value="v1">Version 1</TabsTrigger>
                <TabsTrigger value="v2">Version 2</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Conversion Rate</p>
              <div className="flex items-baseline gap-2">
                <p className="text-3xl font-heading font-semibold">{currentVersion.conversionRate}%</p>
                <Badge variant="outline" className="bg-success-subtle text-success border-success/20">
                  Best: {bestCR}
                </Badge>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Click-through Rate</p>
              <div className="flex items-baseline gap-2">
                <p className="text-3xl font-heading font-semibold">{currentVersion.clickThroughRate}%</p>
                <Badge variant="outline" className="bg-success-subtle text-success border-success/20">
                  Best: {bestCTR}
                </Badge>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Revenue</p>
              <div className="flex items-baseline gap-2">
                <p className="text-3xl font-heading font-semibold">
                  €{currentVersion.revenue.toLocaleString()}
                </p>
                <Badge variant="outline" className="bg-success-subtle text-success border-success/20">
                  Best: {bestRevenue}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="bg-card rounded-lg border border-border-subtle shadow-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-heading font-semibold">Performance Over Time</h3>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="gap-2">
                <Calendar className="h-4 w-4" />
                Last 30 days
              </Button>
              <Button variant="ghost" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="h-64 flex items-center justify-center bg-muted/20 rounded-lg border border-border-subtle">
            <p className="text-sm text-muted-foreground">Chart visualization placeholder</p>
          </div>
        </div>

        {/* Visual Variants Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-heading font-semibold">Visual Variants</h3>
            <Button variant="outline" size="sm">Compare versions</Button>
          </div>
          <Tabs defaultValue="v1" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="v1">Version 1</TabsTrigger>
              <TabsTrigger value="v2">Version 2</TabsTrigger>
            </TabsList>
            <TabsContent value="v1">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-card rounded-lg border border-border-subtle shadow-card p-6">
                  <div className="aspect-video bg-muted/20 rounded-lg border border-border-subtle flex items-center justify-center mb-4">
                    <p className="text-sm text-muted-foreground">Version 1 Preview</p>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Conversion Rate:</span>
                      <span className="font-medium">{v1.conversionRate}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Click-through Rate:</span>
                      <span className="font-medium">{v1.clickThroughRate}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Revenue:</span>
                      <span className="font-medium">€{v1.revenue.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                <div className="bg-card rounded-lg border border-border-subtle shadow-card p-6">
                  <h4 className="font-medium mb-4">Campaign Details</h4>
                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="text-muted-foreground mb-1">Audience</p>
                      <p>Premium customers, 25-45 years</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-1">Objective</p>
                      <p>Increase product awareness and drive conversions</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-1">Format</p>
                      <p>Email campaign with hero image</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-1">Last updated</p>
                      <p>2 days ago</p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="v2">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-card rounded-lg border border-border-subtle shadow-card p-6">
                  <div className="aspect-video bg-muted/20 rounded-lg border border-border-subtle flex items-center justify-center mb-4">
                    <p className="text-sm text-muted-foreground">Version 2 Preview</p>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Conversion Rate:</span>
                      <span className="font-medium">{v2.conversionRate}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Click-through Rate:</span>
                      <span className="font-medium">{v2.clickThroughRate}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Revenue:</span>
                      <span className="font-medium">€{v2.revenue.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                <div className="bg-card rounded-lg border border-border-subtle shadow-card p-6">
                  <h4 className="font-medium mb-4">Campaign Details</h4>
                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="text-muted-foreground mb-1">Audience</p>
                      <p>Premium customers, 25-45 years</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-1">Objective</p>
                      <p>Increase product awareness and drive conversions</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-1">Format</p>
                      <p>Email campaign with minimalist design</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-1">Last updated</p>
                      <p>1 day ago</p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sticky Bottom Bar */}
        <div className="sticky bottom-0 -mx-6 -mb-6 lg:-mx-8 lg:-mb-8 bg-card border-t border-border-subtle p-4 flex items-center justify-between shadow-lg">
          <div className="text-sm text-muted-foreground">
            <p>Campaign performance is being tracked</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" disabled>
              Test in production
            </Button>
            <Button onClick={() => navigate(`/campaign/${id}/improve`)}>
              Improve campaign
            </Button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockCampaigns } from '@/lib/mock-data';
import { ArrowLeft } from 'lucide-react';
import { CtrComparisonChart } from '@/components/dashboard/CtrComparisonChart';
import { VisualVariantsSection } from '@/components/campaign/VisualVariantsSection';
import variantAImage from '@/assets/variant-a.png';
import variantBImage from '@/assets/variant-b.png';

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
  // V2 is always the best version
  const bestCR = 'V2';
  const bestCTR = 'V2';
  const bestRevenue = 'V2';

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
        <CtrComparisonChart campaignId={id || '1'} />

        {/* Visual Variants Section */}
        <VisualVariantsSection
          variantAImageUrl={variantAImage}
          variantBImageUrl={variantBImage}
          startDate={campaign.startDate}
          endDate={campaign.endDate}
          environment="Web"
          campaignType="Banner"
        />

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

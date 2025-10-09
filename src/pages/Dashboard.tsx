import { AppShell } from '@/components/layout/AppShell';
import { KPICard } from '@/components/dashboard/KPICard';
import { CampaignTable } from '@/components/dashboard/CampaignTable';
import { mockCampaigns, dashboardKPIs } from '@/lib/mock-data';

export default function Dashboard() {
  return (
    <AppShell>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h2 className="text-2xl font-heading font-semibold mb-1">Dashboard</h2>
          <p className="text-sm text-muted-foreground">Overview of all active campaigns</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard
            title="Active campaigns"
            value={dashboardKPIs.activeCampaigns}
            trend={{ value: 12, isPositive: true }}
          />
          <KPICard
            title="AI recommendations"
            value={dashboardKPIs.aiRecommendations}
            trend={{ value: 8, isPositive: true }}
          />
          <KPICard
            title="Global CTR"
            value={dashboardKPIs.globalCTR}
            suffix="%"
            trend={{ value: 3, isPositive: false }}
          />
          <KPICard
            title="Global Conversion Rate"
            value={dashboardKPIs.globalConversionRate}
            suffix="%"
            trend={{ value: 5, isPositive: true }}
          />
        </div>

        {/* Campaign Table */}
        <div>
          <h3 className="text-lg font-heading font-semibold mb-4">Active campaigns</h3>
          <CampaignTable campaigns={mockCampaigns} />
        </div>
      </div>
    </AppShell>
  );
}

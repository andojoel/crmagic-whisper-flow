export type CampaignStatus = 'Running' | 'Testing' | 'Scheduled';

export interface Campaign {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  owner: string;
  status: CampaignStatus;
  conversionRate: number;
  clickThroughRate: number;
  performance: 'good' | 'average' | 'poor';
  versions: {
    v1: {
      conversionRate: number;
      clickThroughRate: number;
      revenue: number;
    };
    v2: {
      conversionRate: number;
      clickThroughRate: number;
      revenue: number;
    };
  };
}

export const mockCampaigns: Campaign[] = [
  {
    id: '1',
    title: 'Back-to-School 2025',
    startDate: '01 Sep',
    endDate: '30 Sep',
    owner: 'Alice Martin',
    status: 'Running',
    conversionRate: 2.4,
    clickThroughRate: 4.2,
    performance: 'good',
    versions: {
      v1: { conversionRate: 2.6, clickThroughRate: 3.9, revenue: 84500 },
      v2: { conversionRate: 2.1, clickThroughRate: 4.6, revenue: 79200 },
    },
  },
  {
    id: '2',
    title: 'VIP Autumn',
    startDate: '10 Sep',
    endDate: '20 Oct',
    owner: 'Hugo Leroy',
    status: 'Scheduled',
    conversionRate: 1.2,
    clickThroughRate: 2.1,
    performance: 'average',
    versions: {
      v1: { conversionRate: 1.3, clickThroughRate: 2.0, revenue: 42000 },
      v2: { conversionRate: 1.1, clickThroughRate: 2.2, revenue: 38500 },
    },
  },
  {
    id: '3',
    title: 'Clearance Equipment',
    startDate: '05 Sep',
    endDate: '15 Oct',
    owner: 'Judith Perez',
    status: 'Testing',
    conversionRate: 0.7,
    clickThroughRate: 1.5,
    performance: 'poor',
    versions: {
      v1: { conversionRate: 0.8, clickThroughRate: 1.4, revenue: 18200 },
      v2: { conversionRate: 0.6, clickThroughRate: 1.6, revenue: 15800 },
    },
  },
  {
    id: '4',
    title: 'Partnership X Launch',
    startDate: '25 Sep',
    endDate: '25 Oct',
    owner: 'Guillaume N.',
    status: 'Running',
    conversionRate: 3.1,
    clickThroughRate: 5.0,
    performance: 'good',
    versions: {
      v1: { conversionRate: 3.2, clickThroughRate: 4.8, revenue: 92000 },
      v2: { conversionRate: 3.0, clickThroughRate: 5.2, revenue: 88500 },
    },
  },
  {
    id: '5',
    title: 'Holiday Gift Guide',
    startDate: '15 Oct',
    endDate: '31 Dec',
    owner: 'Sophie Chen',
    status: 'Scheduled',
    conversionRate: 2.8,
    clickThroughRate: 4.5,
    performance: 'good',
    versions: {
      v1: { conversionRate: 2.9, clickThroughRate: 4.3, revenue: 76000 },
      v2: { conversionRate: 2.7, clickThroughRate: 4.7, revenue: 73500 },
    },
  },
  {
    id: '6',
    title: 'Winter Sale Preview',
    startDate: '20 Nov',
    endDate: '05 Dec',
    owner: 'Marcus Brown',
    status: 'Testing',
    conversionRate: 1.9,
    clickThroughRate: 3.2,
    performance: 'average',
    versions: {
      v1: { conversionRate: 2.0, clickThroughRate: 3.1, revenue: 54000 },
      v2: { conversionRate: 1.8, clickThroughRate: 3.3, revenue: 51500 },
    },
  },
  {
    id: '7',
    title: 'Black Friday Early Access',
    startDate: '18 Nov',
    endDate: '24 Nov',
    owner: 'Emma Wilson',
    status: 'Running',
    conversionRate: 4.2,
    clickThroughRate: 6.8,
    performance: 'good',
    versions: {
      v1: { conversionRate: 4.3, clickThroughRate: 6.5, revenue: 128000 },
      v2: { conversionRate: 4.1, clickThroughRate: 7.1, revenue: 124500 },
    },
  },
  {
    id: '8',
    title: 'New Member Welcome',
    startDate: '01 Oct',
    endDate: '31 Oct',
    owner: 'Liam Davis',
    status: 'Running',
    conversionRate: 2.1,
    clickThroughRate: 3.6,
    performance: 'average',
    versions: {
      v1: { conversionRate: 2.2, clickThroughRate: 3.5, revenue: 48000 },
      v2: { conversionRate: 2.0, clickThroughRate: 3.7, revenue: 45500 },
    },
  },
  {
    id: '9',
    title: 'Re-engagement Campaign',
    startDate: '12 Sep',
    endDate: '12 Oct',
    owner: 'Olivia Taylor',
    status: 'Testing',
    conversionRate: 1.4,
    clickThroughRate: 2.8,
    performance: 'average',
    versions: {
      v1: { conversionRate: 1.5, clickThroughRate: 2.7, revenue: 32000 },
      v2: { conversionRate: 1.3, clickThroughRate: 2.9, revenue: 29500 },
    },
  },
  {
    id: '10',
    title: 'Premium Upgrade Offer',
    startDate: '05 Oct',
    endDate: '20 Oct',
    owner: 'Noah Martinez',
    status: 'Running',
    conversionRate: 3.5,
    clickThroughRate: 5.4,
    performance: 'good',
    versions: {
      v1: { conversionRate: 3.6, clickThroughRate: 5.2, revenue: 98000 },
      v2: { conversionRate: 3.4, clickThroughRate: 5.6, revenue: 95500 },
    },
  },
  {
    id: '11',
    title: 'Product Launch Teaser',
    startDate: '28 Sep',
    endDate: '15 Oct',
    owner: 'Ava Anderson',
    status: 'Running',
    conversionRate: 2.7,
    clickThroughRate: 4.1,
    performance: 'good',
    versions: {
      v1: { conversionRate: 2.8, clickThroughRate: 4.0, revenue: 68000 },
      v2: { conversionRate: 2.6, clickThroughRate: 4.2, revenue: 65500 },
    },
  },
  {
    id: '12',
    title: 'Customer Appreciation Week',
    startDate: '15 Oct',
    endDate: '22 Oct',
    owner: 'Ethan White',
    status: 'Scheduled',
    conversionRate: 3.0,
    clickThroughRate: 4.8,
    performance: 'good',
    versions: {
      v1: { conversionRate: 3.1, clickThroughRate: 4.7, revenue: 82000 },
      v2: { conversionRate: 2.9, clickThroughRate: 4.9, revenue: 79500 },
    },
  },
];

export const dashboardKPIs = {
  activeCampaigns: 12,
  aiRecommendations: 7,
  globalCTR: 3.8,
  globalConversionRate: 1.9,
};

export const performanceEmoji = (performance: Campaign['performance']) => {
  switch (performance) {
    case 'good':
      return '🙂';
    case 'average':
      return '😐';
    case 'poor':
      return '🙁';
  }
};

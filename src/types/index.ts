export interface Market {
  id: string;
  name: string;
  state: string;
  lat: number;
  lng: number;
  opportunityScore: number;
  grade: string;
  businessDensity: number;
  digitalMaturityGap: number;
  agencyCompetition: number;
  businessGrowthRate: number;
  totalBusinesses: number;
  businessesNeedingServices: number;
  avgDigitalSpend: number;
  pros: string[];
  cons: string[];
  aiSummary: string;
  topVerticals: string[];
}

export interface Prospect {
  id: string;
  company: string;
  industry: string;
  location: string;
  marketId: string;
  digitalScore: number;
  matchScore: number;
  suggestedServices: string[];
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'closed';
  website: string;
  employees: string;
  revenue: string;
  digitalGaps: string[];
  recommendedServices: string[];
  estimatedProjectValue: number;
  contactName: string;
  contactTitle: string;
  selectionCriteria?: string[];
  bssMatch?: { label: string; match: boolean }[];
  aiConfidence?: number;
  aiConfidenceReason?: string;
}

export interface AdPlan {
  marketId: string;
  marketName: string;
  budgetAllocation: number;
  costPerLead: number;
  estimatedLeads: number;
  channels: ChannelRecommendation[];
  roiProjection: number;
}

export interface ChannelRecommendation {
  channel: string;
  allocation: number;
  estimatedCpl: number;
  estimatedLeads: number;
  priority: 'high' | 'medium' | 'low';
}

import { useState } from 'react';
import { DollarSign, TrendingUp, BarChart3, Target, ArrowLeft, Mail, ArrowUpRight, Copy, Check } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { markets } from '../data/markets';
import { adPlans } from '../data/adPlans';
import type { Prospect } from '../types';
import { PhaseHeader } from './PhaseHeader';
import { AiBadge } from './AiBadge';
import { TechnicalNotes } from './TechnicalNotes';

const COLOURS = ['#2d6a7a', '#1e3a5f', '#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ef4444', '#ec4899'];

const priorityColours: Record<string, string> = {
  high: 'bg-emerald-100 text-emerald-700',
  medium: 'bg-amber-100 text-amber-700',
  low: 'bg-gray-100 text-gray-600',
};

interface CampaignPlannerProps {
  selectedMarketIds: Set<string>;
  selectedProspects: Prospect[];
  monthlyBudget: number;
  onSetBudget: (v: number) => void;
  onBack: () => void;
}

export function CampaignPlanner({ selectedMarketIds, selectedProspects, monthlyBudget, onSetBudget, onBack }: CampaignPlannerProps) {
  const [activeTab, setActiveTab] = useState<'ads' | 'outreach'>('ads');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (selectedMarketIds.size === 0) {
    return (
      <div>
        <PhaseHeader phase={3} title="Campaign Planner" description="Plan your advertising and outreach campaigns." inputNote="Receives markets + prospects from earlier phases" />
        <div className="max-w-lg mx-auto px-4 py-16 text-center">
          <Target className="h-16 w-16 text-gray-200 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-navy mb-2">No Markets Selected</h2>
          <p className="text-sm text-gray-500 mb-6">Start from Phase 1 to select markets, then Phase 2 to identify prospects.</p>
          <button onClick={onBack} className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal text-white rounded-lg text-sm font-medium hover:bg-teal-light transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to Phase 2
          </button>
        </div>
      </div>
    );
  }

  const selectedMarkets = markets.filter((m) => selectedMarketIds.has(m.id));
  const selectedMarketNames = selectedMarkets.map((m) => m.name).join(', ');

  // Filter ad plans to selected markets, compute dynamic allocation
  const relevantPlans = adPlans.filter((p) => selectedMarketIds.has(p.marketId));
  const totalWeight = relevantPlans.reduce((s, p) => s + p.budgetAllocation, 0);
  const dynamicPlans = relevantPlans.map((p) => {
    const pct = totalWeight > 0 ? (p.budgetAllocation / totalWeight) * 100 : 0;
    const budget = (monthlyBudget * pct) / 100;
    const leads = Math.round(budget / p.costPerLead);
    return { ...p, dynamicPct: Math.round(pct), dynamicBudget: Math.round(budget), dynamicLeads: leads };
  });

  const totalLeads = dynamicPlans.reduce((s, p) => s + p.dynamicLeads, 0);
  const avgCpl = dynamicPlans.length > 0 ? Math.round(dynamicPlans.reduce((s, p) => s + p.costPerLead, 0) / dynamicPlans.length) : 0;
  const topRoi = dynamicPlans.length > 0 ? dynamicPlans.reduce((a, b) => (a.roiProjection > b.roiProjection ? a : b)) : null;

  const barData = dynamicPlans.map((p) => ({ name: p.marketName.split(',')[0], leads: p.dynamicLeads, budget: p.dynamicBudget }));
  const pieData = dynamicPlans.map((p) => ({ name: p.marketName.split(',')[0], value: p.dynamicPct }));

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div>
      <PhaseHeader
        phase={3}
        title="Campaign Planner — Ad Spend & Outreach"
        description="Based on your selected markets and identified prospects, MarketScout recommends how to allocate your advertising budget and generates outreach strategies for direct prospect engagement."
        connection={`Planning for: ${selectedMarketNames} · ${selectedProspects.length} prospects selected for outreach`}
        inputNote={`${selectedMarketIds.size} markets · ${selectedProspects.length} prospects`}
      >
        <AiBadge tooltip="AI optimises budget allocation and generates personalised outreach messages based on market data and prospect digital gap analysis." />
      </PhaseHeader>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('ads')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'ads' ? 'bg-teal text-white' : 'bg-white border border-card-border text-gray-600 hover:bg-gray-50'
            }`}
          >
            <BarChart3 className="h-4 w-4" /> 3A. Ad Spend Allocation
          </button>
          <button
            onClick={() => setActiveTab('outreach')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'outreach' ? 'bg-teal text-white' : 'bg-white border border-card-border text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Mail className="h-4 w-4" /> 3B. Direct Outreach
            {selectedProspects.length > 0 && (
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${activeTab === 'outreach' ? 'bg-white/20' : 'bg-teal/10 text-teal'}`}>
                {selectedProspects.length}
              </span>
            )}
          </button>
        </div>

        {activeTab === 'ads' ? (
          <AdSpendSection
            dynamicPlans={dynamicPlans}
            monthlyBudget={monthlyBudget}
            onSetBudget={onSetBudget}
            totalLeads={totalLeads}
            avgCpl={avgCpl}
            topRoi={topRoi}
            barData={barData}
            pieData={pieData}
          />
        ) : (
          <OutreachSection
            prospects={selectedProspects}
            copiedId={copiedId}
            onCopy={copyToClipboard}
            onBack={onBack}
          />
        )}

        <TechnicalNotes
          dataSources={[
            'Google Ads Keyword Planner for CPC/CPL estimates',
            'LinkedIn Ads API for B2B targeting costs',
            'Industry benchmarks for conversion rates',
            'Historical campaign data for ROI modelling',
          ]}
          aiCapabilities={[
            'Budget optimisation using multi-armed bandit algorithms',
            'NLP-generated personalised outreach emails',
            'Channel effectiveness prediction per market',
            'A/B test content generation for ads',
          ]}
          simulated={[
            'Budget allocation percentages and CPL estimates',
            'Lead projections and ROI numbers',
            'Outreach email templates',
            'Channel recommendations',
          ]}
          production={[
            'Real-time ad platform API integration',
            'Dynamic LLM-generated outreach per prospect',
            'Campaign performance tracking & optimisation',
            'CRM integration for pipeline management',
          ]}
        />
      </div>
    </div>
  );
}

// Ad Spend sub-section
function AdSpendSection({ dynamicPlans, monthlyBudget, onSetBudget, totalLeads, avgCpl, topRoi, barData, pieData }: {
  dynamicPlans: any[];
  monthlyBudget: number;
  onSetBudget: (v: number) => void;
  totalLeads: number;
  avgCpl: number;
  topRoi: any;
  barData: any[];
  pieData: any[];
}) {
  return (
    <>
      {/* Budget Input */}
      <div className="bg-white rounded-xl border border-card-border shadow-sm p-4 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex-1">
            <label className="text-sm font-medium text-navy block mb-1">Monthly Advertising Budget</label>
            <p className="text-xs text-gray-400">Adjust your budget to see how allocation and projected leads change across markets</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="number"
                value={monthlyBudget}
                onChange={(e) => onSetBudget(Math.max(0, Number(e.target.value)))}
                className="pl-8 pr-4 py-2 w-36 border border-gray-200 rounded-lg text-sm font-medium text-navy focus:ring-2 focus:ring-teal/30 focus:border-teal outline-none"
              />
            </div>
            <span className="text-sm text-gray-400">/month</span>
          </div>
        </div>
        <div className="flex gap-2 mt-3">
          {[2500, 5000, 10000, 25000].map((v) => (
            <button
              key={v}
              onClick={() => onSetBudget(v)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                monthlyBudget === v ? 'bg-teal text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              ${(v / 1000).toFixed(v >= 1000 ? 0 : 1)}K
            </button>
          ))}
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KPI icon={<DollarSign className="h-5 w-5 text-teal" />} label="Monthly Budget" value={`$${(monthlyBudget / 1000).toFixed(1)}K`} />
        <KPI icon={<Target className="h-5 w-5 text-emerald-600" />} label="Est. Leads/Month" value={totalLeads.toString()} />
        <KPI icon={<BarChart3 className="h-5 w-5 text-blue-600" />} label="Avg Cost per Lead" value={`$${avgCpl}`} />
        {topRoi && <KPI icon={<TrendingUp className="h-5 w-5 text-amber-600" />} label="Best ROI Market" value={topRoi.marketName.split(',')[0]} sub={`${topRoi.roiProjection}% projected`} />}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-xl border border-card-border shadow-sm p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-navy">Budget Allocation</h3>
            <AiBadge label="AI Optimised" tooltip="AI distributes budget proportionally based on each market's opportunity score, estimated cost-per-lead, and projected conversion rates." />
          </div>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" outerRadius={100} dataKey="value" label={({ name, value }) => `${name} ${value}%`} labelLine={false}>
                  {pieData.map((_: any, i: number) => <Cell key={i} fill={COLOURS[i % COLOURS.length]} />)}
                </Pie>
                <Tooltip formatter={(v) => `${v}%`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-card-border shadow-sm p-4">
          <h3 className="font-semibold text-navy mb-4">Estimated Leads by Market</h3>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="leads" fill="#2d6a7a" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ROI Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {dynamicPlans.slice(0, 4).map((plan: any) => (
          <div key={plan.marketId} className="bg-white rounded-xl border border-card-border shadow-sm p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-navy text-sm">{plan.marketName.split(',')[0]}</h4>
              <ArrowUpRight className="h-4 w-4 text-emerald-500" />
            </div>
            <p className="text-2xl font-bold text-emerald-600 mb-1">{plan.roiProjection}%</p>
            <p className="text-xs text-gray-400">Projected ROI</p>
            <div className="mt-3 pt-3 border-t border-gray-100 grid grid-cols-2 gap-2 text-xs">
              <div>
                <p className="text-gray-400">Budget</p>
                <p className="font-medium text-navy">${(plan.dynamicBudget / 1000).toFixed(1)}K/mo</p>
              </div>
              <div>
                <p className="text-gray-400">Est. Leads</p>
                <p className="font-medium text-navy">{plan.dynamicLeads}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Channel Table */}
      <div className="bg-white rounded-xl border border-card-border shadow-sm overflow-hidden">
        <div className="p-4 border-b border-card-border">
          <h3 className="font-semibold text-navy">Channel Recommendations by Market</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
              <tr>
                <th className="px-4 py-3 text-left">Market</th>
                <th className="px-4 py-3 text-left">Channel</th>
                <th className="px-4 py-3 text-center">Allocation</th>
                <th className="px-4 py-3 text-center">Est. CPL</th>
                <th className="px-4 py-3 text-center">Est. Leads</th>
                <th className="px-4 py-3 text-center">Priority</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {dynamicPlans.map((plan: any) =>
                plan.channels.map((ch: any, i: number) => (
                  <tr key={`${plan.marketId}-${i}`} className="hover:bg-gray-50">
                    {i === 0 && (
                      <td className="px-4 py-3 font-medium text-navy" rowSpan={plan.channels.length}>
                        {plan.marketName}
                      </td>
                    )}
                    <td className="px-4 py-3 text-gray-600">{ch.channel}</td>
                    <td className="px-4 py-3 text-center text-gray-600">{ch.allocation}%</td>
                    <td className="px-4 py-3 text-center text-gray-600">${ch.estimatedCpl}</td>
                    <td className="px-4 py-3 text-center font-medium text-navy">{Math.round((plan.dynamicBudget * ch.allocation / 100) / ch.estimatedCpl)}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${priorityColours[ch.priority]}`}>{ch.priority}</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

// Outreach sub-section
function OutreachSection({ prospects, copiedId, onCopy, onBack }: {
  prospects: Prospect[];
  copiedId: string | null;
  onCopy: (text: string, id: string) => void;
  onBack: () => void;
}) {
  if (prospects.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-card-border shadow-sm p-12 text-center">
        <Mail className="h-16 w-16 text-gray-200 mx-auto mb-4" />
        <h2 className="text-lg font-bold text-navy mb-2">No Prospects Selected</h2>
        <p className="text-sm text-gray-500 mb-6">Go to Phase 2 and select prospects to generate personalised outreach messages.</p>
        <button onClick={onBack} className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal text-white rounded-lg text-sm font-medium hover:bg-teal-light transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Phase 2
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-navy">Personalised Outreach — {prospects.length} Prospect{prospects.length !== 1 ? 's' : ''}</h3>
        <AiBadge label="AI Generated" tooltip="AI generates personalised outreach messages based on each prospect's digital gap analysis, industry context, and recommended services." />
      </div>

      {prospects.map((prospect) => {
        const email = generateOutreachEmail(prospect);
        return (
          <div key={prospect.id} className="bg-white rounded-xl border border-card-border shadow-sm overflow-hidden">
            <div className="p-4 border-b bg-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h4 className="font-semibold text-navy">{prospect.company}</h4>
                <p className="text-xs text-gray-400">{prospect.contactName} · {prospect.contactTitle} · {prospect.location}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-400">Est. value: <span className="font-bold text-navy">${prospect.estimatedProjectValue.toLocaleString()}</span></span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold border ${
                  prospect.matchScore >= 85 ? 'bg-emerald-100 text-emerald-700 border-emerald-300' : 'bg-blue-100 text-blue-700 border-blue-300'
                }`}>
                  {prospect.matchScore}% match
                </span>
              </div>
            </div>

            {/* Digital Gaps Summary */}
            <div className="px-4 pt-3 pb-1">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Identified Digital Gaps</p>
              <div className="flex flex-wrap gap-1.5">
                {prospect.digitalGaps.map((g, i) => (
                  <span key={i} className="px-2 py-0.5 bg-red-50 text-red-600 rounded-full text-xs">{g}</span>
                ))}
              </div>
            </div>

            {/* Suggested Services */}
            <div className="px-4 pt-2 pb-1">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Recommended Services</p>
              <div className="flex flex-wrap gap-1.5">
                {prospect.recommendedServices.map((s) => (
                  <span key={s} className="px-2 py-0.5 bg-teal/10 text-teal rounded-full text-xs">{s}</span>
                ))}
              </div>
            </div>

            {/* Draft Email */}
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Mail className="h-3 w-3" /> Draft Outreach Email
                  <AiBadge label="AI Draft" tooltip="This email is personalised by AI based on the prospect's specific digital gaps, industry, and recommended services. In production, tone and style would be customisable." />
                </p>
                <button
                  onClick={() => onCopy(email, prospect.id)}
                  className="flex items-center gap-1 text-xs text-gray-400 hover:text-teal transition-colors"
                >
                  {copiedId === prospect.id ? <><Check className="h-3.5 w-3.5 text-emerald-500" /> Copied!</> : <><Copy className="h-3.5 w-3.5" /> Copy</>}
                </button>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600 leading-relaxed whitespace-pre-line border border-gray-100">
                {email}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function generateOutreachEmail(prospect: Prospect): string {
  const topGaps = prospect.digitalGaps.slice(0, 2).join(' and ');
  const topServices = prospect.recommendedServices.slice(0, 3).join(', ');
  const firstName = prospect.contactName.split(' ')[0];

  return `Subject: Quick thoughts on ${prospect.company}'s digital presence

Hi ${firstName},

I came across ${prospect.company} while researching ${prospect.industry.toLowerCase()} businesses in ${prospect.location} and noticed a few opportunities that could help you stand out online.

Specifically, I noticed ${topGaps.toLowerCase()} — areas where a targeted investment could make a meaningful difference in how potential clients find and engage with your business.

At Web Sharx, we specialise in helping businesses like yours strengthen their digital presence. Based on what I've seen, I'd recommend exploring ${topServices.toLowerCase()} as a starting point.

We've helped similar organisations see significant improvements in their online visibility and lead generation. I'd love to share some specific ideas tailored to ${prospect.company}.

Would you have 15 minutes this week for a quick call?

Best regards,
Web Sharx Team
websharx.ca`;
}

function KPI({ icon, label, value, sub }: { icon: React.ReactNode; label: string; value: string; sub?: string }) {
  return (
    <div className="bg-white rounded-xl border border-card-border shadow-sm p-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center shrink-0">{icon}</div>
        <div>
          <p className="text-xs text-gray-400">{label}</p>
          <p className="text-lg font-bold text-navy">{value}</p>
          {sub && <p className="text-xs text-gray-400">{sub}</p>}
        </div>
      </div>
    </div>
  );
}

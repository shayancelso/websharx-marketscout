import { useState } from 'react';
import { DollarSign, TrendingUp, BarChart3, Target, ArrowLeft, Mail, ArrowUpRight, Copy, Check } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { markets } from '../data/markets';
import { adPlans } from '../data/adPlans';
import type { Prospect } from '../types';
import { PhaseHeader } from './PhaseHeader';
import { AiBadge } from './AiBadge';
import { TechnicalNotes } from './TechnicalNotes';

const COLOURS = ['#2d6a7a', '#86868b', '#248a3d', '#0055d4', '#c77800', '#8944ab', '#d70015', '#af52de'];

const priorityStyles: Record<string, string> = {
  high: 'grade-a',
  medium: 'grade-c',
  low: 'bg-[#1d1d1f]/6 text-[#86868b]',
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
        <div className="max-w-lg mx-auto px-4 py-20 text-center">
          <Target className="h-16 w-16 text-[#1d1d1f]/10 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-[#1d1d1f] mb-2">No Markets Selected</h2>
          <p className="text-sm text-[#86868b] mb-6">Start from Phase 1 to select markets, then Phase 2 to identify prospects.</p>
          <button onClick={onBack} className="inline-flex items-center gap-2 px-6 py-3 bg-[#1d1d1f] text-white rounded-full text-sm font-medium hover:bg-[#1d1d1f]/85 transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to Phase 2
          </button>
        </div>
      </div>
    );
  }

  const selectedMarkets = markets.filter((m) => selectedMarketIds.has(m.id));
  const selectedMarketNames = selectedMarkets.map((m) => m.name).join(', ');

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
        title="Campaign Planner"
        description="Based on your selected markets and identified prospects, MarketScout recommends how to allocate your advertising budget and generates outreach strategies for direct prospect engagement."
        connection={`Planning for: ${selectedMarketNames} · ${selectedProspects.length} prospects selected for outreach`}
        inputNote={`${selectedMarketIds.size} markets · ${selectedProspects.length} prospects`}
      >
        <AiBadge tooltip="AI optimises budget allocation and generates personalised outreach messages based on market data and prospect digital gap analysis." />
      </PhaseHeader>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Tabs — iOS segmented control style */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center bg-[#1d1d1f]/5 rounded-full p-1 gap-0.5">
            <button
              onClick={() => setActiveTab('ads')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${
                activeTab === 'ads' ? 'bg-white text-[#1d1d1f] shadow-sm shadow-black/8' : 'text-[#86868b] hover:text-[#1d1d1f]'
              }`}
            >
              <BarChart3 className="h-4 w-4" /> 3A. Ad Spend
            </button>
            <button
              onClick={() => setActiveTab('outreach')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${
                activeTab === 'outreach' ? 'bg-white text-[#1d1d1f] shadow-sm shadow-black/8' : 'text-[#86868b] hover:text-[#1d1d1f]'
              }`}
            >
              <Mail className="h-4 w-4" /> 3B. Outreach
              {selectedProspects.length > 0 && (
                <span className={`min-w-[18px] h-[18px] flex items-center justify-center rounded-full text-[10px] font-bold ${
                  activeTab === 'outreach' ? 'bg-teal/12 text-teal' : 'bg-[#1d1d1f]/8 text-[#86868b]'
                }`}>
                  {selectedProspects.length}
                </span>
              )}
            </button>
          </div>
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
      <div className="glass-card-static p-5 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex-1">
            <label className="text-sm font-medium text-[#1d1d1f] block mb-1">Monthly Advertising Budget</label>
            <p className="text-xs text-[#86868b]">Adjust your budget to see how allocation and projected leads change across markets</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#86868b]" />
              <input
                type="number"
                value={monthlyBudget}
                onChange={(e) => onSetBudget(Math.max(0, Number(e.target.value)))}
                className="pl-8 pr-4 py-2.5 w-36 bg-[#1d1d1f]/4 border-none rounded-full text-sm font-medium text-[#1d1d1f] focus:ring-2 focus:ring-teal/20 outline-none"
              />
            </div>
            <span className="text-sm text-[#86868b]">/month</span>
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          {[2500, 5000, 10000, 25000].map((v) => (
            <button
              key={v}
              onClick={() => onSetBudget(v)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                monthlyBudget === v ? 'bg-[#1d1d1f] text-white' : 'bg-[#1d1d1f]/5 text-[#86868b] hover:bg-[#1d1d1f]/10'
              }`}
            >
              ${(v / 1000).toFixed(v >= 1000 ? 0 : 1)}K
            </button>
          ))}
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <KPI icon={<DollarSign className="h-5 w-5" />} iconColor="text-teal" label="Monthly Budget" value={`$${(monthlyBudget / 1000).toFixed(1)}K`} />
        <KPI icon={<Target className="h-5 w-5" />} iconColor="text-[#248a3d]" label="Est. Leads/Month" value={totalLeads.toString()} />
        <KPI icon={<BarChart3 className="h-5 w-5" />} iconColor="text-[#0055d4]" label="Avg Cost per Lead" value={`$${avgCpl}`} />
        {topRoi && <KPI icon={<TrendingUp className="h-5 w-5" />} iconColor="text-[#c77800]" label="Best ROI Market" value={topRoi.marketName.split(',')[0]} sub={`${topRoi.roiProjection}% projected`} />}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <div className="glass-card-static p-5">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-semibold text-[#1d1d1f]">Budget Allocation</h3>
            <AiBadge label="AI Optimised" tooltip="AI distributes budget proportionally based on each market's opportunity score, estimated cost-per-lead, and projected conversion rates." />
          </div>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" outerRadius={100} innerRadius={60} dataKey="value" label={({ name, value }) => `${name} ${value}%`} labelLine={false} strokeWidth={2} stroke="rgba(255,255,255,0.8)">
                  {pieData.map((_: any, i: number) => <Cell key={i} fill={COLOURS[i % COLOURS.length]} opacity={0.75} />)}
                </Pie>
                <Tooltip formatter={(v) => `${v}%`} contentStyle={{ background: 'rgba(255,255,255,0.88)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.5)', borderRadius: '12px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="glass-card-static p-5">
          <h3 className="font-semibold text-[#1d1d1f] mb-5">Estimated Leads by Market</h3>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#86868b' }} />
                <YAxis tick={{ fontSize: 11, fill: '#86868b' }} />
                <Tooltip contentStyle={{ background: 'rgba(255,255,255,0.88)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.5)', borderRadius: '12px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }} />
                <Bar dataKey="leads" fill="#2d6a7a" radius={[8, 8, 0, 0]} opacity={0.75} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ROI Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {dynamicPlans.slice(0, 4).map((plan: any) => (
          <div key={plan.marketId} className="glass-card p-5 cursor-default">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-[#1d1d1f] text-sm">{plan.marketName.split(',')[0]}</h4>
              <ArrowUpRight className="h-4 w-4 text-[#248a3d]" />
            </div>
            <p className="text-3xl font-light text-[#248a3d] mb-0.5">{plan.roiProjection}%</p>
            <p className="text-xs text-[#86868b]">Projected ROI</p>
            <div className="mt-4 pt-4 border-t border-[#1d1d1f]/6 grid grid-cols-2 gap-2 text-xs">
              <div>
                <p className="text-[#86868b]">Budget</p>
                <p className="font-medium text-[#1d1d1f]">${(plan.dynamicBudget / 1000).toFixed(1)}K/mo</p>
              </div>
              <div>
                <p className="text-[#86868b]">Est. Leads</p>
                <p className="font-medium text-[#1d1d1f]">{plan.dynamicLeads}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Channel Table */}
      <div className="glass-card-static overflow-hidden">
        <div className="p-5 border-b border-[#1d1d1f]/6">
          <h3 className="font-semibold text-[#1d1d1f]">Channel Recommendations by Market</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm glass-table">
            <thead>
              <tr>
                <th className="px-5 py-3.5 text-left">Market</th>
                <th className="px-5 py-3.5 text-left">Channel</th>
                <th className="px-5 py-3.5 text-center">Allocation</th>
                <th className="px-5 py-3.5 text-center">Est. CPL</th>
                <th className="px-5 py-3.5 text-center">Est. Leads</th>
                <th className="px-5 py-3.5 text-center">Priority</th>
              </tr>
            </thead>
            <tbody>
              {dynamicPlans.map((plan: any) =>
                plan.channels.map((ch: any, i: number) => (
                  <tr key={`${plan.marketId}-${i}`}>
                    {i === 0 && (
                      <td className="px-5 py-3.5 font-medium text-[#1d1d1f]" rowSpan={plan.channels.length}>
                        {plan.marketName}
                      </td>
                    )}
                    <td className="px-5 py-3.5 text-[#86868b]">{ch.channel}</td>
                    <td className="px-5 py-3.5 text-center text-[#86868b]">{ch.allocation}%</td>
                    <td className="px-5 py-3.5 text-center text-[#86868b]">${ch.estimatedCpl}</td>
                    <td className="px-5 py-3.5 text-center font-medium text-[#1d1d1f]">{Math.round((plan.dynamicBudget * ch.allocation / 100) / ch.estimatedCpl)}</td>
                    <td className="px-5 py-3.5 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${priorityStyles[ch.priority]}`}>{ch.priority}</span>
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

function OutreachSection({ prospects, copiedId, onCopy, onBack }: {
  prospects: Prospect[];
  copiedId: string | null;
  onCopy: (text: string, id: string) => void;
  onBack: () => void;
}) {
  if (prospects.length === 0) {
    return (
      <div className="glass-card-static p-16 text-center">
        <Mail className="h-16 w-16 text-[#1d1d1f]/10 mx-auto mb-4" />
        <h2 className="text-lg font-semibold text-[#1d1d1f] mb-2">No Prospects Selected</h2>
        <p className="text-sm text-[#86868b] mb-6">Go to Phase 2 and select prospects to generate personalised outreach messages.</p>
        <button onClick={onBack} className="inline-flex items-center gap-2 px-6 py-3 bg-[#1d1d1f] text-white rounded-full text-sm font-medium hover:bg-[#1d1d1f]/85 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Phase 2
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-[#1d1d1f]">Personalised Outreach — {prospects.length} Prospect{prospects.length !== 1 ? 's' : ''}</h3>
        <AiBadge label="AI Generated" tooltip="AI generates personalised outreach messages based on each prospect's digital gap analysis, industry context, and recommended services." />
      </div>

      {prospects.map((prospect) => {
        const email = generateOutreachEmail(prospect);
        return (
          <div key={prospect.id} className="glass-card-static overflow-hidden">
            <div className="p-5 border-b border-[#1d1d1f]/6 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h4 className="font-semibold text-[#1d1d1f]">{prospect.company}</h4>
                <p className="text-xs text-[#86868b]">{prospect.contactName} · {prospect.contactTitle} · {prospect.location}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-[#86868b]">Est. value: <span className="font-semibold text-[#1d1d1f]">${prospect.estimatedProjectValue.toLocaleString()}</span></span>
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                  prospect.matchScore >= 85 ? 'grade-a' : 'grade-b'
                }`}>
                  {prospect.matchScore}% match
                </span>
              </div>
            </div>

            {/* Digital Gaps Summary */}
            <div className="px-5 pt-4 pb-1">
              <p className="text-[10px] font-medium text-[#86868b] uppercase tracking-wider mb-1.5">Identified Digital Gaps</p>
              <div className="flex flex-wrap gap-1.5">
                {prospect.digitalGaps.map((g, i) => (
                  <span key={i} className="px-2.5 py-0.5 rounded-full text-xs bg-[#d70015]/8 text-[#d70015]">{g}</span>
                ))}
              </div>
            </div>

            {/* Suggested Services */}
            <div className="px-5 pt-3 pb-1">
              <p className="text-[10px] font-medium text-[#86868b] uppercase tracking-wider mb-1.5">Recommended Services</p>
              <div className="flex flex-wrap gap-1.5">
                {prospect.recommendedServices.map((s) => (
                  <span key={s} className="pill-badge text-teal" style={{ background: 'rgba(45,106,122,0.08)' }}>{s}</span>
                ))}
              </div>
            </div>

            {/* Draft Email */}
            <div className="p-5">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[10px] font-medium text-[#86868b] uppercase tracking-wider flex items-center gap-1.5">
                  <Mail className="h-3 w-3" /> Draft Outreach Email
                  <AiBadge label="AI Draft" tooltip="This email is personalised by AI based on the prospect's specific digital gaps, industry, and recommended services." />
                </p>
                <button
                  onClick={() => onCopy(email, prospect.id)}
                  className="flex items-center gap-1 text-xs text-[#86868b] hover:text-[#1d1d1f] transition-colors"
                >
                  {copiedId === prospect.id ? <><Check className="h-3.5 w-3.5 text-[#248a3d]" /> Copied!</> : <><Copy className="h-3.5 w-3.5" /> Copy</>}
                </button>
              </div>
              <div className="bg-[#1d1d1f]/3 rounded-2xl p-5 text-sm text-[#86868b] leading-relaxed whitespace-pre-line">
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

function KPI({ icon, iconColor, label, value, sub }: { icon: React.ReactNode; iconColor: string; label: string; value: string; sub?: string }) {
  return (
    <div className="glass-card-static p-5 relative overflow-hidden">
      <div className={`absolute -right-2 -top-2 opacity-[0.04] ${iconColor}`} style={{ transform: 'scale(3)' }}>
        {icon}
      </div>
      <div className="relative">
        <div className={`w-9 h-9 rounded-xl bg-[#1d1d1f]/4 flex items-center justify-center mb-3 ${iconColor}`}>
          {icon}
        </div>
        <p className="text-xs text-[#86868b]">{label}</p>
        <p className="text-2xl font-light text-[#1d1d1f]">{value}</p>
        {sub && <p className="text-xs text-[#86868b] mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

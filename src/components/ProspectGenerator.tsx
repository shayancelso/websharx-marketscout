import { useState } from 'react';
import { Users, Target, DollarSign, Star, Search, Filter, X, Globe, ArrowLeft, ArrowRight, CheckCircle, AlertTriangle, CheckSquare, Square } from 'lucide-react';
import type { Prospect } from '../types';
import { markets } from '../data/markets';
import { PhaseHeader } from './PhaseHeader';
import { AiBadge } from './AiBadge';
import { TechnicalNotes } from './TechnicalNotes';

interface ProspectGeneratorProps {
  selectedMarketIds: Set<string>;
  availableProspects: Prospect[];
  selectedProspectIds: Set<string>;
  onToggleProspect: (id: string) => void;
  onBack: () => void;
  onNext: () => void;
}

const industries = (prospects: Prospect[]) => [...new Set(prospects.map((p) => p.industry))].sort();

const statusColours: Record<string, string> = {
  new: 'bg-blue-100 text-blue-700',
  contacted: 'bg-amber-100 text-amber-700',
  qualified: 'bg-emerald-100 text-emerald-700',
  proposal: 'bg-purple-100 text-purple-700',
  closed: 'bg-gray-100 text-gray-700',
};

export function ProspectGenerator({
  selectedMarketIds,
  availableProspects,
  selectedProspectIds,
  onToggleProspect,
  onBack,
  onNext,
}: ProspectGeneratorProps) {
  const [search, setSearch] = useState('');
  const [filterIndustry, setFilterIndustry] = useState('');
  const [filterMinMatch, setFilterMinMatch] = useState(0);
  const [selectedProspect, setSelectedProspect] = useState<Prospect | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // If no markets selected, show prompt
  if (selectedMarketIds.size === 0) {
    return (
      <div>
        <PhaseHeader
          phase={2}
          title="Prospect Generator — Find Clients"
          description="Based on your selected markets from Phase 1, MarketScout identifies businesses that match your ideal client profile."
          inputNote="Receives selected markets from Phase 1"
          outputNote="Selected prospects flow to Phase 3"
        />
        <div className="max-w-lg mx-auto px-4 py-16 text-center">
          <Users className="h-16 w-16 text-gray-200 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-navy mb-2">No Markets Selected</h2>
          <p className="text-sm text-gray-500 mb-6">
            You need to select at least one market in Phase 1 before we can find prospects. Go back and add markets to your plan.
          </p>
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal text-white rounded-lg text-sm font-medium hover:bg-teal-light transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Phase 1: Scout Markets
          </button>
        </div>
      </div>
    );
  }

  const selectedMarketNames = markets
    .filter((m) => selectedMarketIds.has(m.id))
    .map((m) => m.name)
    .join(', ');

  const filtered = availableProspects.filter((p) => {
    if (search && !p.company.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterIndustry && p.industry !== filterIndustry) return false;
    if (filterMinMatch && p.matchScore < filterMinMatch) return false;
    return true;
  });

  const totalValue = filtered.reduce((s, p) => s + p.estimatedProjectValue, 0);
  const avgMatch = Math.round(filtered.reduce((s, p) => s + p.matchScore, 0) / (filtered.length || 1));
  const highMatch = filtered.filter((p) => p.matchScore >= 85).length;

  if (selectedProspect) {
    return (
      <ProspectDetail
        prospect={selectedProspect}
        isSelected={selectedProspectIds.has(selectedProspect.id)}
        onToggle={() => onToggleProspect(selectedProspect.id)}
        onBack={() => setSelectedProspect(null)}
      />
    );
  }

  return (
    <div>
      <PhaseHeader
        phase={2}
        title="Prospect Generator — Find Clients"
        description="Based on your selected markets from Phase 1, MarketScout identifies businesses that match your ideal client profile. Prospects are scored against your best client (British Swim School) on industry fit, digital gaps, and growth potential."
        connection={`Showing prospects in: ${selectedMarketNames}`}
        inputNote={`${selectedMarketIds.size} markets from Phase 1`}
        outputNote="Selected prospects flow to Phase 3"
      >
        <AiBadge tooltip="AI analyses each prospect's current web presence, SEO performance, and digital maturity to recommend specific services." />
      </PhaseHeader>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* BSS Benchmark */}
        <div className="bg-gradient-to-r from-navy to-teal rounded-xl p-4 mb-6 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
              <Star className="h-5 w-5 text-yellow-300" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="text-xs text-white/60 uppercase tracking-wider font-medium">Ideal Client Benchmark</p>
                <AiBadge label="Lookalike Matching" tooltip="AI uses the BSS client profile as a benchmark to score prospect similarity across industry, size, service needs, and growth trajectory." />
              </div>
              <p className="font-bold text-lg">British Swim School</p>
              <p className="text-sm text-white/70">Multi-location franchise · Full-service digital client · Website, SEO, PPC, Social, Content, Video</p>
            </div>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <KPI icon={<Users className="h-5 w-5 text-teal" />} label="Prospects Found" value={filtered.length.toString()} />
          <KPI icon={<Target className="h-5 w-5 text-emerald-600" />} label="High Match (85+)" value={highMatch.toString()} />
          <KPI icon={<Star className="h-5 w-5 text-amber-600" />} label="Avg Match Score" value={`${avgMatch}%`} />
          <KPI icon={<DollarSign className="h-5 w-5 text-blue-600" />} label="Total Pipeline Value" value={`$${(totalValue / 1000).toFixed(0)}K`} />
        </div>

        {/* Selected prospects banner */}
        {selectedProspectIds.size > 0 && (
          <div className="mb-6 bg-indigo-50 border border-indigo-100 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-indigo-700">
                {selectedProspectIds.size} prospect{selectedProspectIds.size !== 1 ? 's' : ''} selected for outreach
              </p>
              <p className="text-xs text-gray-400 mt-0.5">These will carry forward to your campaign plan in Phase 3</p>
            </div>
            <button
              onClick={onNext}
              className="flex items-center gap-2 px-4 py-2 bg-teal text-white rounded-lg text-sm font-medium hover:bg-teal-light transition-colors shrink-0"
            >
              Continue to Phase 3 <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Search & Filters */}
        <div className="bg-white rounded-xl border border-card-border shadow-sm mb-6">
          <div className="p-4 flex flex-wrap gap-3 items-center">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search companies..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-teal/30 focus:border-teal outline-none"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                showFilters ? 'bg-teal/10 border-teal/30 text-teal' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Filter className="h-4 w-4" /> Filters
            </button>
          </div>
          {showFilters && (
            <div className="px-4 pb-4 flex flex-wrap gap-3 border-t pt-3">
              <select value={filterIndustry} onChange={(e) => setFilterIndustry(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none">
                <option value="">All Industries</option>
                {industries(availableProspects).map((i) => <option key={i} value={i}>{i}</option>)}
              </select>
              <select value={filterMinMatch} onChange={(e) => setFilterMinMatch(Number(e.target.value))} className="px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none">
                <option value={0}>Min Match: Any</option>
                <option value={70}>70+</option>
                <option value={80}>80+</option>
                <option value={85}>85+</option>
                <option value={90}>90+</option>
              </select>
              <button onClick={() => { setFilterIndustry(''); setFilterMinMatch(0); setSearch(''); }} className="text-sm text-gray-400 hover:text-gray-600">Clear all</button>
            </div>
          )}
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-card-border shadow-sm overflow-hidden">
          <div className="p-4 border-b border-card-border flex items-center justify-between">
            <h2 className="font-semibold text-navy">Prospects</h2>
            <AiBadge label="AI Gap Analysis" tooltip="Each prospect's digital score is generated by AI crawling their website and scoring mobile readiness, SEO, page speed, content quality, and social presence." />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                <tr>
                  <th className="px-4 py-3 text-left w-10"></th>
                  <th className="px-4 py-3 text-left">Company</th>
                  <th className="px-4 py-3 text-left hidden sm:table-cell">Industry</th>
                  <th className="px-4 py-3 text-left hidden md:table-cell">Location</th>
                  <th className="px-4 py-3 text-center">Digital Score</th>
                  <th className="px-4 py-3 text-center">Match Score</th>
                  <th className="px-4 py-3 text-left hidden lg:table-cell">Suggested Services</th>
                  <th className="px-4 py-3 text-center hidden sm:table-cell">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((p) => {
                  const checked = selectedProspectIds.has(p.id);
                  return (
                    <tr key={p.id} className={`hover:bg-gray-50 cursor-pointer transition-colors ${checked ? 'bg-indigo-50/50' : ''}`} onClick={() => setSelectedProspect(p)}>
                      <td className="px-4 py-3">
                        <button
                          onClick={(e) => { e.stopPropagation(); onToggleProspect(p.id); }}
                          className={`transition-colors ${checked ? 'text-indigo-600' : 'text-gray-300 hover:text-teal'}`}
                        >
                          {checked ? <CheckSquare className="h-5 w-5" /> : <Square className="h-5 w-5" />}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-navy">{p.company}</p>
                        <p className="text-xs text-gray-400 sm:hidden">{p.industry} · {p.location}</p>
                      </td>
                      <td className="px-4 py-3 text-gray-600 hidden sm:table-cell">{p.industry}</td>
                      <td className="px-4 py-3 text-gray-600 hidden md:table-cell">{p.location}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`font-bold ${p.digitalScore <= 30 ? 'text-red-600' : p.digitalScore <= 50 ? 'text-amber-600' : 'text-emerald-600'}`}>
                          {p.digitalScore}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold border ${
                          p.matchScore >= 85 ? 'bg-emerald-100 text-emerald-700 border-emerald-300' : p.matchScore >= 70 ? 'bg-blue-100 text-blue-700 border-blue-300' : 'bg-gray-100 text-gray-600 border-gray-300'
                        }`}>
                          {p.matchScore}%
                        </span>
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <div className="flex flex-wrap gap-1">
                          {p.suggestedServices.slice(0, 2).map((s) => (
                            <span key={s} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">{s}</span>
                          ))}
                          {p.suggestedServices.length > 2 && <span className="text-xs text-gray-400">+{p.suggestedServices.length - 2}</span>}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center hidden sm:table-cell">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${statusColours[p.status]}`}>{p.status}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Continue CTA */}
        {selectedProspectIds.size > 0 && (
          <div className="mt-6 text-center">
            <button
              onClick={onNext}
              className="inline-flex items-center gap-2 px-6 py-3 bg-teal text-white rounded-xl text-sm font-medium hover:bg-teal-light transition-colors shadow-sm"
            >
              Continue to Phase 3: Plan Campaign <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}

        <TechnicalNotes
          dataSources={[
            'Google Places API + Yelp API for business discovery',
            'Automated website crawlers for digital presence scoring',
            'SEMrush/Ahrefs for SEO performance metrics',
            'Google PageSpeed Insights API for technical scores',
            'Social media APIs for presence analysis',
          ]}
          aiCapabilities={[
            'Lookalike matching against ideal client profiles (BSS)',
            'Website quality scoring via computer vision + NLP',
            'Automated service recommendation engine',
            'Revenue estimation models based on industry/size',
          ]}
          simulated={[
            'Prospect businesses and contact details',
            'Digital scores and match percentages',
            'Estimated project values',
            'Service recommendations',
          ]}
          production={[
            'Real business data from API aggregation',
            'Live website crawling and scoring',
            'Dynamic AI matching and recommendations',
            'CRM integration for status tracking',
          ]}
        />
      </div>
    </div>
  );
}

function ProspectDetail({ prospect, isSelected, onToggle, onBack }: { prospect: Prospect; isSelected: boolean; onToggle: () => void; onBack: () => void }) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <button onClick={onBack} className="flex items-center gap-2 text-sm text-gray-500 hover:text-teal mb-4 transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to prospects
      </button>

      <div className="bg-white rounded-xl border border-card-border shadow-sm overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b bg-gradient-to-r from-slate-50 to-white">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-navy">{prospect.company}</h2>
              <p className="text-sm text-gray-400">{prospect.industry} · {prospect.location}</p>
              <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-500">
                <span className="flex items-center gap-1"><Globe className="h-3.5 w-3.5" /> {prospect.website}</span>
                <span>{prospect.employees} employees</span>
                <span>{prospect.revenue} revenue</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <p className="text-xs text-gray-400">Match Score</p>
                <p className={`text-2xl font-bold ${prospect.matchScore >= 85 ? 'text-emerald-600' : 'text-blue-600'}`}>{prospect.matchScore}%</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-400">Digital Score</p>
                <p className={`text-2xl font-bold ${prospect.digitalScore <= 30 ? 'text-red-600' : 'text-amber-600'}`}>{prospect.digitalScore}/100</p>
              </div>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <p className="text-sm text-gray-500"><span className="font-medium text-gray-700">{prospect.contactName}</span> · {prospect.contactTitle}</p>
            <button
              onClick={onToggle}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isSelected
                  ? 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100'
                  : 'bg-teal text-white hover:bg-teal-light'
              }`}
            >
              {isSelected ? <><X className="h-4 w-4" /> Remove from Outreach</> : <><CheckSquare className="h-4 w-4" /> Select for Outreach</>}
            </button>
          </div>
        </div>

        {/* Est Value */}
        <div className="p-4 bg-teal/5 border-b flex items-center justify-between">
          <span className="text-sm font-medium text-teal">Estimated Project Value</span>
          <span className="text-xl font-bold text-navy">${prospect.estimatedProjectValue.toLocaleString()}</span>
        </div>

        {/* Digital Gaps */}
        <div className="p-6 border-b">
          <div className="flex items-center gap-2 mb-3">
            <h3 className="font-semibold text-navy flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-amber-500" /> Current Digital Gaps</h3>
            <AiBadge label="AI Detected" tooltip="AI crawls the prospect's website, analyses page speed, mobile readiness, SEO tags, content quality, and social links to identify specific gaps." />
          </div>
          <div className="grid sm:grid-cols-2 gap-2">
            {prospect.digitalGaps.map((g, i) => (
              <div key={i} className="flex items-start gap-2 text-sm text-gray-600">
                <X className="h-4 w-4 text-red-400 shrink-0 mt-0.5" /> {g}
              </div>
            ))}
          </div>
        </div>

        {/* Recommended Services */}
        <div className="p-6 border-b">
          <div className="flex items-center gap-2 mb-3">
            <h3 className="font-semibold text-navy flex items-center gap-2"><CheckCircle className="h-4 w-4 text-emerald-500" /> Recommended Services</h3>
            <AiBadge label="AI Recommended" tooltip="Service recommendations are generated by AI matching detected digital gaps against Web Sharx's service catalogue and the prospect's industry needs." />
          </div>
          <div className="flex flex-wrap gap-2">
            {prospect.recommendedServices.map((s) => (
              <span key={s} className="px-3 py-1.5 bg-teal/10 text-teal rounded-lg text-sm font-medium">{s}</span>
            ))}
          </div>
        </div>

        {/* Status */}
        <div className="p-6">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Current Status</span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${statusColours[prospect.status]}`}>{prospect.status}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function KPI({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="bg-white rounded-xl border border-card-border shadow-sm p-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center shrink-0">{icon}</div>
        <div>
          <p className="text-xs text-gray-400">{label}</p>
          <p className="text-lg font-bold text-navy">{value}</p>
        </div>
      </div>
    </div>
  );
}

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

const statusStyles: Record<string, string> = {
  new: 'grade-b',
  contacted: 'grade-c',
  qualified: 'grade-a',
  proposal: 'bg-[#af52de]/12 text-[#8944ab]',
  closed: 'bg-[#1d1d1f]/6 text-[#86868b]',
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

  if (selectedMarketIds.size === 0) {
    return (
      <div>
        <PhaseHeader
          phase={2}
          title="Prospect Generator"
          description="Based on your selected markets from Phase 1, MarketScout identifies businesses that match your ideal client profile."
          inputNote="Receives selected markets from Phase 1"
          outputNote="Selected prospects flow to Phase 3"
        />
        <div className="max-w-lg mx-auto px-4 py-20 text-center">
          <Users className="h-16 w-16 text-[#1d1d1f]/10 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-[#1d1d1f] mb-2">No Markets Selected</h2>
          <p className="text-sm text-[#86868b] mb-6">
            You need to select at least one market in Phase 1 before we can find prospects.
          </p>
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#1d1d1f] text-white rounded-full text-sm font-medium hover:bg-[#1d1d1f]/85 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Phase 1
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
        title="Prospect Generator"
        description="Based on your selected markets from Phase 1, MarketScout identifies businesses that match your ideal client profile. Prospects are scored against your best client (British Swim School) on industry fit, digital gaps, and growth potential."
        connection={`Showing prospects in: ${selectedMarketNames}`}
        inputNote={`${selectedMarketIds.size} markets from Phase 1`}
        outputNote="Selected prospects flow to Phase 3"
      >
        <AiBadge tooltip="AI analyses each prospect's current web presence, SEO performance, and digital maturity to recommend specific services." />
      </PhaseHeader>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* BSS Benchmark */}
        <div className="glass-card-static p-5 mb-8 flex items-center gap-4" style={{ borderLeft: '3px solid rgba(45,106,122,0.3)' }}>
          <div className="w-11 h-11 rounded-2xl bg-[#c77800]/10 flex items-center justify-center shrink-0">
            <Star className="h-5 w-5 text-[#c77800]" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <p className="text-[10px] text-[#86868b] uppercase tracking-wider font-medium">Ideal Client Benchmark</p>
              <AiBadge label="Lookalike" tooltip="AI uses the BSS client profile as a benchmark to score prospect similarity across industry, size, service needs, and growth trajectory." />
            </div>
            <p className="font-semibold text-[#1d1d1f] text-lg">British Swim School</p>
            <p className="text-sm text-[#86868b]">Multi-location franchise · Full-service digital client · Website, SEO, PPC, Social, Content, Video</p>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <KPI icon={<Users className="h-5 w-5" />} iconColor="text-teal" label="Prospects Found" value={filtered.length.toString()} />
          <KPI icon={<Target className="h-5 w-5" />} iconColor="text-[#248a3d]" label="High Match (85+)" value={highMatch.toString()} />
          <KPI icon={<Star className="h-5 w-5" />} iconColor="text-[#c77800]" label="Avg Match Score" value={`${avgMatch}%`} />
          <KPI icon={<DollarSign className="h-5 w-5" />} iconColor="text-[#0055d4]" label="Total Pipeline Value" value={`$${(totalValue / 1000).toFixed(0)}K`} />
        </div>

        {/* Selected prospects banner */}
        {selectedProspectIds.size > 0 && (
          <div className="mb-8 glass-card-static p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3" style={{ background: 'rgba(45,106,122,0.06)' }}>
            <div>
              <p className="text-sm font-medium text-[#1d1d1f]">
                {selectedProspectIds.size} prospect{selectedProspectIds.size !== 1 ? 's' : ''} selected for outreach
              </p>
              <p className="text-xs text-[#86868b] mt-0.5">These will carry forward to your campaign plan in Phase 3</p>
            </div>
            <button
              onClick={onNext}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#1d1d1f] text-white rounded-full text-sm font-medium hover:bg-[#1d1d1f]/85 transition-colors shrink-0"
            >
              Continue to Phase 3 <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Search & Filters */}
        <div className="glass-card-static mb-6">
          <div className="p-4 flex flex-wrap gap-3 items-center">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#86868b]" />
              <input
                type="text"
                placeholder="Search companies..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#1d1d1f]/4 border-none rounded-full text-sm focus:ring-2 focus:ring-teal/20 outline-none placeholder:text-[#86868b]/60"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${
                showFilters ? 'bg-[#1d1d1f]/8 text-[#1d1d1f]' : 'bg-[#1d1d1f]/4 text-[#86868b] hover:bg-[#1d1d1f]/8'
              }`}
            >
              <Filter className="h-4 w-4" /> Filters
            </button>
          </div>
          {showFilters && (
            <div className="px-4 pb-4 flex flex-wrap gap-3 border-t border-[#1d1d1f]/6 pt-3">
              <select value={filterIndustry} onChange={(e) => setFilterIndustry(e.target.value)} className="px-4 py-2 bg-[#1d1d1f]/4 border-none rounded-full text-sm outline-none text-[#1d1d1f]">
                <option value="">All Industries</option>
                {industries(availableProspects).map((i) => <option key={i} value={i}>{i}</option>)}
              </select>
              <select value={filterMinMatch} onChange={(e) => setFilterMinMatch(Number(e.target.value))} className="px-4 py-2 bg-[#1d1d1f]/4 border-none rounded-full text-sm outline-none text-[#1d1d1f]">
                <option value={0}>Min Match: Any</option>
                <option value={70}>70+</option>
                <option value={80}>80+</option>
                <option value={85}>85+</option>
                <option value={90}>90+</option>
              </select>
              <button onClick={() => { setFilterIndustry(''); setFilterMinMatch(0); setSearch(''); }} className="text-sm text-[#86868b] hover:text-[#1d1d1f] transition-colors">Clear all</button>
            </div>
          )}
        </div>

        {/* Table */}
        <div className="glass-card-static overflow-hidden">
          <div className="p-5 border-b border-[#1d1d1f]/6 flex items-center justify-between">
            <h2 className="font-semibold text-[#1d1d1f]">Prospects</h2>
            <AiBadge label="AI Gap Analysis" tooltip="Each prospect's digital score is generated by AI crawling their website and scoring mobile readiness, SEO, page speed, content quality, and social presence." />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm glass-table">
              <thead>
                <tr>
                  <th className="px-5 py-3.5 text-left w-10"></th>
                  <th className="px-5 py-3.5 text-left">Company</th>
                  <th className="px-5 py-3.5 text-left hidden sm:table-cell">Industry</th>
                  <th className="px-5 py-3.5 text-left hidden md:table-cell">Location</th>
                  <th className="px-5 py-3.5 text-center">Digital</th>
                  <th className="px-5 py-3.5 text-center">Match</th>
                  <th className="px-5 py-3.5 text-left hidden lg:table-cell">Suggested Services</th>
                  <th className="px-5 py-3.5 text-center hidden sm:table-cell">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => {
                  const checked = selectedProspectIds.has(p.id);
                  return (
                    <tr key={p.id} className={`cursor-pointer transition-all duration-200 ${checked ? 'bg-teal/4' : ''}`} onClick={() => setSelectedProspect(p)}>
                      <td className="px-5 py-3.5">
                        <button
                          onClick={(e) => { e.stopPropagation(); onToggleProspect(p.id); }}
                          className={`transition-colors ${checked ? 'text-[#1d1d1f]' : 'text-[#1d1d1f]/20 hover:text-teal'}`}
                        >
                          {checked ? <CheckSquare className="h-5 w-5" /> : <Square className="h-5 w-5" />}
                        </button>
                      </td>
                      <td className="px-5 py-3.5">
                        <p className="font-medium text-[#1d1d1f]">{p.company}</p>
                        <p className="text-xs text-[#86868b] sm:hidden">{p.industry} · {p.location}</p>
                      </td>
                      <td className="px-5 py-3.5 text-[#86868b] hidden sm:table-cell">{p.industry}</td>
                      <td className="px-5 py-3.5 text-[#86868b] hidden md:table-cell">{p.location}</td>
                      <td className="px-5 py-3.5 text-center">
                        <span className={`text-sm font-semibold ${p.digitalScore <= 30 ? 'text-[#d70015]' : p.digitalScore <= 50 ? 'text-[#c77800]' : 'text-[#248a3d]'}`}>
                          {p.digitalScore}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-center">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          p.matchScore >= 85 ? 'grade-a' : p.matchScore >= 70 ? 'grade-b' : 'bg-[#1d1d1f]/6 text-[#86868b]'
                        }`}>
                          {p.matchScore}%
                        </span>
                      </td>
                      <td className="px-5 py-3.5 hidden lg:table-cell">
                        <div className="flex flex-wrap gap-1.5">
                          {p.suggestedServices.slice(0, 2).map((s) => (
                            <span key={s} className="pill-badge">{s}</span>
                          ))}
                          {p.suggestedServices.length > 2 && <span className="text-xs text-[#86868b]">+{p.suggestedServices.length - 2}</span>}
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-center hidden sm:table-cell">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${statusStyles[p.status]}`}>{p.status}</span>
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
          <div className="mt-8 text-center">
            <button
              onClick={onNext}
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#1d1d1f] text-white rounded-full text-sm font-medium hover:bg-[#1d1d1f]/85 transition-colors shadow-lg shadow-black/10"
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
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button onClick={onBack} className="flex items-center gap-2 text-sm text-[#86868b] hover:text-[#1d1d1f] mb-5 transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to prospects
      </button>

      <div className="glass-card-static overflow-hidden">
        {/* Header */}
        <div className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-[#1d1d1f]">{prospect.company}</h2>
              <p className="text-sm text-[#86868b]">{prospect.industry} · {prospect.location}</p>
              <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-[#86868b]">
                <span className="flex items-center gap-1"><Globe className="h-3.5 w-3.5" /> {prospect.website}</span>
                <span>{prospect.employees} employees</span>
                <span>{prospect.revenue} revenue</span>
              </div>
            </div>
            <div className="flex items-center gap-5">
              <div className="text-center">
                <p className="text-[10px] text-[#86868b] uppercase tracking-wider">Match</p>
                <p className={`text-2xl font-light ${prospect.matchScore >= 85 ? 'text-[#248a3d]' : 'text-[#0055d4]'}`}>{prospect.matchScore}%</p>
              </div>
              <div className="text-center">
                <p className="text-[10px] text-[#86868b] uppercase tracking-wider">Digital</p>
                <p className={`text-2xl font-light ${prospect.digitalScore <= 30 ? 'text-[#d70015]' : 'text-[#c77800]'}`}>{prospect.digitalScore}/100</p>
              </div>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-[#86868b]"><span className="font-medium text-[#1d1d1f]">{prospect.contactName}</span> · {prospect.contactTitle}</p>
            <button
              onClick={onToggle}
              className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                isSelected
                  ? 'bg-[#d70015]/10 text-[#d70015] hover:bg-[#d70015]/15'
                  : 'bg-[#1d1d1f] text-white hover:bg-[#1d1d1f]/85'
              }`}
            >
              {isSelected ? <><X className="h-4 w-4" /> Remove from Outreach</> : <><CheckSquare className="h-4 w-4" /> Select for Outreach</>}
            </button>
          </div>
        </div>

        {/* Est Value */}
        <div className="mx-6 mb-6 p-4 rounded-2xl bg-teal/5 flex items-center justify-between">
          <span className="text-sm font-medium text-teal">Estimated Project Value</span>
          <span className="text-xl font-light text-[#1d1d1f]">${prospect.estimatedProjectValue.toLocaleString()}</span>
        </div>

        {/* Digital Gaps */}
        <div className="px-6 pb-6 border-b border-[#1d1d1f]/6">
          <div className="flex items-center gap-2 mb-3">
            <h3 className="font-semibold text-[#1d1d1f] flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-[#c77800]" /> Current Digital Gaps</h3>
            <AiBadge label="AI Detected" tooltip="AI crawls the prospect's website, analyses page speed, mobile readiness, SEO tags, content quality, and social links to identify specific gaps." />
          </div>
          <div className="grid sm:grid-cols-2 gap-2">
            {prospect.digitalGaps.map((g, i) => (
              <div key={i} className="flex items-start gap-2 text-sm text-[#86868b]">
                <X className="h-4 w-4 text-[#d70015]/60 shrink-0 mt-0.5" /> {g}
              </div>
            ))}
          </div>
        </div>

        {/* Recommended Services */}
        <div className="px-6 py-6 border-b border-[#1d1d1f]/6">
          <div className="flex items-center gap-2 mb-3">
            <h3 className="font-semibold text-[#1d1d1f] flex items-center gap-2"><CheckCircle className="h-4 w-4 text-[#248a3d]" /> Recommended Services</h3>
            <AiBadge label="AI Recommended" tooltip="Service recommendations are generated by AI matching detected digital gaps against Web Sharx's service catalogue and the prospect's industry needs." />
          </div>
          <div className="flex flex-wrap gap-2">
            {prospect.recommendedServices.map((s) => (
              <span key={s} className="pill-badge text-teal" style={{ background: 'rgba(45,106,122,0.08)' }}>{s}</span>
            ))}
          </div>
        </div>

        {/* Status */}
        <div className="px-6 py-6">
          <div className="flex items-center justify-between">
            <span className="text-sm text-[#86868b]">Current Status</span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${statusStyles[prospect.status]}`}>{prospect.status}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function KPI({ icon, iconColor, label, value }: { icon: React.ReactNode; iconColor: string; label: string; value: string }) {
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
      </div>
    </div>
  );
}

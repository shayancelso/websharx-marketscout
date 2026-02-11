import { useState } from 'react';
import { Users, Target, DollarSign, Star, Search, Filter, X, Globe, ArrowLeft, CheckCircle, AlertTriangle } from 'lucide-react';
import { prospects } from '../data/prospects';
import type { Prospect } from '../types';

const industries = [...new Set(prospects.map((p) => p.industry))].sort();
const locations = [...new Set(prospects.map((p) => p.location))].sort();

const statusColours: Record<string, string> = {
  new: 'bg-blue-100 text-blue-700',
  contacted: 'bg-amber-100 text-amber-700',
  qualified: 'bg-emerald-100 text-emerald-700',
  proposal: 'bg-purple-100 text-purple-700',
  closed: 'bg-gray-100 text-gray-700',
};

export function ProspectGenerator() {
  const [search, setSearch] = useState('');
  const [filterIndustry, setFilterIndustry] = useState('');
  const [filterLocation, setFilterLocation] = useState('');
  const [filterMinMatch, setFilterMinMatch] = useState(0);
  const [selectedProspect, setSelectedProspect] = useState<Prospect | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const filtered = prospects.filter((p) => {
    if (search && !p.company.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterIndustry && p.industry !== filterIndustry) return false;
    if (filterLocation && p.location !== filterLocation) return false;
    if (filterMinMatch && p.matchScore < filterMinMatch) return false;
    return true;
  });

  const totalValue = filtered.reduce((s, p) => s + p.estimatedProjectValue, 0);
  const avgMatch = Math.round(filtered.reduce((s, p) => s + p.matchScore, 0) / (filtered.length || 1));
  const highMatch = filtered.filter((p) => p.matchScore >= 85).length;

  if (selectedProspect) {
    return <ProspectDetail prospect={selectedProspect} onBack={() => setSelectedProspect(null)} />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* BSS Benchmark */}
      <div className="bg-gradient-to-r from-navy to-teal rounded-xl p-4 mb-6 text-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
            <Star className="h-5 w-5 text-yellow-300" />
          </div>
          <div>
            <p className="text-xs text-white/60 uppercase tracking-wider font-medium">Ideal Client Benchmark</p>
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
              {industries.map((i) => <option key={i} value={i}>{i}</option>)}
            </select>
            <select value={filterLocation} onChange={(e) => setFilterLocation(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none">
              <option value="">All Locations</option>
              {locations.map((l) => <option key={l} value={l}>{l}</option>)}
            </select>
            <select value={filterMinMatch} onChange={(e) => setFilterMinMatch(Number(e.target.value))} className="px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none">
              <option value={0}>Min Match: Any</option>
              <option value={70}>70+</option>
              <option value={80}>80+</option>
              <option value={85}>85+</option>
              <option value={90}>90+</option>
            </select>
            <button onClick={() => { setFilterIndustry(''); setFilterLocation(''); setFilterMinMatch(0); setSearch(''); }} className="text-sm text-gray-400 hover:text-gray-600">Clear all</button>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-card-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
              <tr>
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
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50 cursor-pointer transition-colors" onClick={() => setSelectedProspect(p)}>
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
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function ProspectDetail({ prospect, onBack }: { prospect: Prospect; onBack: () => void }) {
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
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
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
          <div className="mt-3">
            <p className="text-sm text-gray-500"><span className="font-medium text-gray-700">{prospect.contactName}</span> · {prospect.contactTitle}</p>
          </div>
        </div>

        {/* Est Value */}
        <div className="p-4 bg-teal/5 border-b flex items-center justify-between">
          <span className="text-sm font-medium text-teal">Estimated Project Value</span>
          <span className="text-xl font-bold text-navy">${prospect.estimatedProjectValue.toLocaleString()}</span>
        </div>

        {/* Digital Gaps */}
        <div className="p-6 border-b">
          <h3 className="font-semibold text-navy mb-3 flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-amber-500" /> Current Digital Gaps</h3>
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
          <h3 className="font-semibold text-navy mb-3 flex items-center gap-2"><CheckCircle className="h-4 w-4 text-emerald-500" /> Recommended Services</h3>
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

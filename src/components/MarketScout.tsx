import { useState, useEffect } from 'react';
import { MapPin, TrendingUp, Award, BarChart3, Lightbulb, CheckCircle, XCircle, Building2, Wifi, Users, Sprout, PlusCircle, MinusCircle, ArrowRight } from 'lucide-react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { markets } from '../data/markets';
import type { Market } from '../types';
import { PhaseHeader } from './PhaseHeader';
import { AiBadge } from './AiBadge';
import { TechnicalNotes } from './TechnicalNotes';

interface MarketScoutProps {
  selectedMarketIds: Set<string>;
  onToggleMarket: (id: string) => void;
  onNext: () => void;
}

function MapRecenter({ coords }: { coords: [number, number] | null }) {
  const map = useMap();
  useEffect(() => {
    if (coords) map.setView(coords, 8, { animate: true });
  }, [coords, map]);
  return null;
}

// Score ring component
function ScoreRing({ value, size = 40, stroke = 3, color }: { value: number; size?: number; stroke?: number; color: string }) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;
  return (
    <div className="score-ring" style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth={stroke} />
        <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke={color} strokeWidth={stroke} strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-[#1d1d1f]">{value}</span>
    </div>
  );
}

function getScoreColor(score: number) {
  if (score >= 80) return '#248a3d';
  if (score >= 70) return '#0055d4';
  if (score >= 60) return '#c77800';
  return '#d70015';
}

function gradeClass(grade: string) {
  switch (grade) {
    case 'A': return 'grade-a';
    case 'B': return 'grade-b';
    case 'C': return 'grade-c';
    default: return 'grade-d';
  }
}

export function MarketScout({ selectedMarketIds, onToggleMarket, onNext }: MarketScoutProps) {
  const [selectedMarket, setSelectedMarket] = useState<Market | null>(null);
  const [centreCoords, setCentreCoords] = useState<[number, number] | null>(null);

  const topMarket = markets.reduce((a, b) => (a.opportunityScore > b.opportunityScore ? a : b));
  const avgScore = Math.round(markets.reduce((sum, m) => sum + m.opportunityScore, 0) / markets.length);
  const gradeAB = markets.filter((m) => m.grade === 'A' || m.grade === 'B').length;

  const handleMarketClick = (market: Market) => {
    setSelectedMarket(market);
    setCentreCoords([market.lat, market.lng]);
  };

  return (
    <div>
      <PhaseHeader
        phase={1}
        title="Market Scout"
        description="Select or search US markets to analyse. MarketScout scores each location based on business density, digital maturity gaps, competition, and growth potential."
        outputNote="Selected markets flow to Phase 2 & 3"
      >
        <AiBadge tooltip="AI analyses business registrations, web presence data, and economic indicators to score each market's opportunity potential." />
      </PhaseHeader>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <KPICard icon={<MapPin className="h-5 w-5" />} iconColor="text-teal" label="Markets Analysed" value={markets.length.toString()} />
          <KPICard icon={<Award className="h-5 w-5" />} iconColor="text-[#248a3d]" label="Top Market" value={topMarket.name} sub={`Score: ${topMarket.opportunityScore}`} />
          <KPICard icon={<BarChart3 className="h-5 w-5" />} iconColor="text-[#0055d4]" label="Avg Opportunity Score" value={avgScore.toString()} sub="out of 100" />
          <KPICard icon={<TrendingUp className="h-5 w-5" />} iconColor="text-[#c77800]" label="Markets Grade A/B" value={gradeAB.toString()} sub={`of ${markets.length} total`} />
        </div>

        {/* Selected markets banner */}
        {selectedMarketIds.size > 0 && (
          <div className="mb-8 glass-card-static p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3" style={{ background: 'rgba(45,106,122,0.06)' }}>
            <div>
              <p className="text-sm font-medium text-[#1d1d1f]">
                {selectedMarketIds.size} market{selectedMarketIds.size !== 1 ? 's' : ''} selected for your plan
              </p>
              <p className="text-xs text-[#86868b] mt-0.5">
                {markets.filter((m) => selectedMarketIds.has(m.id)).map((m) => m.name).join(', ')}
              </p>
            </div>
            <button
              onClick={onNext}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#1d1d1f] text-white rounded-full text-sm font-medium hover:bg-[#1d1d1f]/85 transition-colors shrink-0"
            >
              Continue to Phase 2 <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Map */}
          <div className="lg:col-span-3 glass-card-static overflow-hidden">
            <div className="p-5 border-b border-[#1d1d1f]/6 flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-[#1d1d1f]">US Market Opportunities</h2>
                <p className="text-xs text-[#86868b] mt-0.5">Click a marker to view details · Click "Add to Plan" to select</p>
              </div>
              <AiBadge label="AI Scored" tooltip="Market scores are generated by AI analysis of business density, digital maturity, competitive landscape, and economic growth indicators." />
            </div>
            <div className="h-[450px] sm:h-[500px]" style={{ boxShadow: 'inset 0 2px 12px rgba(0,0,0,0.04)' }}>
              <MapContainer center={[33, -96]} zoom={5} className="h-full w-full" scrollWheelZoom={true}>
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                />
                <MapRecenter coords={centreCoords} />
                {markets.map((market) => (
                  <CircleMarker
                    key={market.id}
                    center={[market.lat, market.lng]}
                    radius={Math.max(8, market.opportunityScore / 6)}
                    pathOptions={{
                      fillColor: selectedMarketIds.has(market.id) ? '#1d1d1f' : getScoreColor(market.opportunityScore),
                      color: 'rgba(255,255,255,0.8)',
                      weight: 2,
                      fillOpacity: selectedMarketIds.has(market.id) ? 0.9 : 0.6,
                    }}
                    eventHandlers={{ click: () => handleMarketClick(market) }}
                  >
                    <Popup>
                      <div className="text-sm min-w-[180px] p-1">
                        <p className="font-semibold text-[#1d1d1f]">{market.name}, {market.state}</p>
                        <p className="text-[#86868b] text-xs mt-0.5">Score: {market.opportunityScore} · Grade {market.grade}</p>
                        <button
                          onClick={(e) => { e.stopPropagation(); onToggleMarket(market.id); }}
                          className={`mt-2 w-full px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                            selectedMarketIds.has(market.id)
                              ? 'bg-[#d70015]/10 text-[#d70015] hover:bg-[#d70015]/15'
                              : 'bg-[#1d1d1f] text-white hover:bg-[#1d1d1f]/85'
                          }`}
                        >
                          {selectedMarketIds.has(market.id) ? 'Remove from Plan' : 'Add to Plan'}
                        </button>
                      </div>
                    </Popup>
                  </CircleMarker>
                ))}
              </MapContainer>
            </div>
          </div>

          {/* Detail Panel */}
          <div className="lg:col-span-2">
            {selectedMarket ? (
              <MarketDetail
                market={selectedMarket}
                isSelected={selectedMarketIds.has(selectedMarket.id)}
                onToggle={() => onToggleMarket(selectedMarket.id)}
              />
            ) : (
              <div className="glass-card-static p-10 text-center">
                <MapPin className="h-12 w-12 text-[#1d1d1f]/10 mx-auto mb-4" />
                <h3 className="font-medium text-[#1d1d1f] mb-1">Select a Market</h3>
                <p className="text-sm text-[#86868b]">Click a pin on the map to view detailed market analysis</p>
              </div>
            )}
          </div>
        </div>

        {/* Market Rankings Table */}
        <div className="mt-8 glass-card-static overflow-hidden">
          <div className="p-5 border-b border-[#1d1d1f]/6 flex items-center justify-between">
            <h2 className="font-semibold text-[#1d1d1f]">Market Rankings</h2>
            <AiBadge label="AI Analysis" tooltip="Competitive analysis powered by AI evaluation of agency density, market saturation, and service gap identification." />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm glass-table">
              <thead>
                <tr>
                  <th className="px-5 py-3.5 text-left w-10"></th>
                  <th className="px-5 py-3.5 text-left">#</th>
                  <th className="px-5 py-3.5 text-left">Market</th>
                  <th className="px-5 py-3.5 text-center">Score</th>
                  <th className="px-5 py-3.5 text-center">Grade</th>
                  <th className="px-5 py-3.5 text-right hidden sm:table-cell">Businesses Needing Services</th>
                  <th className="px-5 py-3.5 text-right hidden md:table-cell">Avg Digital Spend</th>
                  <th className="px-5 py-3.5 text-center hidden lg:table-cell">Top Verticals</th>
                </tr>
              </thead>
              <tbody>
                {[...markets].sort((a, b) => b.opportunityScore - a.opportunityScore).map((m, i) => {
                  const selected = selectedMarketIds.has(m.id);
                  return (
                    <tr
                      key={m.id}
                      className={`cursor-pointer transition-all duration-200 ${selected ? 'bg-teal/4' : ''}`}
                      onClick={() => handleMarketClick(m)}
                    >
                      <td className="px-5 py-3.5">
                        <button
                          onClick={(e) => { e.stopPropagation(); onToggleMarket(m.id); }}
                          className={`transition-colors ${selected ? 'text-[#1d1d1f]' : 'text-[#1d1d1f]/20 hover:text-teal'}`}
                          title={selected ? 'Remove from plan' : 'Add to plan'}
                        >
                          {selected ? <MinusCircle className="h-5 w-5" /> : <PlusCircle className="h-5 w-5" />}
                        </button>
                      </td>
                      <td className="px-5 py-3.5 font-medium text-[#86868b]">{i + 1}</td>
                      <td className="px-5 py-3.5 font-medium text-[#1d1d1f]">{m.name}, {m.state}</td>
                      <td className="px-5 py-3.5 text-center">
                        <ScoreRing value={m.opportunityScore} color={getScoreColor(m.opportunityScore)} />
                      </td>
                      <td className="px-5 py-3.5 text-center">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${gradeClass(m.grade)}`}>{m.grade}</span>
                      </td>
                      <td className="px-5 py-3.5 text-right hidden sm:table-cell text-[#86868b]">{m.businessesNeedingServices.toLocaleString()}</td>
                      <td className="px-5 py-3.5 text-right hidden md:table-cell text-[#86868b]">${m.avgDigitalSpend.toLocaleString()}</td>
                      <td className="px-5 py-3.5 hidden lg:table-cell">
                        <div className="flex flex-wrap gap-1.5 justify-center">
                          {m.topVerticals.slice(0, 2).map((v) => (
                            <span key={v} className="pill-badge">{v}</span>
                          ))}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Continue CTA */}
        {selectedMarketIds.size > 0 && (
          <div className="mt-8 text-center">
            <button
              onClick={onNext}
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#1d1d1f] text-white rounded-full text-sm font-medium hover:bg-[#1d1d1f]/85 transition-colors shadow-lg shadow-black/10"
            >
              Continue to Phase 2: Find Prospects <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}

        <TechnicalNotes
          dataSources={[
            'Google Places API for business density & verticals',
            'BuiltWith / Wappalyzer for technology detection',
            'SEMrush / Ahrefs APIs for SEO competitive data',
            'US Census Bureau for economic indicators',
            'Business registration databases (state-level)',
          ]}
          aiCapabilities={[
            'ML scoring model combining 12+ market signals',
            'NLP-generated market summaries & recommendations',
            'Competitive landscape analysis using clustering',
            'Trend forecasting using time-series data',
          ]}
          simulated={[
            'Market opportunity scores (realistic ranges)',
            'Business counts and digital spend figures',
            'AI-generated summaries (pre-written)',
            'Competitive density estimates',
          ]}
          production={[
            'Live API calls to data providers',
            'Real-time scoring model inference',
            'Dynamic AI summary generation (LLM)',
            'Automated data refresh cycles',
          ]}
        />
      </div>
    </div>
  );
}

function MarketDetail({ market, isSelected, onToggle }: { market: Market; isSelected: boolean; onToggle: () => void }) {
  return (
    <div className="glass-card-static overflow-hidden">
      {/* Header */}
      <div className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-[#1d1d1f]">{market.name}, {market.state}</h3>
            <p className="text-sm text-[#86868b] flex items-center gap-1 mt-0.5">
              <MapPin className="h-3 w-3" /> {market.totalBusinesses.toLocaleString()} total businesses
            </p>
          </div>
          <div className="text-right">
            <ScoreRing value={market.opportunityScore} size={52} stroke={3} color={getScoreColor(market.opportunityScore)} />
            <span className={`mt-1 inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${gradeClass(market.grade)}`}>
              Grade {market.grade}
            </span>
          </div>
        </div>
        <button
          onClick={onToggle}
          className={`mt-4 w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${
            isSelected
              ? 'bg-[#d70015]/10 text-[#d70015] hover:bg-[#d70015]/15'
              : 'bg-[#1d1d1f] text-white hover:bg-[#1d1d1f]/85'
          }`}
        >
          {isSelected ? (
            <><MinusCircle className="h-4 w-4" /> Remove from Plan</>
          ) : (
            <><PlusCircle className="h-4 w-4" /> Add to Plan</>
          )}
        </button>
      </div>

      {/* AI Summary */}
      <div className="mx-5 mb-5 p-4 rounded-2xl bg-[#1d1d1f]/4">
        <div className="flex items-start gap-3">
          <Lightbulb className="h-4 w-4 mt-0.5 shrink-0 text-[#c77800]" />
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-medium text-[#86868b] uppercase tracking-wider">AI Market Analysis</span>
              <AiBadge label="AI" tooltip="AI-generated market analysis based on business density, digital maturity data, and competitive landscape evaluation." />
            </div>
            <p className="text-sm leading-relaxed text-[#86868b]">{market.aiSummary}</p>
          </div>
        </div>
      </div>

      {/* Score Breakdown */}
      <div className="px-5 pb-5 border-b border-[#1d1d1f]/6">
        <h4 className="text-xs font-semibold text-[#1d1d1f] uppercase tracking-wider mb-3">Score Breakdown</h4>
        <div className="space-y-3">
          <ScoreBar icon={<Building2 className="h-3.5 w-3.5 text-[#0055d4]" />} label="Business Density" value={market.businessDensity} />
          <ScoreBar icon={<Wifi className="h-3.5 w-3.5 text-[#c77800]" />} label="Digital Maturity Gap" value={market.digitalMaturityGap} />
          <ScoreBar icon={<Users className="h-3.5 w-3.5 text-[#86868b]" />} label="Agency Competition" value={100 - market.agencyCompetition} suffix="(low = better)" />
          <ScoreBar icon={<Sprout className="h-3.5 w-3.5 text-[#248a3d]" />} label="Business Growth Rate" value={market.businessGrowthRate} />
        </div>
      </div>

      {/* Pros/Cons */}
      <div className="grid grid-cols-2 divide-x divide-[#1d1d1f]/6">
        <div className="p-5">
          <h4 className="text-xs font-semibold text-[#248a3d] mb-2 flex items-center gap-1 uppercase tracking-wider">
            <CheckCircle className="h-3.5 w-3.5" /> Strengths
          </h4>
          <ul className="space-y-1.5">
            {market.pros.map((p, i) => (
              <li key={i} className="text-xs text-[#86868b] flex items-start gap-1.5">
                <span className="text-[#248a3d] mt-0.5 shrink-0">·</span> {p}
              </li>
            ))}
          </ul>
        </div>
        <div className="p-5">
          <h4 className="text-xs font-semibold text-[#d70015] mb-2 flex items-center gap-1 uppercase tracking-wider">
            <XCircle className="h-3.5 w-3.5" /> Concerns
          </h4>
          <ul className="space-y-1.5">
            {market.cons.map((c, i) => (
              <li key={i} className="text-xs text-[#86868b] flex items-start gap-1.5">
                <span className="text-[#d70015] mt-0.5 shrink-0">·</span> {c}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Key Stats */}
      <div className="p-5 border-t border-[#1d1d1f]/6">
        <h4 className="text-xs font-semibold text-[#1d1d1f] mb-3 uppercase tracking-wider">Key Statistics</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-[#86868b]">Businesses Needing Services</p>
            <p className="text-xl font-light text-[#1d1d1f]">{market.businessesNeedingServices.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-xs text-[#86868b]">Avg Digital Spend</p>
            <p className="text-xl font-light text-[#1d1d1f]">${market.avgDigitalSpend.toLocaleString()}/mo</p>
          </div>
        </div>
      </div>

      {/* Top Verticals */}
      <div className="px-5 pb-5 border-t border-[#1d1d1f]/6 pt-5">
        <h4 className="text-xs font-semibold text-[#1d1d1f] mb-2 uppercase tracking-wider">Top Verticals</h4>
        <div className="flex flex-wrap gap-2">
          {market.topVerticals.map((v) => (
            <span key={v} className="pill-badge text-teal" style={{ background: 'rgba(45,106,122,0.08)' }}>{v}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

function ScoreBar({ icon, label, value, suffix }: { icon: React.ReactNode; label: string; value: number; suffix?: string }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-1.5 text-xs text-[#86868b]">
          {icon} {label} {suffix && <span className="text-[#86868b]/60">{suffix}</span>}
        </div>
        <span className="text-xs font-semibold text-[#1d1d1f]">{value}</span>
      </div>
      <div className="h-1.5 bg-[#1d1d1f]/5 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${value}%`,
            backgroundColor: getScoreColor(value),
            opacity: 0.7,
          }}
        />
      </div>
    </div>
  );
}

function KPICard({ icon, iconColor, label, value, sub }: { icon: React.ReactNode; iconColor: string; label: string; value: string; sub?: string }) {
  return (
    <div className="glass-card-static p-5 relative overflow-hidden">
      {/* Background icon */}
      <div className={`absolute -right-2 -top-2 opacity-[0.04] ${iconColor}`} style={{ transform: 'scale(3)' }}>
        {icon}
      </div>
      <div className="relative">
        <div className={`w-9 h-9 rounded-xl bg-[#1d1d1f]/4 flex items-center justify-center mb-3 ${iconColor}`}>
          {icon}
        </div>
        <p className="text-xs text-[#86868b] mb-0.5">{label}</p>
        <p className="text-2xl font-light text-[#1d1d1f]">{value}</p>
        {sub && <p className="text-xs text-[#86868b] mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

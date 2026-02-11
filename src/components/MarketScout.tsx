import { useState } from 'react';
import { MapPin, TrendingUp, Award, BarChart3, Lightbulb, CheckCircle, XCircle, Building2, Wifi, Users, Sprout } from 'lucide-react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { markets, getGradeColour, getScoreColour } from '../data/markets';
import type { Market } from '../types';
import { useEffect } from 'react';

function MapRecenter({ coords }: { coords: [number, number] | null }) {
  const map = useMap();
  useEffect(() => {
    if (coords) map.setView(coords, 8, { animate: true });
  }, [coords, map]);
  return null;
}

export function MarketScout() {
  const [selectedMarket, setSelectedMarket] = useState<Market | null>(null);
  const [centreCoords, setCentreCoords] = useState<[number, number] | null>(null);

  const topMarket = markets.reduce((a, b) => (a.opportunityScore > b.opportunityScore ? a : b));
  const avgScore = Math.round(markets.reduce((sum, m) => sum + m.opportunityScore, 0) / markets.length);
  const gradeAB = markets.filter((m) => m.grade === 'A' || m.grade === 'B').length;

  const handleMarketClick = (market: Market) => {
    setSelectedMarket(market);
    setCentreCoords([market.lat, market.lng]);
  };

  const getMarkerColour = (score: number) => {
    if (score >= 80) return '#10b981';
    if (score >= 70) return '#3b82f6';
    if (score >= 60) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KPICard icon={<MapPin className="h-5 w-5 text-teal" />} label="Markets Analysed" value={markets.length.toString()} />
        <KPICard icon={<Award className="h-5 w-5 text-emerald-600" />} label="Top Market" value={topMarket.name} sub={`Score: ${topMarket.opportunityScore}`} />
        <KPICard icon={<BarChart3 className="h-5 w-5 text-blue-600" />} label="Avg Opportunity Score" value={avgScore.toString()} sub="out of 100" />
        <KPICard icon={<TrendingUp className="h-5 w-5 text-amber-600" />} label="Markets Grade A/B" value={gradeAB.toString()} sub={`of ${markets.length} total`} />
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Map */}
        <div className="lg:col-span-3 bg-white rounded-xl border border-card-border shadow-sm overflow-hidden">
          <div className="p-4 border-b border-card-border">
            <h2 className="font-semibold text-navy">US Market Opportunities</h2>
            <p className="text-xs text-gray-400 mt-0.5">Click a marker to view market details</p>
          </div>
          <div className="h-[450px] sm:h-[500px]">
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
                    fillColor: getMarkerColour(market.opportunityScore),
                    color: '#fff',
                    weight: 2,
                    fillOpacity: 0.85,
                  }}
                  eventHandlers={{ click: () => handleMarketClick(market) }}
                >
                  <Popup>
                    <div className="text-sm min-w-[140px]">
                      <p className="font-bold text-navy">{market.name}, {market.state}</p>
                      <p className="text-gray-500">Score: {market.opportunityScore} · Grade {market.grade}</p>
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
            <MarketDetail market={selectedMarket} />
          ) : (
            <div className="bg-white rounded-xl border border-card-border shadow-sm p-8 text-center">
              <MapPin className="h-12 w-12 text-gray-200 mx-auto mb-4" />
              <h3 className="font-medium text-gray-500 mb-1">Select a Market</h3>
              <p className="text-sm text-gray-400">Click a pin on the map to view detailed market analysis</p>
            </div>
          )}
        </div>
      </div>

      {/* Market Rankings Table */}
      <div className="mt-6 bg-white rounded-xl border border-card-border shadow-sm overflow-hidden">
        <div className="p-4 border-b border-card-border">
          <h2 className="font-semibold text-navy">Market Rankings</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
              <tr>
                <th className="px-4 py-3 text-left">#</th>
                <th className="px-4 py-3 text-left">Market</th>
                <th className="px-4 py-3 text-center">Score</th>
                <th className="px-4 py-3 text-center">Grade</th>
                <th className="px-4 py-3 text-right hidden sm:table-cell">Businesses Needing Services</th>
                <th className="px-4 py-3 text-right hidden md:table-cell">Avg Digital Spend</th>
                <th className="px-4 py-3 text-center hidden lg:table-cell">Top Verticals</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {[...markets].sort((a, b) => b.opportunityScore - a.opportunityScore).map((m, i) => (
                <tr
                  key={m.id}
                  className={`hover:bg-gray-50 cursor-pointer transition-colors ${selectedMarket?.id === m.id ? 'bg-teal/5' : ''}`}
                  onClick={() => handleMarketClick(m)}
                >
                  <td className="px-4 py-3 font-medium text-gray-400">{i + 1}</td>
                  <td className="px-4 py-3 font-medium text-navy">{m.name}, {m.state}</td>
                  <td className={`px-4 py-3 text-center font-bold ${getScoreColour(m.opportunityScore)}`}>{m.opportunityScore}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold border ${getGradeColour(m.grade)}`}>
                      {m.grade}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right hidden sm:table-cell text-gray-600">{m.businessesNeedingServices.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right hidden md:table-cell text-gray-600">${m.avgDigitalSpend.toLocaleString()}</td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <div className="flex flex-wrap gap-1 justify-center">
                      {m.topVerticals.slice(0, 2).map((v) => (
                        <span key={v} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">{v}</span>
                      ))}
                    </div>
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

function MarketDetail({ market }: { market: Market }) {
  return (
    <div className="bg-white rounded-xl border border-card-border shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b bg-gradient-to-r from-slate-50 to-white">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-bold text-navy">{market.name}, {market.state}</h3>
            <p className="text-sm text-gray-400 flex items-center gap-1">
              <MapPin className="h-3 w-3" /> {market.totalBusinesses.toLocaleString()} total businesses
            </p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1">
              <span className="text-2xl font-bold text-navy">{market.opportunityScore}</span>
              <span className="text-sm text-gray-400">/100</span>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-bold border ${getGradeColour(market.grade)}`}>
              Grade {market.grade}
            </span>
          </div>
        </div>
      </div>

      {/* AI Summary */}
      <div className="p-4 bg-navy text-white">
        <div className="flex items-start gap-3">
          <Lightbulb className="h-5 w-5 mt-0.5 shrink-0 text-yellow-400" />
          <p className="text-sm leading-relaxed text-slate-200">{market.aiSummary}</p>
        </div>
      </div>

      {/* Score Breakdown */}
      <div className="p-4 border-b">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Score Breakdown</h4>
        <div className="space-y-3">
          <ScoreBar icon={<Building2 className="h-4 w-4 text-blue-600" />} label="Business Density" value={market.businessDensity} />
          <ScoreBar icon={<Wifi className="h-4 w-4 text-amber-600" />} label="Digital Maturity Gap" value={market.digitalMaturityGap} />
          <ScoreBar icon={<Users className="h-4 w-4 text-purple-600" />} label="Agency Competition" value={100 - market.agencyCompetition} suffix="(low = better)" />
          <ScoreBar icon={<Sprout className="h-4 w-4 text-emerald-600" />} label="Business Growth Rate" value={market.businessGrowthRate} />
        </div>
      </div>

      {/* Pros/Cons */}
      <div className="grid grid-cols-2 divide-x">
        <div className="p-4">
          <h4 className="text-sm font-semibold text-emerald-700 mb-2 flex items-center gap-1">
            <CheckCircle className="h-4 w-4" /> Strengths
          </h4>
          <ul className="space-y-1">
            {market.pros.map((p, i) => (
              <li key={i} className="text-xs text-gray-600 flex items-start gap-1">
                <span className="text-emerald-500 mt-0.5 shrink-0">•</span> {p}
              </li>
            ))}
          </ul>
        </div>
        <div className="p-4">
          <h4 className="text-sm font-semibold text-red-700 mb-2 flex items-center gap-1">
            <XCircle className="h-4 w-4" /> Concerns
          </h4>
          <ul className="space-y-1">
            {market.cons.map((c, i) => (
              <li key={i} className="text-xs text-gray-600 flex items-start gap-1">
                <span className="text-red-500 mt-0.5 shrink-0">•</span> {c}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Key Stats */}
      <div className="p-4 border-t bg-gray-50">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Key Statistics</h4>
        <div className="grid grid-cols-2 gap-3">
          <div className="text-centre">
            <p className="text-xs text-gray-400">Businesses Needing Services</p>
            <p className="font-bold text-navy">{market.businessesNeedingServices.toLocaleString()}</p>
          </div>
          <div className="text-centre">
            <p className="text-xs text-gray-400">Avg Digital Spend</p>
            <p className="font-bold text-navy">${market.avgDigitalSpend.toLocaleString()}/mo</p>
          </div>
        </div>
      </div>

      {/* Top Verticals */}
      <div className="p-4 border-t">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">Top Verticals</h4>
        <div className="flex flex-wrap gap-2">
          {market.topVerticals.map((v) => (
            <span key={v} className="px-3 py-1 bg-teal/10 text-teal rounded-full text-xs font-medium">{v}</span>
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
        <div className="flex items-center gap-2 text-xs text-gray-600">
          {icon} {label} {suffix && <span className="text-gray-400">{suffix}</span>}
        </div>
        <span className="text-xs font-bold text-gray-700">{value}</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all"
          style={{
            width: `${value}%`,
            backgroundColor: value >= 80 ? '#10b981' : value >= 60 ? '#3b82f6' : value >= 40 ? '#f59e0b' : '#ef4444',
          }}
        />
      </div>
    </div>
  );
}

function KPICard({ icon, label, value, sub }: { icon: React.ReactNode; label: string; value: string; sub?: string }) {
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

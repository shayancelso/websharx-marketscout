import { DollarSign, TrendingUp, BarChart3, Target, ArrowUpRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { adPlans, totalMonthlyBudget } from '../data/adPlans';

const COLOURS = ['#2d6a7a', '#1e3a5f', '#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ef4444', '#ec4899'];

const priorityColours: Record<string, string> = {
  high: 'bg-emerald-100 text-emerald-700',
  medium: 'bg-amber-100 text-amber-700',
  low: 'bg-gray-100 text-gray-600',
};

export function AdFocusPlanner() {
  const totalLeads = adPlans.reduce((s, p) => s + p.estimatedLeads, 0);
  const avgCpl = Math.round(adPlans.reduce((s, p) => s + p.costPerLead, 0) / adPlans.length);
  const topRoi = adPlans.reduce((a, b) => (a.roiProjection > b.roiProjection ? a : b));
  const barData = adPlans.map((p) => ({
    name: p.marketName.split(',')[0],
    leads: p.estimatedLeads,
    cpl: p.costPerLead,
    roi: p.roiProjection,
  }));

  const pieData = adPlans.map((p) => ({
    name: p.marketName.split(',')[0],
    value: p.budgetAllocation,
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KPI icon={<DollarSign className="h-5 w-5 text-teal" />} label="Monthly Budget" value={`$${(totalMonthlyBudget / 1000).toFixed(0)}K`} />
        <KPI icon={<Target className="h-5 w-5 text-emerald-600" />} label="Estimated Leads/Month" value={totalLeads.toString()} />
        <KPI icon={<BarChart3 className="h-5 w-5 text-blue-600" />} label="Avg Cost per Lead" value={`$${avgCpl}`} />
        <KPI icon={<TrendingUp className="h-5 w-5 text-amber-600" />} label="Best ROI Market" value={topRoi.marketName.split(',')[0]} sub={`${topRoi.roiProjection}% projected`} />
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* Budget Allocation Pie */}
        <div className="bg-white rounded-xl border border-card-border shadow-sm p-4">
          <h3 className="font-semibold text-navy mb-4">Budget Allocation by Market</h3>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" outerRadius={100} dataKey="value" label={({ name, value }) => `${name} ${value}%`} labelLine={false}>
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={COLOURS[i % COLOURS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => `${v}%`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Leads Bar Chart */}
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

      {/* ROI Projections */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {adPlans.slice(0, 4).map((plan) => (
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
                <p className="font-medium text-navy">${((totalMonthlyBudget * plan.budgetAllocation) / 100 / 1000).toFixed(1)}K/mo</p>
              </div>
              <div>
                <p className="text-gray-400">CPL</p>
                <p className="font-medium text-navy">${plan.costPerLead}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Channel Recommendations */}
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
              {adPlans.map((plan) =>
                plan.channels.map((ch, i) => (
                  <tr key={`${plan.marketId}-${i}`} className="hover:bg-gray-50">
                    {i === 0 && (
                      <td className="px-4 py-3 font-medium text-navy" rowSpan={plan.channels.length}>
                        {plan.marketName}
                      </td>
                    )}
                    <td className="px-4 py-3 text-gray-600">{ch.channel}</td>
                    <td className="px-4 py-3 text-center text-gray-600">{ch.allocation}%</td>
                    <td className="px-4 py-3 text-center text-gray-600">${ch.estimatedCpl}</td>
                    <td className="px-4 py-3 text-center font-medium text-navy">{ch.estimatedLeads}</td>
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
    </div>
  );
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

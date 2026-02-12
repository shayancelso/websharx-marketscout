import { useState } from 'react';
import { Archive, Send, BarChart3, Mail, Linkedin, Megaphone, Filter, DollarSign, Users, Target, TrendingUp } from 'lucide-react';
import { outreachData, campaignData } from '../data/repository';

const statusColours: Record<string, string> = {
  Sent: 'bg-[#1d1d1f]/6 text-[#86868b]',
  Opened: 'bg-[#0055d4]/10 text-[#0055d4]',
  Replied: 'bg-[#c77800]/10 text-[#c77800]',
  'Meeting Booked': 'bg-[#248a3d]/10 text-[#248a3d]',
  Active: 'bg-[#248a3d]/10 text-[#248a3d]',
  Paused: 'bg-[#c77800]/10 text-[#c77800]',
  Completed: 'bg-[#1d1d1f]/6 text-[#86868b]',
};

const channelIcons: Record<string, React.ReactNode> = {
  LinkedIn: <Linkedin className="h-3.5 w-3.5" />,
  Email: <Mail className="h-3.5 w-3.5" />,
  Ad: <Megaphone className="h-3.5 w-3.5" />,
};

export function Repository() {
  const [tab, setTab] = useState<'outreach' | 'campaigns'>('outreach');
  const [filterMarket, setFilterMarket] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  // Outreach stats
  const totalSent = outreachData.length;
  const opened = outreachData.filter(o => o.status === 'Opened' || o.status === 'Replied' || o.status === 'Meeting Booked').length;
  const replied = outreachData.filter(o => o.status === 'Replied' || o.status === 'Meeting Booked').length;
  const meetings = outreachData.filter(o => o.status === 'Meeting Booked').length;

  // Campaign stats
  const totalBudget = campaignData.reduce((s, c) => s + c.budget, 0);
  const totalLeads = campaignData.reduce((s, c) => s + c.leadsGenerated, 0);
  const avgCPL = Math.round(campaignData.reduce((s, c) => s + c.spendToDate, 0) / totalLeads);

  const allMarkets = [...new Set(outreachData.map(o => o.market))].sort();

  const filteredOutreach = outreachData.filter(o => {
    if (filterMarket && o.market !== filterMarket) return false;
    if (filterStatus && o.status !== filterStatus) return false;
    return true;
  });

  return (
    <div>
      {/* Header */}
      <div className="border-b border-[#1d1d1f]/6">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-teal/8 text-teal flex items-center justify-center">
              <Archive className="h-5 w-5" />
            </div>
            <h1 className="text-2xl font-semibold text-[#1d1d1f] tracking-tight">Repository</h1>
          </div>
          <p className="text-sm text-[#86868b] max-w-2xl">
            Track all outreach activity and advertising campaigns in one place. Monitor engagement, follow-ups, and pipeline progression.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Tab switcher */}
        <div className="flex items-center gap-1 bg-[#1d1d1f]/5 rounded-full p-1 w-fit mb-8">
          <button
            onClick={() => setTab('outreach')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${
              tab === 'outreach' ? 'bg-white text-[#1d1d1f] shadow-sm shadow-black/8' : 'text-[#86868b] hover:text-[#1d1d1f]'
            }`}
          >
            <Send className="h-4 w-4" /> Outreach
          </button>
          <button
            onClick={() => setTab('campaigns')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${
              tab === 'campaigns' ? 'bg-white text-[#1d1d1f] shadow-sm shadow-black/8' : 'text-[#86868b] hover:text-[#1d1d1f]'
            }`}
          >
            <BarChart3 className="h-4 w-4" /> Campaigns
          </button>
        </div>

        {tab === 'outreach' ? (
          <>
            {/* Outreach KPIs */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <StatCard icon={<Send className="h-5 w-5" />} iconColour="text-teal" label="Total Sent" value={totalSent.toString()} />
              <StatCard icon={<Mail className="h-5 w-5" />} iconColour="text-[#0055d4]" label="Open Rate" value={`${Math.round((opened / totalSent) * 100)}%`} />
              <StatCard icon={<Users className="h-5 w-5" />} iconColour="text-[#c77800]" label="Reply Rate" value={`${Math.round((replied / totalSent) * 100)}%`} />
              <StatCard icon={<Target className="h-5 w-5" />} iconColour="text-[#248a3d]" label="Meetings Booked" value={meetings.toString()} />
            </div>

            {/* Filters */}
            <div className="glass-card-static mb-6">
              <div className="p-4 flex flex-wrap gap-3 items-center">
                <Filter className="h-4 w-4 text-[#86868b]" />
                <select value={filterMarket} onChange={e => setFilterMarket(e.target.value)} className="px-4 py-2 bg-[#1d1d1f]/4 border-none rounded-full text-sm outline-none text-[#1d1d1f]">
                  <option value="">All Markets</option>
                  {allMarkets.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
                <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="px-4 py-2 bg-[#1d1d1f]/4 border-none rounded-full text-sm outline-none text-[#1d1d1f]">
                  <option value="">All Statuses</option>
                  <option value="Sent">Sent</option>
                  <option value="Opened">Opened</option>
                  <option value="Replied">Replied</option>
                  <option value="Meeting Booked">Meeting Booked</option>
                </select>
                {(filterMarket || filterStatus) && (
                  <button onClick={() => { setFilterMarket(''); setFilterStatus(''); }} className="text-sm text-[#86868b] hover:text-[#1d1d1f] transition-colors">Clear</button>
                )}
              </div>
            </div>

            {/* Outreach Table */}
            <div className="glass-card-static overflow-hidden">
              <div className="p-5 border-b border-[#1d1d1f]/6">
                <h2 className="font-semibold text-[#1d1d1f]">Outreach History</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm glass-table">
                  <thead>
                    <tr>
                      <th className="px-5 py-3.5 text-left">Prospect</th>
                      <th className="px-5 py-3.5 text-left hidden sm:table-cell">Market</th>
                      <th className="px-5 py-3.5 text-left hidden md:table-cell">Date</th>
                      <th className="px-5 py-3.5 text-center">Channel</th>
                      <th className="px-5 py-3.5 text-left hidden lg:table-cell">Message Preview</th>
                      <th className="px-5 py-3.5 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOutreach.map(o => (
                      <tr key={o.id}>
                        <td className="px-5 py-3.5">
                          <p className="font-medium text-[#1d1d1f]">{o.prospectName}</p>
                          <p className="text-xs text-[#86868b] sm:hidden">{o.market} · {o.dateSent}</p>
                        </td>
                        <td className="px-5 py-3.5 text-[#86868b] hidden sm:table-cell">{o.market}</td>
                        <td className="px-5 py-3.5 text-[#86868b] hidden md:table-cell">{o.dateSent}</td>
                        <td className="px-5 py-3.5 text-center">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#1d1d1f]/4 text-[#86868b] text-xs font-medium">
                            {channelIcons[o.channel]} {o.channel}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-[#86868b] hidden lg:table-cell">
                          <p className="truncate max-w-xs">{o.messagePreview}</p>
                        </td>
                        <td className="px-5 py-3.5 text-center">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColours[o.status]}`}>{o.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Campaign KPIs */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              <StatCard icon={<DollarSign className="h-5 w-5" />} iconColour="text-teal" label="Total Budget" value={`$${(totalBudget / 1000).toFixed(1)}K`} />
              <StatCard icon={<TrendingUp className="h-5 w-5" />} iconColour="text-[#248a3d]" label="Total Leads" value={totalLeads.toString()} />
              <StatCard icon={<BarChart3 className="h-5 w-5" />} iconColour="text-[#0055d4]" label="Avg CPL" value={`$${avgCPL}`} />
            </div>

            {/* Campaign Cards */}
            <div className="grid gap-4">
              {campaignData.map(c => (
                <div key={c.id} className="glass-card-static p-6">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-[#1d1d1f]">{c.campaignName}</h3>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColours[c.status]}`}>{c.status}</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {c.marketsTargeted.map(m => (
                          <span key={m} className="pill-badge">{m}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div>
                      <p className="text-xs text-[#86868b]">Budget</p>
                      <p className="text-lg font-light text-[#1d1d1f]">${c.budget.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-[#86868b]">Spend to Date</p>
                      <p className="text-lg font-light text-[#1d1d1f]">${c.spendToDate.toLocaleString()}</p>
                      <div className="mt-1 h-1.5 bg-[#1d1d1f]/6 rounded-full overflow-hidden">
                        <div className="h-full bg-teal rounded-full" style={{ width: `${Math.min(100, (c.spendToDate / c.budget) * 100)}%` }} />
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-[#86868b]">Leads Generated</p>
                      <p className="text-lg font-light text-[#1d1d1f]">{c.leadsGenerated}</p>
                    </div>
                    <div>
                      <p className="text-xs text-[#86868b]">Cost per Lead</p>
                      <p className="text-lg font-light text-[#1d1d1f]">${c.costPerLead}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon, iconColour, label, value }: { icon: React.ReactNode; iconColour: string; label: string; value: string }) {
  return (
    <div className="glass-card-static p-5 relative overflow-hidden">
      <div className={`absolute -right-2 -top-2 opacity-[0.04] ${iconColour}`} style={{ transform: 'scale(3)' }}>
        {icon}
      </div>
      <div className="relative">
        <div className={`w-9 h-9 rounded-xl bg-[#1d1d1f]/4 flex items-center justify-center mb-3 ${iconColour}`}>
          {icon}
        </div>
        <p className="text-xs text-[#86868b]">{label}</p>
        <p className="text-2xl font-light text-[#1d1d1f]">{value}</p>
      </div>
    </div>
  );
}

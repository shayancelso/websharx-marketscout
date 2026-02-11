import { Map, Users, Target, ArrowRight, Sparkles } from 'lucide-react';

interface HomePageProps {
  onNavigate: (page: string) => void;
}

const phases = [
  {
    id: 'phase-1',
    number: 1,
    title: 'Scout Markets',
    description: 'Identify the highest-opportunity US markets using AI-powered analysis of business density, digital maturity gaps, competition, and growth potential.',
    icon: <Map className="h-7 w-7" />,
    output: 'Selected markets →',
  },
  {
    id: 'phase-2',
    number: 2,
    title: 'Find Prospects',
    description: 'Discover businesses in your selected markets that match the ideal client profile. AI scores each prospect on digital gaps and service fit.',
    icon: <Users className="h-7 w-7" />,
    output: 'Selected prospects →',
  },
  {
    id: 'phase-3',
    number: 3,
    title: 'Plan Campaign',
    description: 'Allocate advertising budget across markets and generate personalised outreach for selected prospects with AI-drafted emails.',
    icon: <Target className="h-7 w-7" />,
    output: 'Campaign ready ✓',
  },
];

export function HomePage({ onNavigate }: HomePageProps) {
  return (
    <div>
      {/* Hero — Clean, light, no dark navy block */}
      <div className="pt-16 pb-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <img src="/websharx-logo.png" alt="Web Sharx" className="h-10 mx-auto mb-6 opacity-80" />
          <h1 className="text-4xl sm:text-5xl font-semibold text-[#1d1d1f] mb-4 tracking-tight">
            MarketScout
          </h1>
          <p className="text-lg text-[#86868b] max-w-2xl mx-auto mb-8 leading-relaxed font-light">
            Your intelligent, AI-powered market intelligence pipeline for US expansion. Three phases, one guided workflow.
          </p>
          <div className="flex items-center justify-center gap-3 text-sm text-[#86868b] mb-10">
            <span className="pill-badge">1. Scout Markets</span>
            <ArrowRight className="h-3.5 w-3.5 text-[#86868b]/50" />
            <span className="pill-badge">2. Find Prospects</span>
            <ArrowRight className="h-3.5 w-3.5 text-[#86868b]/50" />
            <span className="pill-badge">3. Plan Campaign</span>
          </div>
          <button
            onClick={() => onNavigate('phase-1')}
            className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-[#1d1d1f] text-white rounded-full font-medium text-sm hover:bg-[#1d1d1f]/85 transition-all duration-300 shadow-lg shadow-black/10"
          >
            Start Phase 1 <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Phase Cards */}
      <div className="max-w-5xl mx-auto px-4 -mt-8 pb-16">
        <div className="grid md:grid-cols-3 gap-6">
          {phases.map((phase) => (
            <button
              key={phase.id}
              onClick={() => onNavigate(phase.id)}
              className="glass-card p-7 text-left group relative"
            >
              {/* AI badge — subtle */}
              <div className="absolute top-5 right-5 flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#1d1d1f]/4 text-[#86868b] text-[10px] font-medium">
                <Sparkles className="h-2.5 w-2.5" /> AI
              </div>

              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-8 rounded-full bg-teal/8 text-teal flex items-center justify-center text-sm font-semibold shrink-0">
                  {phase.number}
                </span>
                <div className="w-12 h-12 rounded-2xl bg-teal/8 text-teal flex items-center justify-center group-hover:bg-teal group-hover:text-white transition-all duration-300">
                  {phase.icon}
                </div>
              </div>
              <h3 className="font-semibold text-[#1d1d1f] text-lg mb-2">{phase.title}</h3>
              <p className="text-sm text-[#86868b] mb-4 leading-relaxed">{phase.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#86868b]/60">{phase.output}</span>
                <span className="inline-flex items-center gap-1 text-sm font-medium text-teal group-hover:gap-2 transition-all duration-300">
                  Open <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

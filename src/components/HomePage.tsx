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
    icon: <Map className="h-8 w-8" />,
    output: 'Selected markets →',
  },
  {
    id: 'phase-2',
    number: 2,
    title: 'Find Prospects',
    description: 'Discover businesses in your selected markets that match the ideal client profile. AI scores each prospect on digital gaps and service fit.',
    icon: <Users className="h-8 w-8" />,
    output: 'Selected prospects →',
  },
  {
    id: 'phase-3',
    number: 3,
    title: 'Plan Campaign',
    description: 'Allocate advertising budget across markets and generate personalised outreach for selected prospects with AI-drafted emails.',
    icon: <Target className="h-8 w-8" />,
    output: 'Campaign ready ✓',
  },
];

export function HomePage({ onNavigate }: HomePageProps) {
  return (
    <div>
      {/* Hero */}
      <div className="bg-gradient-to-br from-navy via-[#244b6e] to-teal text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <img src="/websharx-logo.png" alt="Web Sharx" className="h-10 mx-auto mb-4" />
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">MarketScout</h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto mb-6">
            Your intelligent, AI-powered market intelligence pipeline for US expansion. Three phases, one guided workflow.
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-white/60 mb-6">
            <span className="px-3 py-1.5 bg-white/10 rounded-lg font-medium text-white/80">1. Scout Markets</span>
            <ArrowRight className="h-4 w-4" />
            <span className="px-3 py-1.5 bg-white/10 rounded-lg font-medium text-white/80">2. Find Prospects</span>
            <ArrowRight className="h-4 w-4" />
            <span className="px-3 py-1.5 bg-white/10 rounded-lg font-medium text-white/80">3. Plan Campaign</span>
          </div>
          <button
            onClick={() => onNavigate('phase-1')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-navy rounded-xl font-medium hover:bg-white/90 transition-colors shadow-lg"
          >
            Start Phase 1 <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Phase Cards */}
      <div className="max-w-5xl mx-auto px-4 -mt-8 pb-12">
        <div className="grid md:grid-cols-3 gap-6">
          {phases.map((phase) => (
            <button
              key={phase.id}
              onClick={() => onNavigate(phase.id)}
              className="bg-white rounded-xl border border-card-border shadow-sm p-6 text-left hover:shadow-md hover:border-teal/30 transition-all group relative"
            >
              <div className="absolute top-4 right-4 flex items-center gap-1 px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 text-[10px] font-medium">
                <Sparkles className="h-3 w-3" /> AI-Powered
              </div>
              <div className="flex items-center gap-3 mb-3">
                <span className="w-8 h-8 rounded-full bg-teal/10 text-teal flex items-center justify-center text-sm font-bold shrink-0">
                  {phase.number}
                </span>
                <div className="w-12 h-12 rounded-xl bg-teal/10 text-teal flex items-center justify-center group-hover:bg-teal group-hover:text-white transition-colors">
                  {phase.icon}
                </div>
              </div>
              <h3 className="font-semibold text-navy text-lg mb-2">{phase.title}</h3>
              <p className="text-sm text-gray-500 mb-3 leading-relaxed">{phase.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">{phase.output}</span>
                <span className="inline-flex items-center gap-1 text-sm font-medium text-teal group-hover:gap-2 transition-all">
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

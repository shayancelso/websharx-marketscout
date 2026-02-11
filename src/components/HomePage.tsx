import { Map, Users, Target, ArrowRight } from 'lucide-react';

interface HomePageProps {
  onNavigate: (page: 'market-scout' | 'prospects' | 'ad-planner') => void;
}

const modules = [
  {
    id: 'market-scout' as const,
    title: 'Market Scout',
    description: 'Identify the highest-opportunity US markets for Web Sharx expansion. Interactive map with opportunity scores, digital maturity gaps, and AI-powered market summaries.',
    icon: <Map className="h-8 w-8" />,
  },
  {
    id: 'prospects' as const,
    title: 'Prospect Generator',
    description: 'Discover businesses that match the British Swim School ideal client profile. Scored and ranked prospects with digital gap analysis and service recommendations.',
    icon: <Users className="h-8 w-8" />,
  },
  {
    id: 'ad-planner' as const,
    title: 'Ad Focus Planner',
    description: 'Optimise advertising spend across top markets. Budget allocation, cost-per-lead estimates, channel recommendations, and ROI projections.',
    icon: <Target className="h-8 w-8" />,
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
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            Your intelligent market intelligence platform for US expansion. Discover where to advertise, who to target, and how to maximise your return on investment.
          </p>
        </div>
      </div>

      {/* Module Cards */}
      <div className="max-w-5xl mx-auto px-4 -mt-8 pb-12">
        <div className="grid md:grid-cols-3 gap-6">
          {modules.map((mod) => (
            <button
              key={mod.id}
              onClick={() => onNavigate(mod.id)}
              className="bg-white rounded-xl border border-card-border shadow-sm p-6 text-left hover:shadow-md hover:border-teal/30 transition-all group"
            >
              <div className="w-14 h-14 rounded-xl bg-teal/10 text-teal flex items-center justify-center mb-4 group-hover:bg-teal group-hover:text-white transition-colors">
                {mod.icon}
              </div>
              <h3 className="font-semibold text-navy text-lg mb-2">{mod.title}</h3>
              <p className="text-sm text-gray-500 mb-4 leading-relaxed">{mod.description}</p>
              <span className="inline-flex items-center gap-1 text-sm font-medium text-teal group-hover:gap-2 transition-all">
                Open <ArrowRight className="h-4 w-4" />
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

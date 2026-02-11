import { X, Map, Users, Target, Home } from 'lucide-react';

const pageInfo: Record<string, { title: string; icon: React.ReactNode; steps: string[] }> = {
  home: {
    title: 'Home',
    icon: <Home className="h-6 w-6 text-teal" />,
    steps: [
      'MarketScout is your intelligent market intelligence platform for US expansion.',
      'Navigate between three modules using the top navigation bar.',
      'Each module provides actionable insights for market entry strategy.',
      'All data shown is simulated for demonstration purposes.',
    ],
  },
  'market-scout': {
    title: 'Market Scout',
    icon: <Map className="h-6 w-6 text-teal" />,
    steps: [
      'The interactive map displays US metro areas sized and coloured by opportunity score.',
      'Click any marker to view detailed market analysis including AI-powered insights.',
      'Scores are based on business density, digital maturity gap, agency competition, and growth rate.',
      'The rankings table below the map allows quick comparison across all markets.',
      'Grade A markets are recommended for immediate entry; Grade B for secondary focus.',
    ],
  },
  prospects: {
    title: 'Prospect Generator',
    icon: <Users className="h-6 w-6 text-teal" />,
    steps: [
      'Prospects are scored against the British Swim School "ideal client" benchmark.',
      'Higher match scores indicate businesses most similar to your best client profile.',
      'Lower digital scores indicate more opportunity — these businesses need the most help.',
      'Use filters to narrow by industry, location, or minimum match score.',
      'Click any prospect for detailed digital gap analysis and service recommendations.',
    ],
  },
  'ad-planner': {
    title: 'Ad Focus Planner',
    icon: <Target className="h-6 w-6 text-teal" />,
    steps: [
      'Budget allocation is optimised based on market opportunity scores and cost efficiency.',
      'Cost per lead estimates vary by market competition and channel.',
      'ROI projections factor in average project values and conversion rates per market.',
      'Channel recommendations prioritise the most effective platforms for each market.',
      'Adjust total budget to see how allocation shifts across markets.',
    ],
  },
};

export function HowItWorks({ page, onClose }: { page: string; onClose: () => void }) {
  const info = pageInfo[page] || pageInfo.home;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-3">
            {info.icon}
            <h2 className="font-bold text-navy">How It Works — {info.title}</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-6">
          <ol className="space-y-4">
            {info.steps.map((step, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-teal/10 text-teal text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <p className="text-sm text-gray-600 leading-relaxed">{step}</p>
              </li>
            ))}
          </ol>
        </div>
        <div className="px-6 pb-6">
          <button
            onClick={onClose}
            className="w-full px-4 py-2.5 bg-teal text-white rounded-lg text-sm font-medium hover:bg-teal-light transition-colors"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
}

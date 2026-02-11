import { X, Map, Users, Target, Home, ArrowRight } from 'lucide-react';

const pageInfo: Record<string, { title: string; icon: React.ReactNode; steps: string[] }> = {
  home: {
    title: 'How MarketScout Works',
    icon: <Home className="h-6 w-6 text-teal" />,
    steps: [
      'MarketScout is a guided 3-phase pipeline for US market expansion.',
      'Phase 1: Scout Markets — Select target US markets based on AI-scored opportunity analysis.',
      'Phase 2: Find Prospects — Discover matching businesses in your selected markets.',
      'Phase 3: Plan Campaign — Allocate ad spend and generate personalised outreach.',
      'Each phase feeds into the next. Selections carry forward through the pipeline.',
      'All data shown is simulated for demonstration purposes.',
    ],
  },
  'phase-1': {
    title: 'Phase 1: Market Scout',
    icon: <Map className="h-6 w-6 text-teal" />,
    steps: [
      'The interactive map displays US metro areas sized and coloured by AI-generated opportunity score.',
      'Scores are based on business density, digital maturity gap, agency competition, and growth rate.',
      'Click any marker to view detailed market analysis including AI-powered insights.',
      'Use "Add to Plan" to select markets — these carry forward to Phase 2 and Phase 3.',
      'The rankings table allows quick comparison. Grade A markets are recommended for immediate entry.',
    ],
  },
  'phase-2': {
    title: 'Phase 2: Prospect Generator',
    icon: <Users className="h-6 w-6 text-teal" />,
    steps: [
      'Only shows prospects within markets you selected in Phase 1.',
      'Prospects are scored against the British Swim School "ideal client" benchmark using AI.',
      'Lower digital scores = more opportunity (these businesses need the most help).',
      'Use filters to narrow by industry or minimum match score.',
      'Select prospects for outreach — these carry forward to Phase 3\'s direct outreach section.',
    ],
  },
  'phase-3': {
    title: 'Phase 3: Campaign Planner',
    icon: <Target className="h-6 w-6 text-teal" />,
    steps: [
      '3A: Ad Spend — Enter your monthly budget and AI allocates across selected markets.',
      'Allocation is based on opportunity scores, estimated CPL, and channel effectiveness.',
      'Adjust the budget to see projected leads and ROI change dynamically.',
      '3B: Direct Outreach — AI generates personalised emails for each selected prospect.',
      'Outreach messages highlight specific digital gaps and recommend relevant services.',
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
            <h2 className="font-bold text-navy">{info.title}</h2>
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

          {/* Pipeline reminder */}
          <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-center gap-2 text-xs text-gray-400">
            <span className="px-2 py-1 bg-teal/10 text-teal rounded font-medium">1. Scout</span>
            <ArrowRight className="h-3 w-3" />
            <span className="px-2 py-1 bg-teal/10 text-teal rounded font-medium">2. Prospects</span>
            <ArrowRight className="h-3 w-3" />
            <span className="px-2 py-1 bg-teal/10 text-teal rounded font-medium">3. Campaign</span>
          </div>
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

import { useState } from 'react';
import { Map, Users, Target, ArrowRight, X } from 'lucide-react';

interface WelcomeModalProps {
  onClose: () => void;
  onStart: () => void;
}

const steps = [
  {
    icon: <img src="/websharx-logo-colour.png" alt="Web Sharx" className="h-10" />,
    title: 'Welcome to MarketScout',
    description: 'A guided 3-phase pipeline for Web Sharx\'s US expansion. Each phase feeds into the next — select markets, find prospects, then plan your campaign.',
  },
  {
    icon: <Map className="h-10 w-10 text-teal" />,
    title: 'Phase 1: Scout Markets',
    description: 'Explore an interactive map of US markets scored by AI on business density, digital maturity gaps, and competition. Select your target markets to carry forward.',
  },
  {
    icon: <Users className="h-10 w-10 text-teal" />,
    title: 'Phase 2: Find Prospects',
    description: 'In your selected markets, discover businesses matching your ideal client profile (British Swim School). AI analyses their digital gaps and recommends services.',
  },
  {
    icon: <Target className="h-10 w-10 text-teal" />,
    title: 'Phase 3: Plan Campaign',
    description: 'Allocate your ad budget across markets and get AI-generated outreach emails personalised to each prospect\'s specific digital gaps.',
  },
];

export function WelcomeModal({ onClose, onStart }: WelcomeModalProps) {
  const [step, setStep] = useState(0);
  const current = steps[step];
  const isLast = step === steps.length - 1;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/20 backdrop-blur-sm p-4">
      <div className="glass-card-static max-w-md w-full overflow-hidden relative" style={{ background: 'rgba(255,255,255,0.88)' }}>
        <button onClick={onClose} className="absolute top-4 right-4 text-[#86868b] hover:text-[#1d1d1f] z-10 transition-colors">
          <X className="h-5 w-5" />
        </button>
        <div className="p-8 pt-10 text-center">
          <div className="w-20 h-20 rounded-3xl bg-teal/8 flex items-center justify-center mx-auto mb-5">
            {current.icon}
          </div>
          <h2 className="text-xl font-semibold text-[#1d1d1f] mb-2">{current.title}</h2>
          <p className="text-sm text-[#86868b] leading-relaxed">{current.description}</p>
        </div>

        {/* Pipeline visual on step 0 */}
        {step === 0 && (
          <div className="px-6 pb-2">
            <div className="flex items-center justify-center gap-2 text-xs text-[#86868b]">
              <span className="pill-badge">1. Scout</span>
              <ArrowRight className="h-3 w-3 opacity-40" />
              <span className="pill-badge">2. Prospects</span>
              <ArrowRight className="h-3 w-3 opacity-40" />
              <span className="pill-badge">3. Campaign</span>
            </div>
          </div>
        )}

        {/* Progress dots */}
        <div className="flex justify-center gap-2 py-5">
          {steps.map((_, i) => (
            <div key={i} className={`w-2 h-2 rounded-full transition-all duration-300 ${i === step ? 'bg-[#1d1d1f] w-6' : 'bg-[#1d1d1f]/15'}`} />
          ))}
        </div>

        <div className="px-6 pb-6 flex gap-3">
          {step > 0 && (
            <button
              onClick={() => setStep(step - 1)}
              className="px-5 py-2.5 rounded-full border border-[#1d1d1f]/10 text-[#1d1d1f] text-sm font-medium hover:bg-[#1d1d1f]/4 transition-colors"
            >
              Back
            </button>
          )}
          <button
            onClick={isLast ? onStart : () => setStep(step + 1)}
            className="flex-1 px-5 py-2.5 bg-[#1d1d1f] text-white rounded-full text-sm font-medium hover:bg-[#1d1d1f]/85 transition-colors flex items-center justify-center gap-2"
          >
            {isLast ? 'Start Scouting' : 'Next'} <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

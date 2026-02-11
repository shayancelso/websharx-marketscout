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
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10">
          <X className="h-5 w-5" />
        </button>
        <div className="p-6 pt-8 text-center">
          <div className="w-20 h-20 rounded-2xl bg-teal/10 flex items-center justify-center mx-auto mb-4">
            {current.icon}
          </div>
          <h2 className="text-xl font-bold text-navy mb-2">{current.title}</h2>
          <p className="text-sm text-gray-500 leading-relaxed">{current.description}</p>
        </div>

        {/* Pipeline visual on step 0 */}
        {step === 0 && (
          <div className="px-6 pb-2">
            <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
              <span className="px-2 py-1 bg-teal/10 text-teal rounded font-medium">1. Scout</span>
              <ArrowRight className="h-3 w-3" />
              <span className="px-2 py-1 bg-teal/10 text-teal rounded font-medium">2. Prospects</span>
              <ArrowRight className="h-3 w-3" />
              <span className="px-2 py-1 bg-teal/10 text-teal rounded font-medium">3. Campaign</span>
            </div>
          </div>
        )}

        {/* Progress */}
        <div className="flex justify-center gap-2 py-4">
          {steps.map((_, i) => (
            <div key={i} className={`w-2 h-2 rounded-full transition-colors ${i === step ? 'bg-teal' : 'bg-gray-200'}`} />
          ))}
        </div>

        <div className="px-6 pb-6 flex gap-3">
          {step > 0 && (
            <button
              onClick={() => setStep(step - 1)}
              className="px-4 py-2.5 border border-gray-200 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              Back
            </button>
          )}
          <button
            onClick={isLast ? onStart : () => setStep(step + 1)}
            className="flex-1 px-4 py-2.5 bg-teal text-white rounded-lg text-sm font-medium hover:bg-teal-light transition-colors flex items-center justify-center gap-2"
          >
            {isLast ? 'Start Scouting' : 'Next'} <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { Map, Users, Target, Diamond, ArrowRight, X } from 'lucide-react';

interface WelcomeModalProps {
  onClose: () => void;
  onNavigate: (page: 'market-scout' | 'prospects' | 'ad-planner') => void;
}

const steps = [
  {
    icon: <Diamond className="h-10 w-10 text-teal" />,
    title: 'Welcome to MarketScout',
    description: 'Your intelligent market intelligence platform for Web Sharx\'s US expansion. Discover where to advertise, who to target, and how to maximise ROI.',
  },
  {
    icon: <Map className="h-10 w-10 text-teal" />,
    title: 'Market Scout',
    description: 'Explore an interactive map of US markets scored by opportunity. See business density, digital maturity gaps, agency competition, and AI-powered insights for each metro.',
    navigateTo: 'market-scout' as const,
  },
  {
    icon: <Users className="h-10 w-10 text-teal" />,
    title: 'Prospect Generator',
    description: 'Find businesses that match your ideal client profile (based on British Swim School). Filter by industry, location, and match score to build your pipeline.',
    navigateTo: 'prospects' as const,
  },
  {
    icon: <Target className="h-10 w-10 text-teal" />,
    title: 'Ad Focus Planner',
    description: 'Optimise your advertising budget across top markets. Get cost-per-lead estimates, channel recommendations, and ROI projections for data-driven decisions.',
    navigateTo: 'ad-planner' as const,
  },
];

export function WelcomeModal({ onClose, onNavigate }: WelcomeModalProps) {
  const [step, setStep] = useState(0);
  const current = steps[step];

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      onClose();
    }
  };

  const handleExplore = () => {
    if (current.navigateTo) {
      onNavigate(current.navigateTo);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
        <div className="p-6 text-center">
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
          <div className="w-20 h-20 rounded-2xl bg-teal/10 flex items-center justify-center mx-auto mb-4">
            {current.icon}
          </div>
          <h2 className="text-xl font-bold text-navy mb-2">{current.title}</h2>
          <p className="text-sm text-gray-500 leading-relaxed">{current.description}</p>
        </div>

        {/* Progress */}
        <div className="flex justify-center gap-2 pb-4">
          {steps.map((_, i) => (
            <div key={i} className={`w-2 h-2 rounded-full transition-colors ${i === step ? 'bg-teal' : 'bg-gray-200'}`} />
          ))}
        </div>

        <div className="px-6 pb-6 flex gap-3">
          {current.navigateTo && (
            <button
              onClick={handleExplore}
              className="flex-1 px-4 py-2.5 border border-teal text-teal rounded-lg text-sm font-medium hover:bg-teal/5 transition-colors"
            >
              Explore Now
            </button>
          )}
          <button
            onClick={handleNext}
            className="flex-1 px-4 py-2.5 bg-teal text-white rounded-lg text-sm font-medium hover:bg-teal-light transition-colors flex items-center justify-center gap-2"
          >
            {step < steps.length - 1 ? 'Next' : 'Get Started'} <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

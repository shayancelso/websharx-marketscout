import { Map, Users, Target, ChevronRight } from 'lucide-react';

interface PhaseStepperProps {
  currentPhase: string;
  onNavigate: (page: string) => void;
  marketCount: number;
  prospectCount: number;
  selectedProspectCount: number;
}

const phases = [
  { id: 'phase-1', label: 'Scout Markets', icon: <Map className="h-4 w-4" />, number: 1 },
  { id: 'phase-2', label: 'Find Prospects', icon: <Users className="h-4 w-4" />, number: 2 },
  { id: 'phase-3', label: 'Plan Campaign', icon: <Target className="h-4 w-4" />, number: 3 },
];

export function PhaseStepper({ currentPhase, onNavigate, marketCount, prospectCount, selectedProspectCount }: PhaseStepperProps) {
  const getBadge = (id: string) => {
    switch (id) {
      case 'phase-1':
        return marketCount > 0 ? `${marketCount} selected` : null;
      case 'phase-2':
        return prospectCount > 0 ? `${prospectCount} found` : null;
      case 'phase-3':
        return selectedProspectCount > 0 ? 'Ready' : null;
      default:
        return null;
    }
  };

  const getStepState = (id: string) => {
    const order = ['phase-1', 'phase-2', 'phase-3'];
    const currentIdx = order.indexOf(currentPhase);
    const stepIdx = order.indexOf(id);
    if (id === currentPhase) return 'active';
    if (stepIdx < currentIdx) return 'completed';
    return 'upcoming';
  };

  return (
    <div className="border-t border-card-border bg-gray-50/80">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-center py-2.5 gap-1 sm:gap-2 overflow-x-auto">
          {phases.map((phase, i) => {
            const state = getStepState(phase.id);
            const badge = getBadge(phase.id);
            return (
              <div key={phase.id} className="flex items-center gap-1 sm:gap-2 shrink-0">
                {i > 0 && <ChevronRight className="h-4 w-4 text-gray-300 shrink-0" />}
                <button
                  onClick={() => onNavigate(phase.id)}
                  className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                    state === 'active'
                      ? 'bg-teal text-white shadow-sm'
                      : state === 'completed'
                      ? 'bg-teal/10 text-teal hover:bg-teal/20'
                      : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                    state === 'active'
                      ? 'bg-white/20 text-white'
                      : state === 'completed'
                      ? 'bg-teal/20 text-teal'
                      : 'bg-gray-200 text-gray-400'
                  }`}>
                    {phase.number}
                  </span>
                  <span className="hidden sm:inline">{phase.label}</span>
                  {badge && (
                    <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                      state === 'active'
                        ? 'bg-white/20 text-white'
                        : 'bg-teal/10 text-teal'
                    }`}>
                      {badge}
                    </span>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

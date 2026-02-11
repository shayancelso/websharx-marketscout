import { Map, Users, Target } from 'lucide-react';

interface PhaseStepperProps {
  currentPhase: string;
  onNavigate: (page: string) => void;
  marketCount: number;
  prospectCount: number;
  selectedProspectCount: number;
}

const phases = [
  { id: 'phase-1', label: 'Scout Markets', icon: <Map className="h-3.5 w-3.5" />, number: 1 },
  { id: 'phase-2', label: 'Find Prospects', icon: <Users className="h-3.5 w-3.5" />, number: 2 },
  { id: 'phase-3', label: 'Plan Campaign', icon: <Target className="h-3.5 w-3.5" />, number: 3 },
];

export function PhaseStepper({ currentPhase, onNavigate, marketCount, prospectCount, selectedProspectCount }: PhaseStepperProps) {
  const getBadge = (id: string) => {
    switch (id) {
      case 'phase-1':
        return marketCount > 0 ? `${marketCount}` : null;
      case 'phase-2':
        return prospectCount > 0 ? `${prospectCount}` : null;
      case 'phase-3':
        return selectedProspectCount > 0 ? '✓' : null;
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
    <div className="border-t border-[#1d1d1f]/6">
      <div className="max-w-7xl mx-auto px-4">
        {/* iOS-style segmented control */}
        <div className="flex items-center justify-center py-3">
          <div className="inline-flex items-center bg-[#1d1d1f]/5 rounded-full p-1 gap-0.5">
            {phases.map((phase) => {
              const state = getStepState(phase.id);
              const badge = getBadge(phase.id);
              return (
                <button
                  key={phase.id}
                  onClick={() => onNavigate(phase.id)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 ${
                    state === 'active'
                      ? 'bg-white text-[#1d1d1f] shadow-sm shadow-black/8'
                      : state === 'completed'
                      ? 'text-teal hover:bg-white/50'
                      : 'text-[#86868b] hover:text-[#1d1d1f]'
                  }`}
                >
                  {phase.icon}
                  <span className="hidden sm:inline">{phase.label}</span>
                  <span className="sm:hidden">{phase.number}</span>
                  {badge && (
                    <span className={`min-w-[18px] h-[18px] flex items-center justify-center rounded-full text-[10px] font-bold ${
                      state === 'active'
                        ? 'bg-teal/12 text-teal'
                        : 'bg-teal/10 text-teal'
                    }`}>
                      {badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

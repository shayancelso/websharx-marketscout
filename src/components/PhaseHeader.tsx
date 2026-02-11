import { ArrowRight } from 'lucide-react';

interface PhaseHeaderProps {
  phase: number;
  title: string;
  description: string;
  connection?: string;
  inputNote?: string;
  outputNote?: string;
  children?: React.ReactNode;
}

export function PhaseHeader({ phase, title, description, connection, inputNote, outputNote, children }: PhaseHeaderProps) {
  return (
    <div className="glass-nav">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2.5 mb-2">
              <span className="px-3 py-1 rounded-full bg-[#1d1d1f]/6 text-[#1d1d1f] text-xs font-semibold backdrop-blur-sm">
                Phase {phase}
              </span>
              {children}
            </div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-[#1d1d1f] mb-1.5 tracking-tight">{title}</h1>
            <p className="text-sm text-[#86868b] leading-relaxed max-w-2xl">{description}</p>
            {connection && (
              <p className="text-xs text-[#86868b]/70 mt-2">{connection}</p>
            )}
          </div>
          {(inputNote || outputNote) && (
            <div className="flex flex-col gap-2 sm:text-right shrink-0">
              {inputNote && (
                <span className="text-xs text-[#86868b] flex items-center sm:justify-end gap-1.5">
                  <ArrowRight className="h-3 w-3 rotate-180 text-teal/60" /> {inputNote}
                </span>
              )}
              {outputNote && (
                <span className="text-xs text-[#86868b] flex items-center sm:justify-end gap-1.5">
                  <ArrowRight className="h-3 w-3 text-teal/60" /> {outputNote}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

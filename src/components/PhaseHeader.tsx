import { ArrowRight } from 'lucide-react';

interface PhaseHeaderProps {
  phase: number;
  title: string;
  description: string;
  connection?: string;
  inputNote?: string;
  outputNote?: string;
  children?: React.ReactNode; // for AI badges
}

export function PhaseHeader({ phase, title, description, connection, inputNote, outputNote, children }: PhaseHeaderProps) {
  return (
    <div className="bg-white border-b border-card-border">
      <div className="max-w-7xl mx-auto px-4 py-5">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded-full bg-teal/10 text-teal text-xs font-bold">Phase {phase}</span>
              {children}
            </div>
            <h1 className="text-xl font-bold text-navy mb-1">{title}</h1>
            <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">{description}</p>
            {connection && (
              <p className="text-xs text-gray-400 mt-2 italic">{connection}</p>
            )}
          </div>
          {(inputNote || outputNote) && (
            <div className="flex flex-col gap-1.5 sm:text-right shrink-0">
              {inputNote && (
                <span className="text-xs text-gray-400 flex items-center sm:justify-end gap-1">
                  <ArrowRight className="h-3 w-3 rotate-180 text-teal" /> {inputNote}
                </span>
              )}
              {outputNote && (
                <span className="text-xs text-gray-400 flex items-center sm:justify-end gap-1">
                  <ArrowRight className="h-3 w-3 text-teal" /> {outputNote}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

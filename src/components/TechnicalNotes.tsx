import { useState } from 'react';
import { ChevronDown, ChevronUp, Code2 } from 'lucide-react';

interface TechnicalNotesProps {
  dataSources: string[];
  aiCapabilities: string[];
  simulated: string[];
  production: string[];
}

export function TechnicalNotes({ dataSources, aiCapabilities, simulated, production }: TechnicalNotesProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mt-8 glass-card-static overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-3.5 text-sm font-medium text-[#86868b] hover:text-[#1d1d1f] transition-colors"
      >
        <span className="flex items-center gap-2">
          <Code2 className="h-4 w-4" />
          Technical Notes — What's Under the Hood
        </span>
        {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </button>
      {open && (
        <div className="px-5 pb-5 border-t border-[#1d1d1f]/6 pt-4 grid sm:grid-cols-2 gap-5 text-xs text-[#86868b]">
          <div>
            <h4 className="font-semibold text-[#1d1d1f] mb-2">Data Sources (Production)</h4>
            <ul className="space-y-1.5">
              {dataSources.map((d, i) => (
                <li key={i} className="flex items-start gap-2"><span className="text-teal mt-0.5">·</span> {d}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-[#1d1d1f] mb-2">AI/ML Capabilities</h4>
            <ul className="space-y-1.5">
              {aiCapabilities.map((a, i) => (
                <li key={i} className="flex items-start gap-2"><span className="text-[#86868b] mt-0.5">·</span> {a}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-[#1d1d1f] mb-2">Simulated in POC</h4>
            <ul className="space-y-1.5">
              {simulated.map((s, i) => (
                <li key={i} className="flex items-start gap-2"><span className="text-[#c77800] mt-0.5">·</span> {s}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-[#1d1d1f] mb-2">Real in Production</h4>
            <ul className="space-y-1.5">
              {production.map((p, i) => (
                <li key={i} className="flex items-start gap-2"><span className="text-[#248a3d] mt-0.5">·</span> {p}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

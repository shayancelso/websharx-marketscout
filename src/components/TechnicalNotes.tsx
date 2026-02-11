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
    <div className="mt-6 bg-white rounded-xl border border-card-border shadow-sm overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-colors"
      >
        <span className="flex items-center gap-2">
          <Code2 className="h-4 w-4" />
          Technical Notes — What's Under the Hood
        </span>
        {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </button>
      {open && (
        <div className="px-4 pb-4 border-t border-card-border pt-4 grid sm:grid-cols-2 gap-4 text-xs text-gray-500">
          <div>
            <h4 className="font-semibold text-gray-700 mb-1.5">Data Sources (Production)</h4>
            <ul className="space-y-1">
              {dataSources.map((d, i) => (
                <li key={i} className="flex items-start gap-1.5"><span className="text-teal mt-0.5">•</span> {d}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-700 mb-1.5">AI/ML Capabilities</h4>
            <ul className="space-y-1">
              {aiCapabilities.map((a, i) => (
                <li key={i} className="flex items-start gap-1.5"><span className="text-indigo-500 mt-0.5">•</span> {a}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-700 mb-1.5">Simulated in POC</h4>
            <ul className="space-y-1">
              {simulated.map((s, i) => (
                <li key={i} className="flex items-start gap-1.5"><span className="text-amber-500 mt-0.5">•</span> {s}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-700 mb-1.5">Real in Production</h4>
            <ul className="space-y-1">
              {production.map((p, i) => (
                <li key={i} className="flex items-start gap-1.5"><span className="text-emerald-500 mt-0.5">•</span> {p}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

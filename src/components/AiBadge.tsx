import { useState } from 'react';
import { Sparkles, X } from 'lucide-react';

interface AiBadgeProps {
  label?: string;
  tooltip: string;
}

export function AiBadge({ label = 'AI-Powered', tooltip }: AiBadgeProps) {
  const [showTip, setShowTip] = useState(false);

  return (
    <span className="relative inline-flex">
      <button
        onClick={() => setShowTip(!showTip)}
        onMouseEnter={() => setShowTip(true)}
        onMouseLeave={() => setShowTip(false)}
        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 text-[11px] font-medium border border-indigo-100 hover:bg-indigo-100 transition-colors cursor-help"
      >
        <Sparkles className="h-3 w-3" />
        {label}
      </button>
      {showTip && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-lg z-50 leading-relaxed">
          <div className="flex items-start justify-between gap-2">
            <p>{tooltip}</p>
            <button onClick={() => setShowTip(false)} className="shrink-0 text-gray-400 hover:text-white">
              <X className="h-3 w-3" />
            </button>
          </div>
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 w-2 h-2 bg-gray-900 rotate-45" />
        </div>
      )}
    </span>
  );
}

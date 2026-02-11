import { useState } from 'react';
import { Sparkles, X } from 'lucide-react';

interface AiBadgeProps {
  label?: string;
  tooltip: string;
}

export function AiBadge({ label = 'AI', tooltip }: AiBadgeProps) {
  const [showTip, setShowTip] = useState(false);

  return (
    <span className="relative inline-flex">
      <button
        onClick={() => setShowTip(!showTip)}
        onMouseEnter={() => setShowTip(true)}
        onMouseLeave={() => setShowTip(false)}
        className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#1d1d1f]/5 backdrop-blur-sm text-[#86868b] text-[10px] font-medium hover:bg-[#1d1d1f]/8 transition-all duration-200 cursor-help"
      >
        <Sparkles className="h-2.5 w-2.5" />
        {label}
      </button>
      {showTip && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 glass-card-static text-[#1d1d1f] text-xs z-50 leading-relaxed">
          <div className="flex items-start justify-between gap-2">
            <p className="text-[#86868b]">{tooltip}</p>
            <button onClick={() => setShowTip(false)} className="shrink-0 text-[#86868b]/40 hover:text-[#1d1d1f]">
              <X className="h-3 w-3" />
            </button>
          </div>
        </div>
      )}
    </span>
  );
}

import React from 'react';

interface AdPlaceholderProps {
  type: 'banner' | 'sidebar';
}

export default function AdPlaceholder({ type }: AdPlaceholderProps) {
  if (type === 'banner') {
    return (
      <div 
        id="ad-placement-banner"
        className="h-20 w-full rounded-lg border-2 border-dashed border-slate-800 flex items-center justify-center bg-slate-900/50 select-none"
      >
        <span className="text-slate-500 uppercase tracking-widest text-xs font-semibold">Ad Placement placeholder</span>
      </div>
    );
  }

  // Sidebar Ads
  return (
    <div 
      id="ad-placement-sidebar"
      className="flex-1 w-full min-h-[180px] lg:min-h-[300px] h-full rounded-2xl border-2 border-dashed border-slate-800 bg-slate-900/50 flex items-center justify-center p-6 select-none"
    >
      <span className="text-slate-500 uppercase tracking-widest text-xs font-semibold lg:[writing-mode:vertical-lr] lg:rotate-180 text-center">
        Ad Placement placeholder
      </span>
    </div>
  );
}

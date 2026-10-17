import React from 'react';

export interface ToolCardProps {
  title: React.ReactNode;
  subIcon?: React.ReactNode;
  icon: React.ReactNode;
  onClick: () => void;
  className?: string;
}

export const ToolCard: React.FC<ToolCardProps> = ({
  title,
  subIcon,
  icon,
  onClick,
  className = ''
}) => {
  return (
    <div 
      onClick={onClick}
      className={`group relative rounded-2xl bg-white border border-slate-200 shadow-2xs p-2 flex flex-col items-center justify-between min-h-[128px] hover:bg-slate-50 hover:border-slate-400 hover:shadow-xs active:scale-95 transition-all cursor-pointer ${className}`}
    >
      {/* 3D Inner Embossed Plinth */}
      <div className="w-full h-14 sm:h-16 rounded-xl bg-slate-50 border border-slate-200/80 shadow-inner flex items-center justify-center group-hover:bg-slate-100 transition-colors">
        {icon}
      </div>

      {/* Text Label */}
      <span className="text-[10.5px] sm:text-xs font-black text-slate-800 group-hover:text-slate-950 tracking-tight mt-1 leading-tight text-center transition-colors">
        {title}
      </span>

      {/* Sub-Icon / Indicator */}
      <div className="w-4 h-4 flex items-center justify-center mt-0.5 opacity-85 text-slate-600">
        {subIcon || <div className="w-3 h-3" />}
      </div>
    </div>
  );
};

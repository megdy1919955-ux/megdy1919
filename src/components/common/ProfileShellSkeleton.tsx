import React from 'react';

export const ProfileShellSkeleton: React.FC = () => {
  return (
    <div className="w-full min-h-screen bg-[#F8F9FA] text-slate-800 pb-20 select-none animate-pulse" dir="rtl">
      {/* Top Header Pastel Area */}
      <div className="bg-gradient-to-b from-[#E2F1ED] via-[#EDF5F2] to-[#F3F6F9] px-4 pt-3 pb-3">
        {/* Controls Row */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-white/80 shadow-xs" />
            <div className="w-9 h-9 rounded-full bg-white/80 shadow-xs" />
            <div className="w-24 h-7 rounded-full bg-white/80 shadow-xs" />
          </div>
          <div className="w-10 h-4 bg-slate-300/60 rounded-md" />
        </div>

        {/* User Info Row */}
        <div className="flex items-center justify-between mt-2">
          {/* Avatar on Right */}
          <div className="w-20 h-20 rounded-full bg-slate-300/80 border-3 border-white shadow-md shrink-0" />
          {/* User Details in Center */}
          <div className="flex-1 mr-3 space-y-2">
            <div className="w-32 h-6 bg-slate-300/80 rounded-lg" />
            <div className="flex items-center gap-2">
              <div className="w-14 h-4 bg-slate-300/60 rounded-full" />
              <div className="w-14 h-4 bg-slate-300/60 rounded-full" />
              <div className="w-20 h-4 bg-slate-300/60 rounded-full" />
            </div>
          </div>
          {/* Left Arrow */}
          <div className="w-6 h-6 bg-slate-300/40 rounded-full" />
        </div>

        {/* 4 Stats Cards */}
        <div className="grid grid-cols-4 gap-2 text-center mt-5 mb-2 px-1">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="p-2 rounded-2xl bg-white/80 border border-slate-200 shadow-xs flex flex-col items-center">
              <div className="w-8 h-8 rounded-xl bg-slate-200/80 mb-1" />
              <div className="w-10 h-4 bg-slate-200 rounded-sm mb-1" />
              <div className="w-8 h-3 bg-slate-200/60 rounded-sm" />
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-md mx-auto px-4 space-y-3.5 mt-3">
        {/* Super Legend Banner Skeleton */}
        <div className="w-full h-12 rounded-2xl bg-slate-800/20" />

        {/* Currency Row (2 cards) */}
        <div className="grid grid-cols-2 gap-3">
          <div className="h-24 rounded-2xl bg-white border border-slate-200 shadow-xs p-3" />
          <div className="h-24 rounded-2xl bg-white border border-slate-200 shadow-xs p-3" />
        </div>

        {/* 10 Rectangles Grid (أنشطة) */}
        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
          <div className="w-20 h-4 bg-slate-200 rounded-md" />
          <div className="grid grid-cols-5 gap-2.5">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
              <div key={i} className="flex flex-col items-center gap-1.5 p-2 rounded-xl bg-slate-50 border border-slate-100">
                <div className="w-10 h-10 rounded-xl bg-slate-200" />
                <div className="w-10 h-2.5 bg-slate-200 rounded-sm" />
              </div>
            ))}
          </div>
        </div>

        {/* Services List Rectangles */}
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-14 rounded-2xl bg-white border border-slate-200 shadow-xs" />
          ))}
        </div>
      </div>

      {/* Bottom Nav Skeleton */}
      <div className="fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-slate-200 flex items-center justify-around px-4 z-40">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="w-8 h-8 rounded-full bg-slate-200" />
        ))}
      </div>
    </div>
  );
};

export default ProfileShellSkeleton;

import React from 'react';
import { Crown } from 'lucide-react';
import { SupervisorStatsSummary } from '../../types/moderatorStats';

export interface ModeratorSupervisorsTabProps {
  summaries: SupervisorStatsSummary[];
}

/**
 * تبويب ترتيب وتقييم المشرفين الأكثر نشاطاً في الروم
 * يعرض عدد عمليات الطرد والإنزال من المايك لكل مشرف
 */
export const ModeratorSupervisorsTab: React.FC<ModeratorSupervisorsTabProps> = ({
  summaries,
}) => {
  return (
    <div className="flex-1 overflow-y-auto space-y-2.5 pt-3 pr-1 custom-scrollbar">
      {summaries.length === 0 ? (
        <div className="text-center py-10 text-slate-500">
          <p className="text-xs font-bold">لا يوجد مشرفون مسجلون في الإحصائيات حالياً</p>
        </div>
      ) : (
        summaries.map((sup, idx) => (
          <div
            key={sup.moderatorName}
            className="p-3 rounded-2xl bg-slate-900/80 border border-white/10 hover:border-amber-400/40 transition-all flex flex-col gap-2"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="relative">
                  <img
                    src={sup.moderatorAvatar}
                    alt={sup.moderatorName}
                    className="w-10 h-10 rounded-full object-cover border-2 border-amber-400/60 shadow-md"
                  />
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-slate-950 text-amber-300 font-black text-[10px] flex items-center justify-center border border-amber-400/50">
                    {idx + 1}
                  </span>
                </div>

                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-xs font-black text-white">{sup.moderatorName}</h4>
                    {sup.role === 'owner' ? (
                      <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-amber-500 text-slate-950 font-black flex items-center gap-0.5">
                        <Crown className="w-2.5 h-2.5" />
                        مالك الغرفة
                      </span>
                    ) : (
                      <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 font-bold">
                        مشرف معتمد
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-400 font-mono">
                    إجمالي الإجراءات: {sup.totalActions} عملية
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <div className="text-center px-2 py-1 rounded-xl bg-rose-950/40 border border-rose-500/20">
                  <span className="text-[11px] font-black text-rose-300 font-mono block">
                    {sup.totalKicks}
                  </span>
                  <span className="text-[8.5px] text-rose-400 font-bold">طرد</span>
                </div>

                <div className="text-center px-2 py-1 rounded-xl bg-amber-950/40 border border-amber-500/20">
                  <span className="text-[11px] font-black text-amber-300 font-mono block">
                    {sup.totalMicDrops}
                  </span>
                  <span className="text-[8.5px] text-amber-400 font-bold">تنزيل مايك</span>
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

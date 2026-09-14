export type RoyalThemeMode = 'gold' | 'white' | 'dark';

export interface RoyalThemeStyles {
  outerBorder: string;
  innerBg: string;
  innerBorder: string;
  titleText: string;
  subText: string;
  plinthBg: string;
  shadow: string;
  chevron: string;
  coinsText: string;
  diamondsText: string;
  pillBadge: string;
  roleBadge: string;
  roleButton: string;
  listWrapper: string;
}

export const ROYAL_THEMES: Record<RoyalThemeMode, RoyalThemeStyles> = {
  gold: {
    outerBorder: 'bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] via-[#B38728] via-[#FBF5B7] to-[#AA771C]',
    innerBg: 'bg-gradient-to-b from-[#FFFDF9] via-[#FAF5E8] to-[#FFF9ED]',
    innerBorder: 'border-[#FFF8E7]/90',
    titleText: 'text-[#5C3F13] group-hover:text-[#B38022]',
    subText: 'text-[#8C7355]',
    plinthBg: 'bg-gradient-to-b from-white/95 to-[#FAF5E8] border border-[#DFC386]/80 shadow-[0_2px_6px_rgba(180,140,60,0.12),inset_0_1px_2px_rgba(255,255,255,1)]',
    shadow: 'shadow-[0_4px_16px_rgba(180,140,50,0.18)] hover:shadow-[0_6px_20px_rgba(180,140,50,0.28)]',
    chevron: 'text-[#C89228] group-hover:text-[#7A5210]',
    coinsText: 'text-[#5C3F13] group-hover:text-[#B38022]',
    diamondsText: 'text-[#0369A1] group-hover:text-[#0284C7]',
    pillBadge: 'bg-gradient-to-r from-[#BF953F] via-[#FDE047] to-[#AA771C] text-[#3B2610] border-white shadow-[0_2px_6px_rgba(120,80,20,0.35)]',
    roleBadge: 'bg-gradient-to-r from-[#F5D061]/30 to-[#C89228]/30 text-[#7E4F0B] border-[#E8DFC8]',
    roleButton: 'text-[#7A5210] bg-white/95 border-[#E2B755]/50 group-hover:bg-gradient-to-r group-hover:from-[#B38022] group-hover:to-[#7A5210] group-hover:text-white',
    listWrapper: 'bg-white border-slate-200'
  },
  white: {
    outerBorder: 'bg-gradient-to-r from-slate-200 via-white via-slate-100 via-white to-slate-300',
    innerBg: 'bg-gradient-to-b from-[#FFFFFF] via-[#F8FAFC] to-[#F1F5F9]',
    innerBorder: 'border-white',
    titleText: 'text-slate-800 group-hover:text-slate-950',
    subText: 'text-slate-500',
    plinthBg: 'bg-gradient-to-b from-white to-[#F8FAFC] border border-slate-200/90 shadow-[0_2px_6px_rgba(0,0,0,0.04),inset_0_1px_2px_rgba(255,255,255,1)]',
    shadow: 'shadow-[0_4px_16px_rgba(148,163,184,0.2)] hover:shadow-[0_6px_20px_rgba(148,163,184,0.3)]',
    chevron: 'text-slate-400 group-hover:text-slate-700',
    coinsText: 'text-slate-800 group-hover:text-amber-600',
    diamondsText: 'text-slate-800 group-hover:text-sky-600',
    pillBadge: 'bg-gradient-to-r from-slate-700 to-slate-900 text-white border-white shadow-[0_2px_6px_rgba(0,0,0,0.12)]',
    roleBadge: 'bg-slate-100 text-slate-700 border-slate-200',
    roleButton: 'text-slate-700 bg-white border-slate-200 group-hover:bg-slate-800 group-hover:text-white',
    listWrapper: 'bg-white border-slate-200'
  },
  dark: {
    outerBorder: 'bg-gradient-to-r from-[#334155] via-[#64748B] via-[#1E293B] via-[#475569] to-[#0F172A]',
    innerBg: 'bg-gradient-to-b from-[#1E293B] via-[#0F172A] to-[#0B1120]',
    innerBorder: 'border-slate-700/80',
    titleText: 'text-slate-100 group-hover:text-amber-300',
    subText: 'text-slate-400',
    plinthBg: 'bg-gradient-to-b from-[#334155] to-[#1E293B] border border-slate-600/70 shadow-[0_2px_6px_rgba(0,0,0,0.4),inset_0_1px_2px_rgba(255,255,255,0.05)]',
    shadow: 'shadow-[0_4px_16px_rgba(0,0,0,0.4)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.55)]',
    chevron: 'text-slate-400 group-hover:text-amber-300',
    coinsText: 'text-amber-300 group-hover:text-amber-200',
    diamondsText: 'text-sky-300 group-hover:text-sky-200',
    pillBadge: 'bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 text-slate-950 border-slate-800 shadow-[0_2px_6px_rgba(0,0,0,0.4)]',
    roleBadge: 'bg-slate-800 text-amber-300 border-slate-700',
    roleButton: 'text-amber-300 bg-slate-800/90 border-slate-700 group-hover:bg-amber-400 group-hover:text-slate-950',
    listWrapper: 'bg-[#0f172a]/70 border-slate-800'
  }
};

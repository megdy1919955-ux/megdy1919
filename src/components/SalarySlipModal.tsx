import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronDown, HelpCircle, Check, Info } from 'lucide-react';

interface SalarySlipModalProps {
  isOpen: boolean;
  onClose: () => void;
  direction?: 'rtl' | 'ltr';
}

interface MonthlySlipData {
  monthKey: string;
  monthLabel: string;
  totalSalary: string;
  frozenEarnings: string;
  baseCommission: string;
  unlockedCommission: string;
  agencyDiamonds: string;
  commissionRate: string;
  brokerShare: string;
  sentSalaryTotal: string;
  transactions: {
    id: string;
    amount: number;
    timestamp: string;
  }[];
}

const MONTHLY_DATA: { [key: string]: MonthlySlipData } = {
  '2026/08': {
    monthKey: '2026/08',
    monthLabel: '2026/08',
    totalSalary: '49',
    frozenEarnings: '0.00',
    baseCommission: '62',
    unlockedCommission: '12',
    agencyDiamonds: '3,469,755',
    commissionRate: '0.8',
    brokerShare: '30',
    sentSalaryTotal: '19',
    transactions: [
      { id: 'tx-1', amount: 3, timestamp: '2026-08-23T04:35:21Z' },
      { id: 'tx-2', amount: 1, timestamp: '2026-08-18T04:29:42Z' },
      { id: 'tx-3', amount: 5, timestamp: '2026-08-15T04:26:42Z' },
      { id: 'tx-4', amount: 4, timestamp: '2026-08-09T04:15:54Z' },
      { id: 'tx-5', amount: 1, timestamp: '2026-08-08T04:15:52Z' },
      { id: 'tx-6', amount: 1, timestamp: '2026-08-06T04:10:19Z' },
      { id: 'tx-7', amount: 2, timestamp: '2026-08-05T04:09:00Z' },
      { id: 'tx-8', amount: 2, timestamp: '2026-08-02T04:08:12Z' },
    ]
  },
  '2026/07': {
    monthKey: '2026/07',
    monthLabel: '2026/07',
    totalSalary: '58',
    frozenEarnings: '0.00',
    baseCommission: '75',
    unlockedCommission: '17',
    agencyDiamonds: '4,895,304',
    commissionRate: '0.8',
    brokerShare: '35',
    sentSalaryTotal: '23',
    transactions: [
      { id: 'tx-07-1', amount: 6, timestamp: '2026-07-28T04:12:10Z' },
      { id: 'tx-07-2', amount: 4, timestamp: '2026-07-21T04:10:55Z' },
      { id: 'tx-07-3', amount: 5, timestamp: '2026-07-14T04:08:33Z' },
      { id: 'tx-07-4', amount: 8, timestamp: '2026-07-07T04:05:12Z' },
    ]
  },
  '2026/06': {
    monthKey: '2026/06',
    monthLabel: '2026/06',
    totalSalary: '42',
    frozenEarnings: '0.00',
    baseCommission: '55',
    unlockedCommission: '13',
    agencyDiamonds: '3,120,400',
    commissionRate: '0.8',
    brokerShare: '25',
    sentSalaryTotal: '17',
    transactions: [
      { id: 'tx-06-1', amount: 5, timestamp: '2026-06-25T04:20:10Z' },
      { id: 'tx-06-2', amount: 4, timestamp: '2026-06-18T04:14:02Z' },
      { id: 'tx-06-3', amount: 5, timestamp: '2026-06-10T04:11:45Z' },
      { id: 'tx-06-4', amount: 3, timestamp: '2026-06-03T04:09:12Z' },
    ]
  }
};

export const SalarySlipModal: React.FC<SalarySlipModalProps> = ({
  isOpen,
  onClose,
  direction = 'rtl'
}) => {
  const [selectedMonth, setSelectedMonth] = useState('2026/08');
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentData = MONTHLY_DATA[selectedMonth] || MONTHLY_DATA['2026/08'];
  const isRtl = direction === 'rtl';

  const tooltipsContent: { [key: string]: { title: string; desc: string } } = {
    baseCommission: {
      title: 'العمولة الأساسية',
      desc: 'إجمالي العمولة المحتسبة من نقاط وماسات الوكالة قبل أي تسويات أو استقطاعات.'
    },
    unlockedCommission: {
      title: 'العمولة المفكوكة',
      desc: 'المبالغ المفكوكة والمستردة أو المحولة لمصروفات البث والوسطاء وفق جدول التحويلات.'
    },
    sentSalary: {
      title: 'الراتب المرسل',
      desc: 'مجموع الدفعات التي تم إرسالها وتحويلها إلى حسابك بنجاح خلال هذا الشهر.'
    }
  };

  return (
    <div 
      className={`fixed inset-0 z-80 w-full h-full min-h-screen bg-[#F6F8FB] flex flex-col overflow-y-auto select-none ${
        isRtl ? 'text-right' : 'text-left'
      }`}
      dir={direction}
    >
      {/* Top Header Bar */}
      <div className="sticky top-0 z-40 bg-[#F6F8FB]/95 backdrop-blur-md px-4 py-3 flex items-center justify-between border-b border-slate-100">
        <button 
          onClick={onClose}
          className="p-1 hover:bg-slate-200/70 rounded-full text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
          title="إغلاق"
        >
          <X className="w-5 h-5 stroke-[2.2]" />
        </button>

        <h1 className="text-base font-bold text-slate-800 tracking-tight">
          {isRtl ? 'قسيمة الراتب' : 'Salary Slip'}
        </h1>

        {/* Placeholder to balance layout */}
        <div className="w-5" />
      </div>

      {/* Main Content Area */}
      <div className="w-full max-w-md mx-auto px-4 py-3 space-y-3 pb-16 flex-1">
        
        {/* Month Selector Pill */}
        <div className="relative">
          <button
            onClick={() => setShowMonthPicker(!showMonthPicker)}
            className="w-full bg-white border border-slate-200/90 rounded-full px-5 py-2.5 flex items-center justify-between shadow-[0_1px_4px_rgba(0,0,0,0.02)] hover:border-slate-300 transition-all cursor-pointer active:scale-[0.99]"
          >
            <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${showMonthPicker ? 'rotate-180' : ''}`} />
            <span className="font-mono font-bold text-sm text-slate-800">
              {currentData.monthLabel}
            </span>
          </button>

          {/* Month Dropdown Menu */}
          <AnimatePresence>
            {showMonthPicker && (
              <motion.div
                initial={{ opacity: 0, y: -6, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.98 }}
                className="absolute top-full left-0 right-0 mt-1.5 z-50 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden py-1"
              >
                {Object.keys(MONTHLY_DATA).map((monthKey) => (
                  <button
                    key={monthKey}
                    onClick={() => {
                      setSelectedMonth(monthKey);
                      setShowMonthPicker(false);
                    }}
                    className={`w-full px-4 py-2.5 flex items-center justify-between text-xs font-mono font-bold transition-colors cursor-pointer ${
                      selectedMonth === monthKey 
                        ? 'bg-blue-50 text-blue-600' 
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>{monthKey}</span>
                    {selectedMonth === monthKey && <Check className="w-4 h-4 text-blue-600" />}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ========================================================= */}
        {/* 1. البطاقة الأولى: إجمالي الراتب */}
        {/* ========================================================= */}
        <div className="bg-white rounded-3xl p-5 shadow-[0_1px_6px_rgba(0,0,0,0.02)] border border-slate-100 space-y-2">
          {/* Header Label */}
          <div className="text-right">
            <span className="text-sm font-bold text-slate-900 block">
              {isRtl ? 'إجمالي الراتب:' : 'Total Salary:'}
            </span>
          </div>

          {/* Main Number ($ 49) in bright vivid green */}
          <div className="text-right">
            <span className="text-4xl sm:text-5xl font-black font-mono text-[#00C853] tracking-tight">
              {currentData.totalSalary} $
            </span>
          </div>

          {/* Subtext formulas */}
          <div className="pt-2 space-y-1 text-right">
            <p className="text-[11px] sm:text-xs text-slate-500 font-medium leading-relaxed">
              {isRtl 
                ? 'إجمالي الراتب=العمولة الأساسية-العمولة المفكوكة' 
                : 'Total Salary = Base Commission - Unlocked Commission'}
            </p>
            <p className="text-[11px] sm:text-xs text-[#FF3B30] font-bold">
              {isRtl 
                ? `أرباح مجمدة$ ${currentData.frozenEarnings}` 
                : `Frozen Earnings $ ${currentData.frozenEarnings}`}
            </p>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 2. البطاقة الثانية: العمولة الأساسية */}
        {/* ========================================================= */}
        <div className="bg-white rounded-2xl p-4 shadow-[0_1px_6px_rgba(0,0,0,0.02)] border border-slate-100 flex items-center justify-between">
          {/* Value on Left */}
          <span className="font-mono font-bold text-base text-[#00A8EA]">
            {currentData.baseCommission} $
          </span>

          {/* Label + Help Icon on Right */}
          <div className="flex items-center gap-1.5">
            <button 
              onClick={() => setActiveTooltip(activeTooltip === 'baseCommission' ? null : 'baseCommission')}
              className="text-slate-400 hover:text-slate-600 transition-colors p-0.5 rounded-full hover:bg-slate-100 cursor-pointer"
              title="معلومات"
            >
              <HelpCircle className="w-4 h-4 stroke-[2]" />
            </button>
            <span className="text-sm font-bold text-slate-900">
              {isRtl ? 'العمولة الأساسية:' : 'Base Commission:'}
            </span>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 3. البطاقة الثالثة: العمولة المفكوكة */}
        {/* ========================================================= */}
        <div className="bg-white rounded-2xl p-4 shadow-[0_1px_6px_rgba(0,0,0,0.02)] border border-slate-100 space-y-3">
          {/* Row 1: العمولة المفكوكة */}
          <div className="flex items-center justify-between">
            <span className="font-mono font-bold text-base text-[#00A8EA]">
              {currentData.unlockedCommission} $
            </span>
            <div className="flex items-center gap-1.5">
              <button 
                onClick={() => setActiveTooltip(activeTooltip === 'unlockedCommission' ? null : 'unlockedCommission')}
                className="text-slate-400 hover:text-slate-600 transition-colors p-0.5 rounded-full hover:bg-slate-100 cursor-pointer"
                title="معلومات"
              >
                <HelpCircle className="w-4 h-4 stroke-[2]" />
              </button>
              <span className="text-sm font-bold text-slate-900">
                {isRtl ? 'العمولة المفكوكة:' : 'Unlocked Commission:'}
              </span>
            </div>
          </div>

          {/* Row 2: ماس الوكالة المستلم */}
          <div className="flex items-center justify-between pt-1">
            <span className="font-mono font-bold text-sm text-[#00A8EA]">
              {currentData.agencyDiamonds}
            </span>
            <span className="text-xs font-bold text-slate-600">
              {isRtl ? 'ماس الوكالة المستلم:' : 'Agency Diamonds Received:'}
            </span>
          </div>

          {/* Row 3: سعر عمولة الوكالة */}
          <div className="flex items-center justify-between">
            <span className="font-mono font-bold text-sm text-[#00A8EA]">
              {currentData.commissionRate}
            </span>
            <span className="text-xs font-bold text-slate-600">
              {isRtl ? 'سعر عمولة الوكالة:' : 'Agency Commission Rate:'}
            </span>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 4. البطاقة الرابعة: حصة الوسيط */}
        {/* ========================================================= */}
        <div className="bg-white rounded-2xl p-4 shadow-[0_1px_6px_rgba(0,0,0,0.02)] border border-slate-100 flex items-center justify-between">
          <span className="font-mono font-bold text-base text-[#00A8EA]">
            {currentData.brokerShare} $
          </span>
          <span className="text-sm font-bold text-slate-900">
            {isRtl ? 'حصة الوسيط:' : "Broker's Share:"}
          </span>
        </div>

        {/* ========================================================= */}
        {/* 5. البطاقة الخامسة: الراتب المرسل والسجلات */}
        {/* ========================================================= */}
        <div className="bg-white rounded-3xl p-5 shadow-[0_1px_6px_rgba(0,0,0,0.02)] border border-slate-100 space-y-4">
          {/* Header Row */}
          <div className="flex items-center justify-between pb-1 border-b border-slate-50">
            {/* Left side: Coin + Amount */}
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center text-[10px] shadow-xs text-amber-950 font-black">
                🪙
              </div>
              <span className="font-mono font-bold text-base text-[#00A8EA]">
                {currentData.sentSalaryTotal}
              </span>
            </div>

            {/* Right side: Label + Help Icon */}
            <div className="flex items-center gap-1.5">
              <button 
                onClick={() => setActiveTooltip(activeTooltip === 'sentSalary' ? null : 'sentSalary')}
                className="text-slate-400 hover:text-slate-600 transition-colors p-0.5 rounded-full hover:bg-slate-100 cursor-pointer"
                title="معلومات"
              >
                <HelpCircle className="w-4 h-4 stroke-[2]" />
              </button>
              <span className="text-sm font-bold text-slate-900">
                {isRtl ? 'الراتب المرسل:' : 'Sent Salary:'}
              </span>
            </div>
          </div>

          {/* Transactions List */}
          <div className="space-y-3.5 pt-1">
            {currentData.transactions.map((item) => (
              <div 
                key={item.id}
                className="flex items-center justify-between text-xs"
              >
                {/* Left side: Coin + Amount */}
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center text-[10px] shadow-xs text-amber-950 font-black shrink-0">
                    🪙
                  </div>
                  <span className="font-mono font-bold text-sm text-slate-800">
                    {item.amount}
                  </span>
                </div>

                {/* Right side: Timestamp in UTC ISO format */}
                <span className="font-mono text-xs text-slate-400 tracking-tight">
                  {item.timestamp}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Subtle Watermark Footer */}
        <div className="text-center pt-4 pb-2">
          <span className="text-[10px] font-mono text-slate-200 tracking-wider select-none">
            fe89138d88fc8fcea9e6b284356c6b96
          </span>
        </div>

      </div>

      {/* Tooltip / Info Modal */}
      <AnimatePresence>
        {activeTooltip && (
          <div className="fixed inset-0 z-90 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4" onClick={() => setActiveTooltip(null)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-5 max-w-xs w-full shadow-2xl border border-slate-100 space-y-3 text-slate-900"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div className="flex items-center gap-2">
                  <Info className="w-4 h-4 text-blue-500" />
                  <h3 className="text-xs font-bold text-slate-800">
                    {tooltipsContent[activeTooltip]?.title}
                  </h3>
                </div>
                <button onClick={() => setActiveTooltip(null)} className="p-1 rounded-full text-slate-400 hover:bg-slate-100">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                {tooltipsContent[activeTooltip]?.desc}
              </p>
              <button 
                onClick={() => setActiveTooltip(null)}
                className="w-full py-2 bg-slate-900 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                فهمت ذلك
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Save,
  RotateCcw,
  Sparkles,
  Edit3,
  Check,
  Plus,
  Flame,
  Crown,
  Gamepad2,
  Smile,
  Globe,
  UploadCloud,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import {
  EmojiSlotItem,
  EmojiCategory,
  getEmojisFromCache,
  updateEmojiSlotOnServer,
  resetEmojisToDefaultOnServer,
  saveAllEmojisToServer
} from '../../lib/emojiService';

export interface EmojiDashboardManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessNotice?: (msg: string) => void;
}

/**
 * لوحة تحكم وإدارة مربعات الإيموجي (Emoji Dashboard Manager)
 * - تسمح بتعديل واستبدال أي مربع إيموجي وحفظ التعديلات فوراً في السيرفر.
 * - تتزامن لحظياً مع الروم.
 */
export const EmojiDashboardManagerModal: React.FC<EmojiDashboardManagerModalProps> = ({
  isOpen,
  onClose,
  onSuccessNotice
}) => {
  const [slots, setSlots] = useState<EmojiSlotItem[]>(getEmojisFromCache());
  const [selectedSlot, setSelectedSlot] = useState<EmojiSlotItem | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // حقول تعديل المربع المحدد
  const [editEmoji, setEditEmoji] = useState('');
  const [editName, setEditName] = useState('');
  const [editCategory, setEditCategory] = useState<EmojiCategory>('free');
  const [editBadge, setEditBadge] = useState<string>('');
  const [editIconUrl, setEditIconUrl] = useState('');
  const [editAnimation, setEditAnimation] = useState<'float' | 'bounce' | 'pulse' | 'firework' | 'spin'>('bounce');

  useEffect(() => {
    if (isOpen) {
      setSlots(getEmojisFromCache());
      setSelectedSlot(null);
      setStatusMessage(null);
    }
  }, [isOpen]);

  const handleSelectSlot = (slot: EmojiSlotItem) => {
    setSelectedSlot(slot);
    setEditEmoji(slot.emoji);
    setEditName(slot.name);
    setEditCategory(slot.category);
    setEditBadge(slot.badge || '');
    setEditIconUrl(slot.iconUrl || '');
    setEditAnimation(slot.animationType || 'bounce');
  };

  const handleSaveSlot = async () => {
    if (!selectedSlot) return;
    setIsSaving(true);
    setStatusMessage(null);

    try {
      const updatedPayload: Partial<EmojiSlotItem> = {
        emoji: editEmoji.trim() || selectedSlot.emoji,
        name: editName.trim() || selectedSlot.name,
        category: editCategory,
        badge: editBadge.trim() || undefined,
        iconUrl: editIconUrl.trim() || undefined,
        animationType: editAnimation,
        isVip: editCategory === 'vip' || editBadge === 'VIP'
      };

      await updateEmojiSlotOnServer(selectedSlot.id, updatedPayload);

      // تحديث القائمة المعروضة محلياً
      const updatedList = slots.map((s) =>
        s.id === selectedSlot.id ? { ...s, ...updatedPayload } : s
      );
      setSlots(updatedList);
      setSelectedSlot(null);

      const msg = `تم تحديث المربع #${selectedSlot.slotIndex} بنجاح وحفظه في السيرفر! 🚀`;
      setStatusMessage({ text: msg, type: 'success' });
      onSuccessNotice?.(msg);
    } catch (err: any) {
      setStatusMessage({ text: 'حدث خطأ أثناء الحفظ في السيرفر: ' + err.message, type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetToDefaults = async () => {
    if (!window.confirm('هل أنت متأكد من رغبتك في إعادة جميع المربعات إلى الإعدادات الافتراضية؟')) {
      return;
    }
    setIsSaving(true);
    try {
      await resetEmojisToDefaultOnServer();
      setSlots(getEmojisFromCache());
      setSelectedSlot(null);
      const msg = 'تم استعادة مربعات الإيموجي الافتراضية وحفظها في السيرفر بنجاح! 🔄';
      setStatusMessage({ text: msg, type: 'success' });
      onSuccessNotice?.(msg);
    } catch (err: any) {
      setStatusMessage({ text: 'فشلت الاستعادة: ' + err.message, type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 select-none"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl bg-[#0F1424] text-white rounded-2xl border border-amber-500/40 shadow-2xl flex flex-col max-h-[85vh] overflow-hidden"
        dir="rtl"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/10 bg-[#0B0F1C] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-black shadow-md">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-black text-amber-300">
                لوحة تحكم وتعديل مربعات الإيموجي
              </h3>
              <p className="text-[10px] text-slate-400">
                تعديل وتخصيص المربعات وحفظها مباشرة في السيرفر وقاعدة البيانات
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleResetToDefaults}
              className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-300 border border-white/10 text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer"
              title="استعادة الافتراضيات"
            >
              <RotateCcw className="w-3 h-3" />
              <span>استعادة</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Status message */}
        {statusMessage && (
          <div
            className={`px-4 py-2 text-xs font-bold flex items-center gap-2 shrink-0 ${
              statusMessage.type === 'success'
                ? 'bg-emerald-500/20 text-emerald-300 border-b border-emerald-500/30'
                : 'bg-rose-500/20 text-rose-300 border-b border-rose-500/30'
            }`}
          >
            {statusMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0" />
            )}
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Instructions */}
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200/90 leading-relaxed">
            💡 اضغط على أي مربع إيموجي بالأسفل لتعديل رمزه، اسمه، تصنيفه، أو صورة الأيقونة. بمجرد الضغط على <b>حفظ في السيرفر</b>، سينعكس التغيير فوراً في الغرفة الصوتية!
          </div>

          {/* Grid of Boxes */}
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2.5">
            {slots.map((slot) => {
              const isSelected = selectedSlot?.id === slot.id;

              return (
                <button
                  key={slot.id}
                  type="button"
                  onClick={() => handleSelectSlot(slot)}
                  className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all cursor-pointer relative aspect-square ${
                    isSelected
                      ? 'bg-amber-500 text-slate-950 border-amber-400 font-black shadow-lg scale-105 ring-2 ring-amber-400/50'
                      : 'bg-[#151C2C] hover:bg-[#1A2338] border-white/10 text-white'
                  }`}
                >
                  <span className="absolute top-1 right-1.5 text-[8px] font-mono opacity-60">
                    #{slot.slotIndex}
                  </span>

                  {slot.badge && (
                    <span className="absolute top-1 left-1 px-1 py-0.2 rounded text-[7px] font-black bg-rose-500 text-white uppercase">
                      {slot.badge}
                    </span>
                  )}

                  <div className="text-2xl sm:text-3xl my-auto select-none">
                    {slot.iconUrl ? (
                      <img src={slot.iconUrl} alt={slot.name} className="w-8 h-8 object-contain" />
                    ) : (
                      slot.emoji
                    )}
                  </div>

                  <span className="text-[10px] font-bold truncate max-w-full">
                    {slot.name}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Edit Form Modal Drawer (عند اختيار مربع) */}
          <AnimatePresence>
            {selectedSlot && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 15 }}
                className="p-4 rounded-2xl bg-[#131A2D] border border-amber-500/50 shadow-xl space-y-3.5"
              >
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-300 font-mono text-xs flex items-center justify-center font-bold">
                      #{selectedSlot.slotIndex}
                    </span>
                    <h4 className="text-xs font-black text-amber-300">
                      تعديل بيانات المربع: {selectedSlot.name} ({selectedSlot.emoji})
                    </h4>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedSlot(null)}
                    className="text-slate-400 hover:text-white text-xs cursor-pointer"
                  >
                    إلغاء التحديد
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {/* الرمز / الإيموجي */}
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">
                      رمز الإيموجي (Emoji Symbol)
                    </label>
                    <input
                      type="text"
                      value={editEmoji}
                      onChange={(e) => setEditEmoji(e.target.value)}
                      placeholder="ضع رمز الإيموجي هنا (مثلاً: 🔥 أو 👑)"
                      className="w-full bg-[#1A2238] border border-white/10 rounded-xl px-3 py-2 text-white font-mono text-center text-lg focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  {/* اسم التفاعل */}
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">
                      اسم التفاعل بالعربي
                    </label>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      placeholder="مثال: حماس ناري"
                      className="w-full bg-[#1A2238] border border-white/10 rounded-xl px-3 py-2 text-white font-bold focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  {/* التصنيف */}
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">التصنيف</label>
                    <select
                      value={editCategory}
                      onChange={(e) => setEditCategory(e.target.value as any)}
                      className="w-full bg-[#1A2238] border border-white/10 rounded-xl px-3 py-2 text-white font-bold focus:outline-none focus:border-amber-400"
                    >
                      <option value="free">مجاني (Free)</option>
                      <option value="emoji">Emoji</option>
                      <option value="featured">مميزة (Featured)</option>
                      <option value="custom">مخصص (Custom)</option>
                      <option value="vip">VIP ملكي (VIP)</option>
                      <option value="events">الفعاليات (Events)</option>
                    </select>
                  </div>

                  {/* نوع التأثير الحركي */}
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">نوع الحركة عند الإرسال</label>
                    <select
                      value={editAnimation}
                      onChange={(e) => setEditAnimation(e.target.value as any)}
                      className="w-full bg-[#1A2238] border border-white/10 rounded-xl px-3 py-2 text-white font-bold focus:outline-none focus:border-amber-400"
                    >
                      <option value="bounce">قفز ارتدادي (Bounce)</option>
                      <option value="float">طيران لأعلى (Float)</option>
                      <option value="pulse">نبض وتكبير (Pulse)</option>
                      <option value="firework">ألعاب نارية (Firework)</option>
                      <option value="spin">دوران سريع (Spin)</option>
                    </select>
                  </div>

                  {/* الشارة التميزية */}
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">الشارة الترويجية (اختياري)</label>
                    <input
                      type="text"
                      value={editBadge}
                      onChange={(e) => setEditBadge(e.target.value)}
                      placeholder="مثال: VIP, HOT, NEW"
                      className="w-full bg-[#1A2238] border border-white/10 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  {/* رابط صورة أو أيقونة مخصصة */}
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">رابط صورة مخصصة (اختياري)</label>
                    <input
                      type="text"
                      value={editIconUrl}
                      onChange={(e) => setEditIconUrl(e.target.value)}
                      placeholder="https://... أو اتركه فارغاً للإيموجي العادي"
                      className="w-full bg-[#1A2238] border border-white/10 rounded-xl px-3 py-2 text-white text-xs font-mono focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                {/* أزرار الحفظ والإلغاء */}
                <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setSelectedSlot(null)}
                    className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-bold transition-all cursor-pointer"
                  >
                    إلغاء
                  </button>

                  <button
                    type="button"
                    onClick={handleSaveSlot}
                    disabled={isSaving}
                    className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-xs flex items-center gap-1.5 transition-all shadow-md active:scale-95 disabled:opacity-50 cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{isSaving ? 'جارِ الحفظ بالسيرفر...' : 'حفظ التعديل في السيرفر'}</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-[#0B0F1C] border-t border-white/10 shrink-0 flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1 text-[11px]">
            <Globe className="w-3.5 h-3.5 text-emerald-400" />
            <span>متصل مباشرة بالسيرفر السحابي (Firestore Sync)</span>
          </span>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold transition-all cursor-pointer"
          >
            إغلاق
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default EmojiDashboardManagerModal;

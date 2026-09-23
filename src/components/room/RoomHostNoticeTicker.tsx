import React, { useState, useEffect } from 'react';
import { Crown, Edit3, Check, X } from 'lucide-react';
import { RoomOwnerBadge } from './RoomOwnerBadge';

export interface RoomHostNoticeTickerProps {
  roomId?: string;
  hostName?: string;
  initialNoticeText?: string;
  isOwner?: boolean;
}

export const RoomHostNoticeTicker: React.FC<RoomHostNoticeTickerProps> = React.memo(({
  roomId = 'default',
  hostName = 'صاحب الروم (المالك 👑)',
  initialNoticeText = 'مرحباً في رومي الخاص! يسعدني تشريفكم وحضوركم جميعاً وأتمنى لكم قضاء أجمل الأوقات ✨',
  isOwner = false,
}) => {
  const [noticeText, setNoticeText] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(`room_welcome_announcement_${roomId}`);
      if (saved && saved.trim()) return saved;
    } catch (e) {}
    return initialNoticeText;
  });

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editText, setEditText] = useState<string>(noticeText);

  // Fetch live announcement from server on mount
  useEffect(() => {
    fetch(`/api/rooms/${encodeURIComponent(roomId)}/announcement`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.noticeText) {
          setNoticeText(data.noticeText);
          try {
            localStorage.setItem(`room_welcome_announcement_${roomId}`, data.noticeText);
          } catch (e) {}
        }
      })
      .catch(() => {});
  }, [roomId]);

  const handleSave = () => {
    const trimmed = editText.trim();
    if (!trimmed) return;
    setNoticeText(trimmed);
    setIsEditing(false);
    try {
      localStorage.setItem(`room_welcome_announcement_${roomId}`, trimmed);
    } catch (e) {}

    fetch(`/api/rooms/${encodeURIComponent(roomId)}/announcement`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ hostName, noticeText: trimmed })
    }).catch(() => {});
  };

  return (
    <div
      className="bg-transparent border-b border-yellow-500/20 pb-2 mb-1.5 shrink-0 w-full max-w-full text-yellow-400 select-none"
      dir="rtl"
    >
      {/* Top row: [دخول المضيف] + Host Name + Edit Button (for owner) */}
      <div className="flex items-center justify-between gap-1.5 pb-1">
        <div className="flex items-center gap-1.5 font-black text-xs text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.4)]">
          <Crown className="w-4 h-4 text-yellow-400 fill-yellow-400 shrink-0" />
          <span>[دخول المضيف]</span>
          <span className="text-yellow-300 font-extrabold flex items-center gap-1">
            <span>{hostName}</span>
            {isOwner && <RoomOwnerBadge size="sm" />}
          </span>
        </div>

        {isOwner && !isEditing && (
          <button
            type="button"
            onClick={() => {
              setEditText(noticeText);
              setIsEditing(true);
            }}
            className="flex items-center gap-1 px-2 py-0.5 rounded-lg border border-yellow-400/40 text-yellow-300 hover:text-yellow-200 hover:border-yellow-300 text-[10px] font-bold bg-transparent transition-all cursor-pointer"
            title="تعديل لوحة الترحيب"
          >
            <Edit3 className="w-3 h-3" />
            <span>تعديل الترحيب</span>
          </button>
        )}
      </div>

      {/* Notice Text Content: Yellow, No background */}
      {isEditing ? (
        <div className="mt-1 space-y-1.5">
          <div className="relative">
            <textarea
              value={editText}
              maxLength={120}
              onChange={(e) => setEditText(e.target.value.slice(0, 120))}
              rows={2}
              className="w-full bg-slate-950/80 border border-yellow-400/60 rounded-xl p-2 pb-5 text-xs text-yellow-300 font-bold focus:outline-hidden focus:border-yellow-300 resize-none"
              placeholder="اكتب الترحيب الخاص برومك هنا (حد أقصى 120 حرف)..."
            />
            <span className="absolute bottom-1.5 left-2 text-[9px] font-mono text-yellow-400/70 select-none">
              {editText.length}/120
            </span>
          </div>
          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-2.5 py-1 rounded-lg border border-white/20 text-slate-300 text-[10px] font-bold hover:bg-white/5 cursor-pointer flex items-center gap-1"
            >
              <X className="w-3 h-3" />
              <span>إلغاء</span>
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-3 py-1 rounded-lg bg-yellow-500 hover:bg-yellow-400 text-slate-950 text-[10px] font-black shadow-sm cursor-pointer flex items-center gap-1"
            >
              <Check className="w-3 h-3" />
              <span>حفظ الترحيب</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="text-[11.5px] font-bold text-yellow-300/95 leading-relaxed pr-1 pt-0.5 flex items-start gap-1">
          <span className="text-yellow-400 shrink-0 font-black">📢</span>
          <p className="break-words">
            <span className="text-yellow-400 font-black">مرحباً في رومي الخاص: </span>
            <span>{noticeText}</span>
          </p>
        </div>
      )}
    </div>
  );
});

RoomHostNoticeTicker.displayName = 'RoomHostNoticeTicker';

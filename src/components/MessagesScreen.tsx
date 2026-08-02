import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  MessageSquare,
  Bell,
  Search,
  CheckCheck,
  Users,
  ShieldAlert,
  Sparkles,
  Inbox,
  Trash2,
  RefreshCw,
  Compass,
  Heart
} from 'lucide-react';

export const MessagesScreen: React.FC = () => {
  const [activeTabFilter, setActiveTabFilter] = useState<'chats' | 'system'>('chats');
  const [chats, setChats] = useState([
    {
      id: '1',
      name: 'فريق الدعم الفني الملكي',
      avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=150',
      lastMsg: 'أهلاً بك يا أبا أمجد! تم تفعيل اشتراك VIP الخاص بك بنجاح 🎉',
      time: '08:22 ص',
      unread: 2,
      isOfficial: true,
    },
    {
      id: '2',
      name: 'الأميرة ريم',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
      lastMsg: 'شكراً لك على الدعم في روم الشعر، ننتظرك السهرة القادمة!',
      time: 'أمس',
      unread: 1,
      isOfficial: false,
    },
    {
      id: '3',
      name: 'الكابتن علي',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
      lastMsg: 'تم حجز الميكروفون لك في معركة B.K اليوم.',
      time: 'أمس',
      unread: 0,
      isOfficial: false,
    },
  ]);

  const initialChats = [
    {
      id: '1',
      name: 'فريق الدعم الفني الملكي',
      avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=150',
      lastMsg: 'أهلاً بك يا أبا أمجد! تم تفعيل اشتراك VIP الخاص بك بنجاح 🎉',
      time: '08:22 ص',
      unread: 2,
      isOfficial: true,
    },
    {
      id: '2',
      name: 'الأميرة ريم',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
      lastMsg: 'شكراً لك على الدعم في روم الشعر، ننتظرك السهرة القادمة!',
      time: 'أمس',
      unread: 1,
      isOfficial: false,
    },
    {
      id: '3',
      name: 'الكابتن علي',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
      lastMsg: 'تم حجز الميكروفون لك في معركة B.K اليوم.',
      time: 'أمس',
      unread: 0,
      isOfficial: false,
    },
  ];

  const handleClearAll = () => {
    setChats([]);
  };

  const handleRestoreChats = () => {
    setChats(initialChats);
  };

  const totalUnread = chats.reduce((acc, curr) => acc + curr.unread, 0);

  return (
    <div className="space-y-4 pb-20 pt-2 px-4" dir="rtl">
      {/* Header & Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-black text-slate-900">مركز الرسائل والإشعارات</h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">تواصل مع أصدقائك وتابع تنبيهات حسابك</p>
        </div>

        {chats.length > 0 ? (
          <button
            onClick={handleClearAll}
            className="text-[11px] font-extrabold text-rose-600 bg-rose-50 hover:bg-rose-100 px-2.5 py-1 rounded-xl border border-rose-200/80 transition-all flex items-center gap-1 cursor-pointer"
            title="اختبار الحالة الفارغة"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>مسح الكل</span>
          </button>
        ) : (
          <button
            onClick={handleRestoreChats}
            className="text-[11px] font-extrabold text-amber-700 bg-amber-50 hover:bg-amber-100 px-2.5 py-1 rounded-xl border border-amber-200/80 transition-all flex items-center gap-1 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>استعادة الرسائل</span>
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTabFilter('chats')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
            activeTabFilter === 'chats'
              ? 'bg-slate-900 text-amber-300 shadow-xs'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>المحادثات المباشرة</span>
          {totalUnread > 0 && (
            <span className="bg-red-500 text-white font-mono text-[9px] px-1.5 py-0.2 rounded-full font-black">
              {totalUnread}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTabFilter('system')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
            activeTabFilter === 'system'
              ? 'bg-slate-900 text-amber-300 shadow-xs'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Bell className="w-3.5 h-3.5" />
          <span>تنبيهات النظام</span>
        </button>
      </div>

      {/* Main Content View */}
      {activeTabFilter === 'chats' ? (
        chats.length > 0 ? (
          <div className="space-y-2">
            <div className="relative mb-3">
              <input
                type="text"
                placeholder="البحث في الرسائل والمحادثات..."
                className="w-full bg-white border border-slate-200/80 rounded-2xl py-2.5 pr-10 pl-4 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400 shadow-xs"
              />
              <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
            </div>

            {chats.map((chat) => (
              <motion.div
                key={chat.id}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="p-3.5 bg-white rounded-2xl border border-slate-100 shadow-xs flex items-center justify-between gap-3 cursor-pointer hover:bg-slate-50 transition-all"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="relative shrink-0">
                    <img src={chat.avatar} alt={chat.name} className="w-11 h-11 rounded-full object-cover border border-slate-200" />
                    {chat.unread > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white font-mono text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-white animate-pulse">
                        {chat.unread}
                      </span>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-black text-slate-900 truncate flex items-center gap-1">
                        <span>{chat.name}</span>
                        {chat.isOfficial && (
                          <span className="text-[9px] bg-amber-400 text-slate-950 font-black px-1.5 py-0.2 rounded-md">
                            رسمي
                          </span>
                        )}
                      </h3>
                      <span className="text-[10px] text-slate-400 font-medium shrink-0">{chat.time}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-bold truncate mt-0.5">{chat.lastMsg}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          /* Friendly Empty State (حالة فارغة) */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="py-12 px-6 bg-white rounded-3xl border border-slate-100 shadow-xs text-center space-y-4 my-2"
          >
            <div className="relative w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-amber-100 via-amber-50 to-orange-100 border border-amber-200/80 flex items-center justify-center shadow-xs">
              <Inbox className="w-10 h-10 text-amber-500" />
              <Sparkles className="w-5 h-5 text-amber-400 absolute top-2 right-2 animate-pulse" />
            </div>

            <div className="space-y-1.5 max-w-xs mx-auto">
              <h3 className="text-base font-black text-slate-900">لا توجد محادثات حالياً 💌</h3>
              <p className="text-xs text-slate-500 font-bold leading-relaxed">
                صندوق الرسائل فارغ ولطيف! استكشف الغرف الصوتية، واكتشف أصدقاء جدد لتلقي أولى رسائلك المميزة.
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2">
              <button
                onClick={handleRestoreChats}
                className="w-full sm:w-auto px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black text-xs shadow-xs hover:opacity-90 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <RefreshCw className="w-4 h-4" />
                <span>عرض محادثات العرض التجريبي</span>
              </button>
            </div>
          </motion.div>
        )
      ) : (
        /* System Notifications Tab */
        <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-xs font-black text-slate-900 border-b border-slate-100 pb-2">
            <Bell className="w-4 h-4 text-amber-500" />
            <span>إشعارات الحساب والنظام</span>
          </div>
          <p className="text-xs text-slate-600 font-bold">
            مرحباً بك! تم تسجيل دخولك بنجاح. استمتع بأجمل الأوقات في الغرف الصوتية والألعاب.
          </p>
        </div>
      )}
    </div>
  );
};

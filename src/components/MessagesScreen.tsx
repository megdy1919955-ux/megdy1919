import React, { useState } from 'react';
import { MessageSquare, Bell, Gift, Sparkles, CheckCheck } from 'lucide-react';
import { MOCK_USERS } from '../data/mockData';

export const MessagesScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'chats' | 'notifications'>('chats');

  const chats = [
    {
      id: 'c1',
      user: MOCK_USERS[2],
      lastMessage: 'شكراً جزيلاً على دعمك الأسطوري في الروم اليوم 👑❤️',
      time: '18:30',
      unread: 2
    },
    {
      id: 'c2',
      user: MOCK_USERS[1],
      lastMessage: 'هل ستكون متواجداً في سهرة الطرب الليلة؟ 🎙️',
      time: '16:15',
      unread: 0
    },
    {
      id: 'c3',
      user: MOCK_USERS[3],
      lastMessage: 'قصيدتك كانت في غاية الجمال والإحساس ✨',
      time: 'أمس',
      unread: 0
    }
  ];

  const notifications = [
    {
      id: 'n1',
      title: 'مكافأة الدخول اليومي 🎁',
      desc: 'تمت إضافة 500 كوينز مجانية إلى محفظتك!',
      time: 'منذ ساعتين',
      icon: '🪙'
    },
    {
      id: 'n2',
      title: 'ترقية مستوى الـ VIP 👑',
      desc: 'تهانينا! لقد وصلت إلى المستوى VIP 8 بنجاح.',
      time: 'منذ يوم',
      icon: '⭐'
    },
    {
      id: 'n3',
      title: 'بطولة سوبر ليجند 🏆',
      desc: 'بدأت الجولة الأسبوعية الجديدة لتحدي الداعمين.',
      time: 'منذ يومين',
      icon: '🔥'
    }
  ];

  return (
    <div className="space-y-4 pb-20 max-w-7xl mx-auto px-4 pt-3">
      {/* Header Tabs */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-amber-400" />
          <h2 className="text-base font-extrabold text-white">الرسائل والإشعارات</h2>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-1 rounded-2xl flex items-center gap-1">
          <button
            onClick={() => setActiveTab('chats')}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'chats' ? 'bg-amber-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'
            }`}
          >
            المحادثات (2)
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'notifications' ? 'bg-amber-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'
            }`}
          >
            النظام (3)
          </button>
        </div>
      </div>

      {/* Chats List */}
      {activeTab === 'chats' ? (
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-3 space-y-2">
          {chats.map((chat) => (
            <div
              key={chat.id}
              className="flex items-center justify-between p-3 rounded-2xl bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800/80 cursor-pointer transition"
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src={chat.user.avatar}
                    alt={chat.user.name}
                    className="w-12 h-12 rounded-full object-cover border border-amber-400/50"
                  />
                  <span className="absolute -bottom-1 -right-1 bg-amber-500 text-slate-950 text-[9px] font-black px-1 rounded-full">
                    VIP{chat.user.vipLevel}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-xs font-bold text-white truncate">{chat.user.name}</h4>
                    <span className="text-xs">{chat.user.countryFlag}</span>
                  </div>
                  <p className="text-xs text-slate-400 truncate mt-0.5 max-w-[180px] sm:max-w-xs">
                    {chat.lastMessage}
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-end gap-1">
                <span className="text-[10px] text-slate-500">{chat.time}</span>
                {chat.unread > 0 ? (
                  <span className="bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {chat.unread}
                  </span>
                ) : (
                  <CheckCheck className="w-3.5 h-3.5 text-slate-500" />
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-3 space-y-2">
          {notifications.map((n) => (
            <div
              key={n.id}
              className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80"
            >
              <span className="text-2xl p-2 bg-slate-900 rounded-xl border border-slate-800">{n.icon}</span>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-amber-300">{n.title}</h4>
                  <span className="text-[10px] text-slate-500">{n.time}</span>
                </div>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">{n.desc}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

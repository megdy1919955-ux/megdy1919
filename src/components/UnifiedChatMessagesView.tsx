import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Bell,
  ChevronLeft,
  Search,
  Send,
  Image as ImageIcon,
  Mic,
  Smile,
  Gift,
  Phone,
  Video,
  Check,
  CheckCheck,
  Headphones,
  Megaphone,
  Sparkles,
  UserPlus,
  Shield,
  Heart,
  ChevronRight,
  Trash2,
  Lock,
  Volume2,
  Building2,
  CornerDownRight,
  Reply,
  ArrowRight,
  Coins,
  Crown,
  Share2,
  MoreVertical,
  Star,
  Pin,
  FolderPlus,
  UserCheck
} from 'lucide-react';

export interface ChatMessageEntry {
  id: string;
  sender: 'me' | 'them';
  text?: string;
  imageUrl?: string;
  audioDuration?: string;
  time: string;
  status: 'sent' | 'delivered' | 'read';
  replyTo?: {
    id: string;
    senderName: string;
    text: string;
  };
}

export interface YoHoChatMessageItem {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  vipLevel?: number;
  nobilityLevel?: string;
  isLive?: boolean;
  isOnline?: boolean;
  isSpecial?: boolean;
  isPinned?: boolean;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount?: number;
  messages: ChatMessageEntry[];
}

export const INITIAL_CHATS_DATA: YoHoChatMessageItem[] = [
  {
    id: 'chat-1',
    senderId: '77989081',
    senderName: 'تت_larit_رف',
    senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
    vipLevel: 8,
    nobilityLevel: 'N1',
    isLive: false,
    isOnline: true,
    isSpecial: true,
    isPinned: true,
    lastMessage: 'شوف الوتس',
    lastMessageTime: '23:01',
    unreadCount: 1,
    messages: [
      { id: 'chat1-m1', sender: 'them', text: 'مساء الخير يا غالي 🌹', time: '22:58', status: 'read' },
      { id: 'chat1-m2', sender: 'me', text: 'أهلاً وسهلاً نوّرتي الروم', time: '22:59', status: 'read' },
      { id: 'chat1-m3', sender: 'them', text: 'شوف الوتس', time: '23:01', status: 'delivered' }
    ]
  },
  {
    id: 'chat-2',
    senderId: '77989082',
    senderName: 'رفيييق',
    senderAvatar: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&q=80&w=300',
    vipLevel: 6,
    nobilityLevel: 'N2',
    isLive: true,
    isOnline: true,
    isSpecial: false,
    lastMessage: 'ايوه',
    lastMessageTime: '23:00',
    unreadCount: 0,
    messages: [
      { id: 'chat2-m1', sender: 'them', text: 'جاهز للجولة القادمة؟', time: '22:45', status: 'read' },
      { id: 'chat2-m2', sender: 'me', text: 'أكيد كلنا في الروم', time: '22:50', status: 'read' },
      { id: 'chat2-m3', sender: 'them', text: 'ايوه', time: '23:00', status: 'read' }
    ]
  },
  {
    id: 'chat-3',
    senderId: '77989083',
    senderName: 'المشرفه سـ. 🅢ـاره',
    senderAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=300',
    vipLevel: 8,
    isLive: true,
    isOnline: true,
    isSpecial: true,
    lastMessage: '[صورة]',
    lastMessageTime: '22:35',
    unreadCount: 2,
    messages: [
      { id: 'chat3-m1', sender: 'them', text: 'السلام عليكم، تم تثبيت خلفية السهرة الجديدة', time: '22:20', status: 'read' },
      {
        id: 'chat3-m2',
        sender: 'them',
        text: 'لقطة شاشة من صدارة الداعمين',
        imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=400',
        time: '22:35',
        status: 'delivered'
      }
    ]
  },
  {
    id: 'chat-4',
    senderId: '77989084',
    senderName: 'عل ⚡ وش 🌾',
    senderAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=300',
    vipLevel: 8,
    nobilityLevel: 'N4',
    isLive: true,
    isOnline: true,
    isSpecial: false,
    lastMessage: 'خذ راحتك',
    lastMessageTime: '21:39',
    unreadCount: 0,
    messages: [
      { id: 'chat4-m1', sender: 'me', text: 'حياك الله يا شيخ، المايك متاح لك بأي وقت', time: '21:30', status: 'read' },
      { id: 'chat4-m2', sender: 'them', text: 'تسلم يالأمير، خذ راحتك', time: '21:39', status: 'read' }
    ]
  }
];

export const AGENCY_NOTIFICATIONS = [
  {
    id: 'agency-1',
    agencyName: 'وكالة النجوم الذهبية 🌟',
    agencyId: 'AG-9902',
    date: 'اليوم 18:30',
    title: 'تم تحويل عمولة أرباح البث اليومية 💰',
    desc: 'تم إيداع 45,000 كوينز + 2,400 ماسة في محفظتك كأرباح نشاط الاستضافة للأسبوع الحالي.',
    badge: 'عمولة معتمدة',
    amount: '45,000 🪙'
  },
  {
    id: 'agency-2',
    agencyName: 'إدارة وكالات سوبر الرسمية 👑',
    agencyId: 'AG-OFFICIAL',
    date: 'أمس 14:15',
    title: 'ترقية رتبة الوكيل الماسي N1 💎',
    desc: 'تهانينا! حققت غرفتك أكثر من 500,000 نقطة دعم هذا الشهر وتم رفع تصنيف وكالتك إلى المستوى الأول.',
    badge: 'ترقية رسمية',
    amount: 'المستوى N1'
  },
  {
    id: 'agency-3',
    agencyName: 'وكالة صقور الخليج 🦅',
    agencyId: 'AG-3310',
    date: 'منذ يومين',
    title: 'دعوة انضمام مضيف مميز 🎙️',
    desc: 'تدعوك وكالة صقور الخليج للانضمام لفريق المذيعين مع راتب تعاقدي وحوافز شهرية.',
    badge: 'دعوة عقد',
    amount: 'بونص 30%'
  }
];

export const GIFT_MESSAGES_LOGS = [
  {
    id: 'gift-log-1',
    senderName: 'الأسطورة خالد 🦁',
    senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    giftName: 'قلعة الأساطير الذهبية 🏰',
    giftIcon: '🏰',
    roomName: 'روم السهرة والنغم 🎵',
    value: 50000,
    time: 'منذ 10 دقائق',
    refundWon: 25000
  },
  {
    id: 'gift-log-2',
    senderName: 'الملكة ديالا 👑',
    senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    giftName: 'التاج الملكي الفاخر 👑',
    giftIcon: '👑',
    roomName: 'روم السهرة والنغم 🎵',
    value: 20000,
    time: 'منذ 45 دقيقة',
    refundWon: 0
  },
  {
    id: 'gift-log-3',
    senderName: 'المشرفه سـ. 🅢ـاره',
    senderAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200',
    giftName: 'سيارة الفيراري النارية 🏎️',
    giftIcon: '🏎️',
    roomName: 'تحدي الفرق PK 🔥',
    value: 35000,
    time: 'اليوم 19:20',
    refundWon: 17500
  },
  {
    id: 'gift-log-4',
    senderName: 'الكابتن فهد ⚡',
    senderAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
    giftName: 'طائر الفينيق الأسطوري 🦅',
    giftIcon: '🦅',
    roomName: 'روم السهرة والنغم 🎵',
    value: 15000,
    time: 'أمس 22:10',
    refundWon: 7500
  }
];

interface UnifiedChatMessagesViewProps {
  isModalMode?: boolean;
  onCloseModal?: () => void;
  onOpenUserProfile?: (user: any) => void;
}

export const UnifiedChatMessagesView: React.FC<UnifiedChatMessagesViewProps> = ({
  isModalMode = false,
  onCloseModal,
  onOpenUserProfile
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'special'>('all');
  const [activeCategoryModal, setActiveCategoryModal] = useState<
    'agency' | 'gifts' | 'friend-requests' | 'super-team' | 'promo' | 'online-support' | null
  >(null);

  const [activeChat, setActiveChat] = useState<YoHoChatMessageItem | null>(null);
  const [chatList, setChatList] = useState<YoHoChatMessageItem[]>(() => {
    try {
      const saved = localStorage.getItem('yoho_room_chats_list');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_CHATS_DATA;
  });

  const [selectedChatForOptions, setSelectedChatForOptions] = useState<YoHoChatMessageItem | null>(null);
  const [inputMessage, setInputMessage] = useState('');
  const [replyingToMessage, setReplyingToMessage] = useState<{
    id: string;
    senderName: string;
    text: string;
  } | null>(null);

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Sync with global custom event
  useEffect(() => {
    const handleSync = () => {
      try {
        const saved = localStorage.getItem('yoho_room_chats_list');
        if (saved) setChatList(JSON.parse(saved));
      } catch (err) {}
    };

    window.addEventListener('chat_messages_updated', handleSync);
    return () => window.removeEventListener('chat_messages_updated', handleSync);
  }, []);

  // Save to localStorage & broadcast
  const saveChats = (newChats: YoHoChatMessageItem[]) => {
    setChatList(newChats);
    try {
      localStorage.setItem('yoho_room_chats_list', JSON.stringify(newChats));
      window.dispatchEvent(new CustomEvent('chat_messages_updated', { detail: newChats }));
    } catch (e) {}
  };

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Scroll to bottom when messages update
  useEffect(() => {
    if (activeChat) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeChat?.messages]);

  // Handle Send Message with Reply Support
  const handleSendMessage = () => {
    if (!inputMessage.trim() || !activeChat) return;

    const randomSuffix = Math.random().toString(36).substring(2, 9);
    const newMsg: ChatMessageEntry = {
      id: `msg-${Date.now()}-${randomSuffix}`,
      sender: 'me',
      text: inputMessage.trim(),
      time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
      status: 'sent',
      ...(replyingToMessage ? { replyTo: replyingToMessage } : {})
    };

    const updatedMessages = [...activeChat.messages, newMsg];
    const updatedChat: YoHoChatMessageItem = {
      ...activeChat,
      lastMessage: inputMessage.trim(),
      lastMessageTime: newMsg.time,
      unreadCount: 0,
      messages: updatedMessages
    };

    setActiveChat(updatedChat);
    const updatedList = chatList.map((c) => (c.id === activeChat.id ? updatedChat : c));
    saveChats(updatedList);
    setInputMessage('');
    setReplyingToMessage(null);

    // Simulated reply after 1.5s
    setTimeout(() => {
      const replySuffix = Math.random().toString(36).substring(2, 9);
      const replyMsg: ChatMessageEntry = {
        id: `msg-reply-${Date.now()}-${replySuffix}`,
        sender: 'them',
        text: 'يسعد مساك يا غالي 🌹 تحياتي لك ولأهل الروم!',
        time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
        status: 'delivered'
      };

      setChatList((prevList) => {
        const newList = prevList.map((c) => {
          if (c.id === updatedChat.id) {
            const withReply = {
              ...c,
              lastMessage: replyMsg.text || '',
              lastMessageTime: replyMsg.time,
              messages: [...c.messages, replyMsg]
            };
            if (activeChat && activeChat.id === c.id) {
              setActiveChat(withReply);
            }
            return withReply;
          }
          return c;
        });
        try {
          localStorage.setItem('yoho_room_chats_list', JSON.stringify(newList));
          window.dispatchEvent(new CustomEvent('chat_messages_updated', { detail: newList }));
        } catch (e) {}
        return newList;
      });
    }, 1500);
  };

  // Trigger reply mode on message
  const handleTriggerReply = (msg: ChatMessageEntry) => {
    const senderName = msg.sender === 'me' ? 'أنت' : activeChat?.senderName || 'الصديق';
    const textPreview = msg.text || (msg.imageUrl ? '[صورة]' : '[تسجيل صوتي]');
    setReplyingToMessage({
      id: msg.id,
      senderName,
      text: textPreview
    });
    showToast(`تم التحديد للرد على: ${textPreview.slice(0, 20)}... ↩️`);
  };

  // Chat Actions: Clear Chat, Move to Special, Pin
  const handleClearChat = (chat: YoHoChatMessageItem) => {
    const updatedList = chatList.map((c) => {
      if (c.id === chat.id) {
        return {
          ...c,
          lastMessage: 'تم مسح سجل المحادثة',
          unreadCount: 0,
          messages: []
        };
      }
      return c;
    });
    saveChats(updatedList);
    if (activeChat && activeChat.id === chat.id) {
      setActiveChat({
        ...activeChat,
        lastMessage: 'تم مسح سجل المحادثة',
        unreadCount: 0,
        messages: []
      });
    }
    setSelectedChatForOptions(null);
    showToast(`تم مسح الدردشة مع ${chat.senderName} بنجاح 🗑️`);
  };

  const handleToggleSpecialChat = (chat: YoHoChatMessageItem) => {
    const willBeSpecial = !chat.isSpecial;
    const updatedList = chatList.map((c) => (c.id === chat.id ? { ...c, isSpecial: willBeSpecial } : c));
    saveChats(updatedList);
    setSelectedChatForOptions(null);
    showToast(
      willBeSpecial
        ? `تم نقل ${chat.senderName} إلى قائمة (متابعة خاصة) ⭐`
        : `تمت الإزالة من (متابعة خاصة)`
    );
  };

  const handleTogglePinChat = (chat: YoHoChatMessageItem) => {
    const willBePinned = !chat.isPinned;
    const updatedList = chatList.map((c) => (c.id === chat.id ? { ...c, isPinned: willBePinned } : c));
    saveChats(updatedList);
    setSelectedChatForOptions(null);
    showToast(willBePinned ? `تم تثبيت المحادثة في الأعلى 📌` : `تم إلغاء تثبيت المحادثة`);
  };

  const filteredChats = chatList
    .filter((chat) => (activeFilter === 'special' ? chat.isSpecial : true))
    .sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0));

  return (
    <div className="w-full h-full flex flex-col bg-white text-slate-900 select-none dir-rtl relative overflow-hidden">
      {/* 1. ACTIVE DIRECT CHAT VIEW */}
      {activeChat ? (
        <div className="flex flex-col h-full bg-[#F8F9FA]">
          {/* Chat Top Header */}
          <div className="bg-white border-b border-slate-100 px-4 py-3 flex items-center justify-between shadow-xs shrink-0 z-10">
            <div className="flex items-center gap-3">
              <button
                id="btn-back-from-chat"
                onClick={() => {
                  setActiveChat(null);
                  setReplyingToMessage(null);
                }}
                className="p-1.5 -mr-2 rounded-full text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <ChevronRight className="w-6 h-6 stroke-[2.5]" />
              </button>

              <div
                className="relative cursor-pointer"
                onClick={() => onOpenUserProfile?.(activeChat)}
              >
                <img
                  src={activeChat.senderAvatar}
                  alt={activeChat.senderName}
                  className="w-10 h-10 rounded-full object-cover border border-slate-200"
                />
                {activeChat.isOnline && (
                  <span className="absolute bottom-0 left-0 w-3 h-3 bg-[#00c765] border-2 border-white rounded-full" />
                )}
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-black text-slate-900 text-sm">{activeChat.senderName}</span>
                  {activeChat.vipLevel && (
                    <span className="bg-gradient-to-r from-amber-500 to-yellow-400 text-black text-[9px] font-black px-1.5 py-0.2 rounded-md font-mono">
                      VIP{activeChat.vipLevel}
                    </span>
                  )}
                  {activeChat.nobilityLevel && (
                    <span className="bg-gradient-to-r from-slate-700 to-zinc-900 text-emerald-300 border border-emerald-400/30 text-[9px] font-black px-1.5 py-0.2 rounded-md font-mono">
                      🛡️ {activeChat.nobilityLevel}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-[#00c765] font-semibold">متصل الآن 🟢</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setSelectedChatForOptions(activeChat)}
                className="p-2 rounded-full text-slate-500 hover:bg-slate-100 transition-colors cursor-pointer"
                title="خيارات الدردشة"
              >
                <MoreVertical className="w-4 h-4" />
              </button>
              <button
                onClick={() => showToast('جاري الاتصال الصوتي 📞')}
                className="p-2 rounded-full text-slate-500 hover:bg-slate-100 transition-colors"
                title="اتصال صوتي"
              >
                <Phone className="w-4 h-4" />
              </button>
              <button
                onClick={() => showToast('جاري الاتصال المرئي 📹')}
                className="p-2 rounded-full text-slate-500 hover:bg-slate-100 transition-colors"
                title="اتصال فيديو"
              >
                <Video className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Swipe Hint Banner */}
          <div className="bg-emerald-50/70 border-b border-emerald-100/60 px-4 py-1.5 text-center text-[10px] text-emerald-700 font-bold flex items-center justify-center gap-1.5 shrink-0">
            <CornerDownRight className="w-3.5 h-3.5" />
            <span>اسحب أي رسالة لليمين للرد عليها فوراً 💬</span>
          </div>

          {/* Messages Bubble Feed */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
            <div className="text-center my-1">
              <span className="bg-slate-200/70 text-slate-500 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                محادثة مشفرة وآمنة 🔒
              </span>
            </div>

            {activeChat.messages.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <Sparkles className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                <p className="text-xs font-bold">لا توجد رسائل سابقة</p>
                <p className="text-[11px] text-slate-400 mt-1">ابدأ المحادثة الآن!</p>
              </div>
            ) : (
              activeChat.messages.map((msg, idx) => {
                const isMe = msg.sender === 'me';
                return (
                  <div
                    key={`${msg.id || 'msg'}-${idx}`}
                    className={`flex flex-col relative ${isMe ? 'items-start' : 'items-end'} group`}
                  >
                    {/* Swipe-to-reply interactive wrapper */}
                    <motion.div
                      drag="x"
                      dragConstraints={{ left: 0, right: 90 }}
                      dragElastic={0.2}
                      onDragEnd={(_, info) => {
                        if (info.offset.x > 45 || info.velocity.x > 200) {
                          handleTriggerReply(msg);
                        }
                      }}
                      className="relative touch-pan-y cursor-grab active:cursor-grabbing max-w-[82%]"
                    >
                      {/* Visual swipe reply indicator behind the bubble */}
                      <div className="absolute -left-8 top-1/2 -translate-y-1/2 text-[#00c765] opacity-0 group-hover:opacity-60 transition-opacity">
                        <Reply className="w-4 h-4 -scale-x-100" />
                      </div>

                      <div
                        className={`rounded-2xl p-3 shadow-xs transition-all ${
                          isMe
                            ? 'bg-[#00c765] text-white rounded-tr-xs'
                            : 'bg-white text-slate-800 border border-slate-100 rounded-tl-xs'
                        }`}
                      >
                        {/* Quoted / Replied Message Header if present */}
                        {msg.replyTo && (
                          <div
                            className={`mb-2 p-2 rounded-xl text-xs border-r-4 ${
                              isMe
                                ? 'bg-black/15 text-white/90 border-white/80'
                                : 'bg-slate-100 text-slate-700 border-[#00c765]'
                            }`}
                          >
                            <span className="text-[10px] font-black block opacity-80 mb-0.5">
                              ↩️ رداً على: {msg.replyTo.senderName}
                            </span>
                            <p className="truncate text-[11px] font-medium">{msg.replyTo.text}</p>
                          </div>
                        )}

                        {/* Message Image */}
                        {msg.imageUrl && (
                          <div className="mb-2 rounded-xl overflow-hidden shadow-xs">
                            <img src={msg.imageUrl} alt="attached" className="w-full h-auto object-cover max-h-48" />
                          </div>
                        )}

                        {/* Message Text */}
                        {msg.text && <p className="text-sm font-medium leading-relaxed select-text">{msg.text}</p>}

                        {/* Time & Read Status */}
                        <div
                          className={`flex items-center gap-1 text-[10px] mt-1 ${
                            isMe ? 'text-white/80 justify-start' : 'text-slate-400 justify-end'
                          }`}
                        >
                          <span className="font-mono">{msg.time}</span>
                          {isMe && (
                            <span>
                              {msg.status === 'read' ? (
                                <CheckCheck className="w-3.5 h-3.5 text-white stroke-[2.5]" />
                              ) : (
                                <Check className="w-3.5 h-3.5 text-white/70" />
                              )}
                            </span>
                          )}

                          {/* Quick Tap Reply Button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleTriggerReply(msg);
                            }}
                            className="opacity-0 group-hover:opacity-100 p-0.5 rounded-full hover:bg-black/10 transition-opacity ml-1 cursor-pointer"
                            title="رد"
                          >
                            <Reply className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Reply Preview Bar above Input */}
          {replyingToMessage && (
            <div className="px-4 py-2 bg-emerald-50 border-t border-emerald-200 flex items-center justify-between text-xs text-slate-800 shrink-0">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <CornerDownRight className="w-4 h-4 text-[#00c765] shrink-0" />
                <div className="truncate">
                  <span className="font-bold text-[#00c765]">الرد على {replyingToMessage.senderName}: </span>
                  <span className="text-slate-600 truncate">{replyingToMessage.text}</span>
                </div>
              </div>
              <button
                onClick={() => setReplyingToMessage(null)}
                className="w-5 h-5 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-600 flex items-center justify-center shrink-0 ml-2 cursor-pointer"
                title="إلغاء الرد"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}

          {/* Chat Input Bar */}
          <div className="p-3 bg-white border-t border-slate-100 flex items-center gap-2 shrink-0">
            <button
              onClick={() => showToast('إرسال هدية في المحادثة 🎁')}
              className="p-2 rounded-full text-amber-500 hover:bg-amber-50 transition-colors"
            >
              <Gift className="w-5 h-5" />
            </button>
            <div className="flex-1 relative bg-slate-100 rounded-full flex items-center px-3 py-1.5 border border-slate-200">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder={replyingToMessage ? 'اكتب ردك هنا...' : 'اكتب رسالة... (أو اسحب رسالة للرد)'}
                className="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400 font-medium"
              />
              <button className="text-slate-400 hover:text-slate-600 ml-1">
                <Smile className="w-4 h-4" />
              </button>
            </div>
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim()}
              className={`p-2.5 rounded-full flex items-center justify-center transition-transform active:scale-90 ${
                inputMessage.trim()
                  ? 'bg-[#00c765] text-white shadow-md cursor-pointer'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <Send className="w-4 h-4 -scale-x-100" />
            </button>
          </div>
        </div>
      ) : (
        /* 2. MAIN CHAT DIRECTORY VIEW */
        <div className="flex flex-col h-full bg-white">
          {/* Header Row: With "دردشة" and the 2 Mini Rectangular Badges for Agency & Gift Messages */}
          <div className="pt-3 pb-2 px-4 bg-white flex items-center justify-between shrink-0 border-b border-slate-50">
            {/* Left Controls (Close / Emoji) */}
            <div className="flex items-center gap-1.5">
              {isModalMode && (
                <button
                  id="btn-close-chat-sheet"
                  onClick={onCloseModal}
                  className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4 stroke-[2.2]" />
                </button>
              )}

              <button
                onClick={() => showToast('تعبيرات ورموز الرد السريع 🤭')}
                className="flex items-center gap-1 bg-slate-50 hover:bg-slate-100 px-2 py-0.8 rounded-full text-slate-500 text-xs font-bold border border-slate-100 transition-colors"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span className="text-sm">🤭</span>
              </button>
            </div>

            {/* Right Side: "دردشة" + TWO MINI RECTANGLE BUTTONS SIDE-BY-SIDE */}
            <div className="flex items-center gap-2">
              {/* Mini Button 1: رسالة الوكالة */}
              <button
                id="btn-agency-messages-header"
                onClick={() => setActiveCategoryModal('agency')}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-gradient-to-r from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 border border-purple-200 text-purple-900 active:scale-95 transition-all shadow-2xs cursor-pointer group"
                title="رسائل وإشعارات الوكالة"
              >
                <div className="w-4.5 h-4.5 rounded-md bg-purple-600 text-white flex items-center justify-center shadow-xs">
                  <Building2 className="w-3 h-3 stroke-[2.5]" />
                </div>
                <span className="text-[11px] font-black tracking-tight whitespace-nowrap">
                  رسائل الوكالة
                </span>
              </button>

              {/* Mini Button 2: رسالة الهدايا */}
              <button
                id="btn-gift-messages-header"
                onClick={() => setActiveCategoryModal('gifts')}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-gradient-to-r from-rose-50 to-rose-100 hover:from-rose-100 hover:to-rose-200 border border-rose-200 text-rose-900 active:scale-95 transition-all shadow-2xs cursor-pointer group"
                title="سجل ورسائل الهدايا"
              >
                <div className="w-4.5 h-4.5 rounded-md bg-[#FF4D61] text-white flex items-center justify-center shadow-xs">
                  <Gift className="w-3 h-3 stroke-[2.5]" />
                </div>
                <span className="text-[11px] font-black tracking-tight whitespace-nowrap">
                  رسائل الهدايا
                </span>
              </button>

              {/* Main Title: دردشة */}
              <h2 className="text-lg font-black text-slate-900 tracking-tight mr-1">دردشة</h2>
            </div>
          </div>

          {/* TOP CATEGORIES ROW (طلبات الصداقة, فريق سوبر, العرض الترويجي, دردشة عبر الإنترنت) */}
          <div className="px-4 py-2 overflow-x-auto custom-scrollbar flex items-center justify-between gap-2 shrink-0 select-none">
            {/* 1. طلبات الصداقة */}
            <button
              onClick={() => setActiveCategoryModal('friend-requests')}
              className="flex-1 flex flex-col items-center justify-between p-2 rounded-2xl bg-[#F3EEFF] hover:bg-[#ECE5FF] active:scale-95 transition-all min-w-[72px] h-[86px] shrink-0 border border-purple-100/60 cursor-pointer shadow-2xs"
            >
              <div className="w-9 h-9 flex items-center justify-center text-xl drop-shadow-xs">
                🖐️
              </div>
              <span className="text-[10.5px] font-black text-slate-800 text-center leading-tight">
                طلبات<br />الصداقة
              </span>
            </button>

            {/* 2. فريق سوبر (Super Team) */}
            <button
              id="btn-super-team"
              onClick={() => setActiveCategoryModal('super-team')}
              className="flex-1 flex flex-col items-center justify-between p-2 rounded-2xl bg-[#E8F8F0] hover:bg-[#DCF3E7] active:scale-95 transition-all min-w-[72px] h-[86px] shrink-0 border border-emerald-100/60 cursor-pointer shadow-2xs group"
            >
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-500 via-teal-400 to-cyan-500 p-0.5 shadow-xs flex items-center justify-center group-hover:scale-105 transition-transform">
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                  <span className="text-[9.5px] font-black bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
                    سوبر
                  </span>
                </div>
              </div>
              <span className="text-[10.5px] font-black text-slate-800 text-center leading-tight">
                فريق<br />سوبر
              </span>
            </button>

            {/* 3. العرض الترويجي */}
            <button
              onClick={() => setActiveCategoryModal('promo')}
              className="flex-1 flex flex-col items-center justify-between p-2 rounded-2xl bg-[#FFF5E5] hover:bg-[#FEEDD2] active:scale-95 transition-all min-w-[72px] h-[86px] shrink-0 border border-amber-100/60 cursor-pointer shadow-2xs"
            >
              <div className="w-9 h-9 flex items-center justify-center text-xl drop-shadow-xs">
                📢
              </div>
              <span className="text-[10.5px] font-black text-slate-800 text-center leading-tight">
                العرض<br />الترويجي
              </span>
            </button>

            {/* 4. دردشة عبر الإنترنت */}
            <button
              onClick={() => setActiveCategoryModal('online-support')}
              className="flex-1 flex flex-col items-center justify-between p-2 rounded-2xl bg-[#EBF5FF] hover:bg-[#E0EFFE] active:scale-95 transition-all min-w-[72px] h-[86px] shrink-0 border border-blue-100/60 cursor-pointer shadow-2xs"
            >
              <div className="w-9 h-9 rounded-full bg-blue-500 text-white flex items-center justify-center shadow-xs">
                <Headphones className="w-4.5 h-4.5 stroke-[2.2]" />
              </div>
              <span className="text-[10.5px] font-black text-slate-800 text-center leading-tight">
                دردشة عبر<br />الإنترنت
              </span>
            </button>
          </div>

          {/* Filter Pills (الكل | متابعة خاصة) */}
          <div className="px-5 pt-2.5 pb-1 flex items-center justify-start gap-2 shrink-0">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-4 py-1 rounded-full text-xs font-black transition-all cursor-pointer ${
                activeFilter === 'all'
                  ? 'bg-[#E7F8EE] text-[#00C765] shadow-xs'
                  : 'bg-[#F4F5F7] text-slate-400 hover:text-slate-600'
              }`}
            >
              الكل
            </button>
            <button
              onClick={() => setActiveFilter('special')}
              className={`px-4 py-1 rounded-full text-xs font-black transition-all cursor-pointer flex items-center gap-1 ${
                activeFilter === 'special'
                  ? 'bg-[#E7F8EE] text-[#00C765] shadow-xs'
                  : 'bg-[#F4F5F7] text-slate-400 hover:text-slate-600'
              }`}
            >
              <Star className="w-3 h-3" />
              <span>متابعة خاصة</span>
            </button>
          </div>

          {/* Notification Permission Banner */}
          <div className="px-4 py-2 shrink-0">
            <div
              onClick={() => {
                setNotificationsEnabled(!notificationsEnabled);
                showToast(notificationsEnabled ? 'تم كتم الإشعارات' : 'تم تفعيل إشعارات الرسائل 🔔');
              }}
              className="bg-[#FAFAFA] hover:bg-slate-100/80 border border-slate-100 rounded-2xl p-3 flex items-center justify-between cursor-pointer transition-colors shadow-2xs"
            >
              <ChevronLeft className="w-4 h-4 text-slate-400 shrink-0" />
              <div className="flex-1 text-right pr-3">
                <h4 className="text-xs sm:text-sm font-black text-slate-900 leading-snug">
                  إخطاري بالرسائل الجديدة
                </h4>
                <p className="text-[11px] text-slate-400 font-medium mt-0.5 leading-tight">
                  لا تفوّت الرسائل أو آخر أخبار الأصدقاء.
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-[#FF4D61] text-white flex items-center justify-center shadow-md shrink-0">
                <Bell className="w-5 h-5 fill-white stroke-[1.5]" />
              </div>
            </div>
          </div>

          {/* Conversation List */}
          <div className="flex-1 overflow-y-auto px-4 pb-6 divide-y divide-slate-100 custom-scrollbar">
            {filteredChats.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <Star className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                <p className="text-xs font-bold">لا توجد محادثات في هذا القسم</p>
                <p className="text-[11px] text-slate-400 mt-1">اضغط مطولاً على أي محادثة لنقلها إلى (متابعة خاصة)</p>
              </div>
            ) : (
              filteredChats.map((chat) => (
                <div
                  key={chat.id}
                  onClick={() => setActiveChat(chat)}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    setSelectedChatForOptions(chat);
                  }}
                  className={`py-3 px-1.5 flex items-center justify-between hover:bg-slate-50/80 rounded-2xl cursor-pointer transition-colors group relative ${
                    chat.isPinned ? 'bg-amber-50/30' : ''
                  }`}
                >
                  {/* Timestamp & Unread Badge & Options Button */}
                  <div className="flex flex-col items-start gap-1 shrink-0 pl-1">
                    <div className="flex items-center gap-1">
                      {chat.isPinned && <Pin className="w-3 h-3 text-amber-500 -rotate-45" />}
                      <span className="text-[11px] font-semibold text-slate-400 font-mono">
                        {chat.lastMessageTime}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 mt-0.5">
                      {chat.unreadCount && chat.unreadCount > 0 ? (
                        <span className="bg-[#FF4D61] text-white text-[10px] font-black px-1.5 py-0.2 rounded-full min-w-4 text-center shadow-xs">
                          {chat.unreadCount}
                        </span>
                      ) : null}

                      {/* Quick 3-Dots Action Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedChatForOptions(chat);
                        }}
                        className="opacity-60 group-hover:opacity-100 p-1 rounded-full hover:bg-slate-200 text-slate-500 transition-all cursor-pointer"
                        title="إدارة ومسح الدردشة أو نقلها"
                      >
                        <MoreVertical className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Content & Name */}
                  <div className="flex-1 text-right px-3 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap justify-start">
                      {chat.isSpecial && (
                        <span className="bg-amber-100 text-amber-800 text-[9px] font-black px-1.5 py-0.2 rounded-md flex items-center gap-0.5">
                          <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
                          خاص
                        </span>
                      )}

                      {chat.vipLevel && (
                        <span className="bg-gradient-to-r from-zinc-900 to-black text-amber-300 border border-amber-400/40 text-[9px] font-black px-1.5 py-0.2 rounded-md font-mono flex items-center gap-0.5 shadow-2xs">
                          <span className="italic">VIP</span>
                          <span>{chat.vipLevel}</span>
                        </span>
                      )}

                      {chat.nobilityLevel && (
                        <span className="bg-gradient-to-r from-slate-700 via-slate-800 to-zinc-900 text-emerald-300 border border-emerald-400/30 text-[9px] font-black px-1.5 py-0.2 rounded-md font-mono flex items-center gap-0.5 shadow-2xs">
                          <span>🛡️</span>
                          <span>{chat.nobilityLevel}</span>
                        </span>
                      )}

                      <span className="text-sm font-black text-slate-900 truncate">
                        {chat.senderName}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 font-medium truncate mt-1 leading-normal">
                      {chat.lastMessage}
                    </p>
                  </div>

                  {/* Avatar with Live / Online Badges */}
                  <div className="relative shrink-0">
                    <img
                      src={chat.senderAvatar}
                      alt={chat.senderName}
                      className="w-12 h-12 rounded-full object-cover border-2 border-slate-100 shadow-xs group-hover:scale-105 transition-transform"
                    />

                    {chat.isOnline && (
                      <span className="absolute top-0 right-0 w-3 h-3 bg-[#00c765] border-2 border-white rounded-full" />
                    )}

                    {chat.isLive && (
                      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-[8px] font-black px-1.5 py-0.2 rounded-full shadow-xs uppercase tracking-tight border border-white">
                        LIVE
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* 3. CHAT OPTIONS BOTTOM SHEET / ACTION DIALOG (مسح الدردشة / نقل إلى المتخصص دردشة خاصة) */}
      <AnimatePresence>
        {selectedChatForOptions && (
          <div
            className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-end justify-center select-none"
            onClick={() => setSelectedChatForOptions(null)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 280 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg bg-white rounded-t-3xl p-5 shadow-2xl space-y-4 dir-rtl"
            >
              {/* Header Info */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <img
                    src={selectedChatForOptions.senderAvatar}
                    alt={selectedChatForOptions.senderName}
                    className="w-11 h-11 rounded-full object-cover border-2 border-slate-200"
                  />
                  <div>
                    <h3 className="font-black text-slate-900 text-sm">
                      {selectedChatForOptions.senderName}
                    </h3>
                    <p className="text-[11px] text-slate-400">خيارات إدارة المحادثة والرسائل</p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedChatForOptions(null)}
                  className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Action Buttons List */}
              <div className="space-y-2">
                {/* 1. مسح الدردشة (Clear Chat) */}
                <button
                  id="btn-action-clear-chat"
                  onClick={() => handleClearChat(selectedChatForOptions)}
                  className="w-full p-3.5 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-black text-sm flex items-center justify-between transition-colors border border-rose-100 cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-rose-600 text-white flex items-center justify-center shadow-xs">
                      <Trash2 className="w-4 h-4" />
                    </div>
                    <div className="text-right">
                      <span className="block">مسح الدردشة 🗑️</span>
                      <span className="text-[10px] text-rose-500 font-normal">حذف جميع الرسائل السابقة لهذا الصديق</span>
                    </div>
                  </div>
                  <ChevronLeft className="w-4 h-4 text-rose-400 group-hover:-translate-x-1 transition-transform" />
                </button>

                {/* 2. نقل إلى المتخصص / دردشة خاصة (Move to Special / Private Chat) */}
                <button
                  id="btn-action-special-chat"
                  onClick={() => handleToggleSpecialChat(selectedChatForOptions)}
                  className="w-full p-3.5 rounded-2xl bg-amber-50 hover:bg-amber-100 text-amber-900 font-black text-sm flex items-center justify-between transition-colors border border-amber-200/80 cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-xs">
                      <Star className="w-4 h-4 fill-white" />
                    </div>
                    <div className="text-right">
                      <span className="block">
                        {selectedChatForOptions.isSpecial
                          ? 'إلغاء النقل من المتابعة الخاصة'
                          : 'نقل إلى المتخصص (دردشة خاصة) ⭐'}
                      </span>
                      <span className="text-[10px] text-amber-700 font-normal">
                        {selectedChatForOptions.isSpecial
                          ? 'إعادة المحادثة للقسم العام'
                          : 'تمييز الصديق وتخصيص تبويب متابعة خاصة له'}
                      </span>
                    </div>
                  </div>
                  <ChevronLeft className="w-4 h-4 text-amber-400 group-hover:-translate-x-1 transition-transform" />
                </button>

                {/* 3. تثبيت المحادثة في الأعلى */}
                <button
                  onClick={() => handleTogglePinChat(selectedChatForOptions)}
                  className="w-full p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-800 font-black text-sm flex items-center justify-between transition-colors border border-slate-100 cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-slate-700 text-white flex items-center justify-center shadow-xs">
                      <Pin className="w-4 h-4" />
                    </div>
                    <div className="text-right">
                      <span className="block">
                        {selectedChatForOptions.isPinned ? 'إلغاء تثبيت المحادثة' : 'تثبيت المحادثة في الأعلى 📌'}
                      </span>
                      <span className="text-[10px] text-slate-500 font-normal">إبقاء المحادثة في أول القائمة دائماً</span>
                    </div>
                  </div>
                  <ChevronLeft className="w-4 h-4 text-slate-400 group-hover:-translate-x-1 transition-transform" />
                </button>

                {/* 4. عرض الملف الشخصي */}
                <button
                  onClick={() => {
                    const user = selectedChatForOptions;
                    setSelectedChatForOptions(null);
                    onOpenUserProfile?.(user);
                  }}
                  className="w-full p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-800 font-black text-sm flex items-center justify-between transition-colors border border-slate-100 cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-[#00C765] text-white flex items-center justify-center shadow-xs">
                      <UserCheck className="w-4 h-4" />
                    </div>
                    <div className="text-right">
                      <span className="block">عرض الملف الشخصي 👤</span>
                      <span className="text-[10px] text-slate-500 font-normal">مشاهدة الهدايا، الرتبة، ومعرف المستخدم</span>
                    </div>
                  </div>
                  <ChevronLeft className="w-4 h-4 text-slate-400 group-hover:-translate-x-1 transition-transform" />
                </button>
              </div>

              {/* Cancel Button */}
              <button
                onClick={() => setSelectedChatForOptions(null)}
                className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl text-xs transition-colors cursor-pointer"
              >
                إلغاء
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 4. CATEGORY SUB-MODALS (Agency, Gifts, Super Team, Friend Requests, Promo, Support) */}
      <AnimatePresence>
        {activeCategoryModal && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute inset-0 z-50 bg-white flex flex-col p-4 select-none dir-rtl"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                {activeCategoryModal === 'agency' && <Building2 className="w-5 h-5 text-purple-600" />}
                {activeCategoryModal === 'gifts' && <Gift className="w-5 h-5 text-[#FF4D61]" />}
                {activeCategoryModal === 'super-team' && <Crown className="w-5 h-5 text-emerald-600" />}
                <h3 className="font-black text-slate-900 text-base">
                  {activeCategoryModal === 'agency' && 'رسائل وإشعارات الوكالة 🏢'}
                  {activeCategoryModal === 'gifts' && 'سجل ورسائل الهدايا المستلمة 🎁'}
                  {activeCategoryModal === 'super-team' && 'إعلانات فريق سوبر الرسمي 🌟'}
                  {activeCategoryModal === 'friend-requests' && 'طلبات الصداقة 🖐️'}
                  {activeCategoryModal === 'promo' && 'العروض الترويجية والهدايا 📢'}
                  {activeCategoryModal === 'online-support' && 'خدمة العملاء عبر الإنترنت 🎧'}
                </h3>
              </div>

              <button
                onClick={() => setActiveCategoryModal(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-3 space-y-3 custom-scrollbar">
              {/* SUB-MODAL 1: رسائل الوكالة */}
              {activeCategoryModal === 'agency' && (
                <div className="space-y-3">
                  <div className="p-3 bg-purple-50 rounded-2xl border border-purple-100 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-black text-purple-900 block">حالة حساب الوكالة: نشط وموثق 👑</span>
                      <span className="text-[10px] text-purple-700">معرف الوكالة: AG-884920 (وكالة القمة)</span>
                    </div>
                    <span className="bg-purple-600 text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-xs">
                      الرتبة N1
                    </span>
                  </div>

                  {AGENCY_NOTIFICATIONS.map((item) => (
                    <div
                      key={item.id}
                      className="p-3.5 bg-white border border-slate-100 rounded-2xl shadow-xs hover:border-purple-200 transition-all space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-slate-900">{item.title}</span>
                        <span className="text-[10px] font-bold text-slate-400">{item.date}</span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed font-medium">{item.desc}</p>
                      <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                        <span className="text-[10px] font-black text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md">
                          {item.badge}
                        </span>
                        <span className="text-xs font-black text-amber-600 font-mono">{item.amount}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* SUB-MODAL 2: رسائل الهدايا */}
              {activeCategoryModal === 'gifts' && (
                <div className="space-y-3">
                  <div className="p-3 bg-rose-50 rounded-2xl border border-rose-100 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-black text-rose-900 block">إجمالي هدايا اليوم 🎁</span>
                      <span className="text-[10px] text-rose-700">تم استقبال 4 هدايا أسطورية بقيمة 120,000 كوينز</span>
                    </div>
                    <span className="bg-[#FF4D61] text-white text-xs font-mono font-black px-2.5 py-1 rounded-full shadow-xs">
                      120,000 🪙
                    </span>
                  </div>

                  {GIFT_MESSAGES_LOGS.map((gift) => (
                    <div
                      key={gift.id}
                      className="p-3.5 bg-white border border-slate-100 rounded-2xl shadow-xs hover:border-rose-200 transition-all flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <img
                            src={gift.senderAvatar}
                            alt={gift.senderName}
                            className="w-11 h-11 rounded-full object-cover border border-slate-200"
                          />
                          <span className="absolute -bottom-1 -right-1 text-base drop-shadow-xs">
                            {gift.giftIcon}
                          </span>
                        </div>
                        <div>
                          <span className="text-xs font-black text-slate-900 block">{gift.senderName}</span>
                          <span className="text-[11px] text-rose-600 font-bold">{gift.giftName}</span>
                          <span className="text-[10px] text-slate-400 block font-mono">{gift.roomName} • {gift.time}</span>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <span className="text-xs font-black text-amber-600 font-mono bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-100">
                          +{gift.value.toLocaleString()} 🪙
                        </span>
                        <button
                          onClick={() => showToast(`تم إرسال رسالة شكر خاصة لـ ${gift.senderName} 💌`)}
                          className="text-[10px] font-black text-[#00c765] hover:text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md transition-colors cursor-pointer"
                        >
                          شكر الداعم 💌
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* SUB-MODAL 3: فريق سوبر (Super Team) */}
              {activeCategoryModal === 'super-team' && (
                <div className="p-4 bg-emerald-50/70 border border-emerald-100 rounded-2xl space-y-3">
                  <div className="flex items-center gap-2">
                    <Crown className="w-5 h-5 text-emerald-600" />
                    <span className="text-sm font-black text-emerald-900">مرحباً بك في تحديثات فريق سوبر! 🎉</span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed font-medium">
                    يسعد فريق سوبر أن يعلن عن إطلاق التحديث الملكي للغرف الصوتية: نظام خلفيات الرومات ثلاثي الأبعاد، رسائل الوكالة التلقائية، وسجل الهدايا الفوري!
                  </p>
                  <div className="pt-2 border-t border-emerald-100 flex items-center justify-between text-xs text-emerald-800 font-bold">
                    <span>إصدار النظام: Super v4.2.0</span>
                    <span className="text-[#00c765]">موثق ومعتمد ✓</span>
                  </div>
                </div>
              )}

              {/* SUB-MODAL 4: طلبات الصداقة */}
              {activeCategoryModal === 'friend-requests' && (
                <div className="space-y-3">
                  <div className="p-3 bg-purple-50/70 border border-purple-100 rounded-2xl flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <img
                        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150"
                        alt="friend"
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <span className="font-black text-xs text-slate-900 block">الملكة نورا</span>
                        <span className="text-[10px] text-slate-400">أرسلت طلب صداقة قبل 5 دقائق</span>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        showToast('تم قبول طلب الصداقة بنجاح 🤝');
                        setActiveCategoryModal(null);
                      }}
                      className="bg-[#00c765] text-white text-xs font-black px-3 py-1.5 rounded-full shadow-xs cursor-pointer"
                    >
                      قبول
                    </button>
                  </div>
                </div>
              )}

              {/* SUB-MODAL 5: العرض الترويجي */}
              {activeCategoryModal === 'promo' && (
                <div className="p-4 bg-amber-50/70 border border-amber-100 rounded-2xl space-y-2">
                  <span className="text-xs font-black text-amber-900">عرض مضاعفة شحن الكوينز الذهبي 🪙🔥</span>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    اشحن الآن واحصل على بونص إضافي 30% من الكوينز وهدايا دخول مميزة لروماتك المفضلة!
                  </p>
                </div>
              )}

              {/* SUB-MODAL 6: خدمة العملاء */}
              {activeCategoryModal === 'online-support' && (
                <div className="p-4 bg-blue-50/70 border border-blue-100 rounded-2xl space-y-3">
                  <span className="text-xs font-black text-blue-900">خدمة الدعم الفني الملكي على مدار الساعة 🎧</span>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    فريق الدعم الفني جاهز لمساعدتك في أي استفسار يتعلق بالغرف أو شحن الرصيد والوكالات.
                  </p>
                  <button
                    onClick={() => {
                      showToast('تم تحويلك إلى ممثل الدعم المباشر');
                      setActiveCategoryModal(null);
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-black px-4 py-2.5 rounded-full w-full shadow-xs cursor-pointer"
                  >
                    بدء محادثة مباشرة
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* TOAST POPUP */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-slate-900/95 text-white px-4 py-2 rounded-2xl font-bold text-xs shadow-2xl z-50 flex items-center gap-2 border border-slate-700 pointer-events-none whitespace-nowrap"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#00c765]" />
            <span>{toastMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

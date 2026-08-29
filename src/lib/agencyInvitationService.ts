export interface AgencyInvitation {
  id: string;
  hostId: string;
  hostName: string;
  hostAvatar: string;
  agencyGid: string;
  agencyName: string;
  inviterType: 'agency' | 'broker';
  inviterId: string;
  inviterName: string;
  commissionRate?: string;
  message: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
  terms: string[];
  termsAccepted?: boolean;
  acceptedAt?: string;
}

export const OFFICIAL_AGENCY_TERMS = [
  'الالتزام بالحد الأدنى من أيام وساعات البث الشهري (15 يوماً و30 ساعة بث مؤهلة).',
  'توزيع عوائد الماسات والعمولات الشهرية يتم بدقة عبر محفظة الوكالة الرسمية.',
  'الالتزام التام بقوانين وسياسات البث المباشر والذوق العام وعدم مخالفة إرشادات المجتمع.',
  'عدم الارتباط أو التعاقد مع وكالات أخرى خلال فترة الانضمام للوكالة.',
  'الاستفادة من حزم الدعم والمكافآت والترقيات التلقائية عند تحقيق أهداف البث الماسي.'
];

const STORAGE_KEY = 'super_legend_agency_invitations';
const BROADCASTERS_COUNT_KEY = 'super_legend_broadcasters_count';
const BROADCASTERS_LIST_KEY = 'super_legend_broadcasters_list';

const INITIAL_INVITATIONS: AgencyInvitation[] = [
  {
    id: 'inv-101',
    hostId: '81156183',
    hostName: 'المذيع المتألق سيف',
    hostAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
    agencyGid: '30032',
    agencyName: 'وكالة الأساطير (عابر سبيل)',
    inviterType: 'agency',
    inviterId: '30032',
    inviterName: 'إدارة الوكالة (عابر سبيل)',
    message: 'يسر وكالة الأساطير دعوتك رسمياً للانضمام إلى نخبة المذيعين مع خطة دعم وبونص شهري.',
    status: 'pending',
    createdAt: 'اليوم 14:20',
    terms: OFFICIAL_AGENCY_TERMS
  }
];

export interface BroadcasterMember {
  id: string;
  gid: string;
  name: string;
  avatar: string;
  brokerId?: string;
  brokerName?: string;
  diamonds: string;
  days: string;
  hours: string;
  joinedAt: string;
  isOnline?: boolean;
}

const INITIAL_MEMBERS: BroadcasterMember[] = [
  {
    id: 'b-1',
    gid: '81156183',
    name: 'سيف القحطاني',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
    diamonds: '450,200',
    days: '18 يوم',
    hours: '42 ساعة',
    joinedAt: '2026-08-01',
    isOnline: true
  },
  {
    id: 'b-2',
    gid: '90023411',
    name: 'أميرة النجوم ✨',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    diamonds: '1,240,000',
    days: '22 يوم',
    hours: '65 ساعة',
    joinedAt: '2026-07-15',
    isOnline: true
  }
];

type ChangeListener = () => void;
const listeners: Set<ChangeListener> = new Set();

export function subscribeToAgencyInvitations(listener: ChangeListener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function notifyListeners() {
  listeners.forEach((l) => {
    try {
      l();
    } catch (e) {
      console.error(e);
    }
  });
}

export function getAgencyInvitations(): AgencyInvitation[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error(e);
  }
  return INITIAL_INVITATIONS;
}

export function saveAgencyInvitations(invites: AgencyInvitation[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(invites));
  } catch (e) {
    console.error(e);
  }
  notifyListeners();
}

export function getBroadcastersCount(): number {
  try {
    const raw = localStorage.getItem(BROADCASTERS_COUNT_KEY);
    if (raw) return parseInt(raw, 10);
  } catch (e) {
    console.error(e);
  }
  return 198;
}

export function setBroadcastersCount(count: number) {
  try {
    localStorage.setItem(BROADCASTERS_COUNT_KEY, count.toString());
  } catch (e) {
    console.error(e);
  }
  notifyListeners();
}

export function getBroadcastersList(): BroadcasterMember[] {
  try {
    const raw = localStorage.getItem(BROADCASTERS_LIST_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error(e);
  }
  return INITIAL_MEMBERS;
}

export function saveBroadcastersList(members: BroadcasterMember[]) {
  try {
    localStorage.setItem(BROADCASTERS_LIST_KEY, JSON.stringify(members));
  } catch (e) {
    console.error(e);
  }
  notifyListeners();
}

export interface AgencyNotificationItem {
  id: string;
  agencyName: string;
  agencyId: string;
  date: string;
  title: string;
  desc: string;
  badge: string;
  amount: string;
  invitationId?: string;
  isInvitation?: boolean;
  status?: 'pending' | 'accepted' | 'rejected';
}

export const BASE_AGENCY_NOTIFICATIONS: AgencyNotificationItem[] = [
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
  }
];

export function getAgencyNotifications(): AgencyNotificationItem[] {
  const invites = getAgencyInvitations();
  const inviteNotifications: AgencyNotificationItem[] = invites.map((inv) => ({
    id: `notif-${inv.id}`,
    agencyName: inv.agencyName,
    agencyId: inv.agencyGid,
    date: inv.createdAt,
    title: inv.inviterType === 'agency' ? 'دعوة انضمام رسمية للوكالة 🎙️' : 'دعوة انضمام عبر وسيط معتمد 🤝',
    desc: `${inv.message} - انقر لمراجعة بنود العقد وشروط الانضمام الرسمية.`,
    badge: inv.status === 'accepted' ? 'تم الانضمام ✓' : inv.status === 'rejected' ? 'مرفوض' : 'دعوة عقد معلقة ⏳',
    amount: inv.commissionRate ? `عمولة ${inv.commissionRate}` : 'بونص شهري 30%',
    invitationId: inv.id,
    isInvitation: true,
    status: inv.status
  }));

  return [...inviteNotifications, ...BASE_AGENCY_NOTIFICATIONS];
}

export function sendNewInvitation(params: {
  hostId: string;
  hostName?: string;
  hostAvatar?: string;
  agencyGid?: string;
  agencyName?: string;
  inviterType: 'agency' | 'broker';
  inviterId?: string;
  inviterName?: string;
  commissionRate?: string;
  message?: string;
}): AgencyInvitation {
  const currentInvites = getAgencyInvitations();
  const newInvite: AgencyInvitation = {
    id: `inv-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    hostId: params.hostId.trim(),
    hostName: params.hostName?.trim() || `مذيع (ID: ${params.hostId.trim()})`,
    hostAvatar: params.hostAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
    agencyGid: params.agencyGid || '30032',
    agencyName: params.agencyName || 'وكالة الأساطير (عابر سبيل)',
    inviterType: params.inviterType,
    inviterId: params.inviterId || (params.inviterType === 'agency' ? '30032' : '994012'),
    inviterName: params.inviterName || (params.inviterType === 'agency' ? 'إدارة الوكالة (عابر سبيل)' : 'الوسيط المعتمد'),
    commissionRate: params.commissionRate || (params.inviterType === 'broker' ? '20%' : undefined),
    message: params.message || 'يسر وكالتنا دعوتك رسمياً للانضمام لفريق المذيعين مع خطة دعم وبونص شهري.',
    status: 'pending',
    createdAt: 'الآن',
    terms: OFFICIAL_AGENCY_TERMS
  };

  const updated = [newInvite, ...currentInvites];
  saveAgencyInvitations(updated);

  // Inject two messages into the chats storage:
  // 1. Message from the Agency
  // 2. Message from the Broker (or Direct Manager)
  try {
    const rawChats = localStorage.getItem('yoho_room_chats_list');
    let chats = rawChats ? JSON.parse(rawChats) : [];
    const nowTime = new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });

    // 1. Agency message chat entry
    const agencyChatId = 'chat-agency-official';
    let agencyChat = chats.find((c: any) => c.id === agencyChatId);
    if (!agencyChat) {
      agencyChat = {
        id: agencyChatId,
        senderId: params.agencyGid || '30032',
        senderName: params.agencyName || 'إدارة الوكالة الرسمية',
        senderAvatar: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&q=80&w=200',
        vipLevel: 10,
        nobilityLevel: 'N1',
        isOnline: true,
        isSpecial: true,
        isPinned: true,
        lastMessage: `دعوة انضمام جديدة للمضيف ${newInvite.hostId}`,
        lastMessageTime: nowTime,
        unreadCount: 1,
        messages: []
      };
      chats.unshift(agencyChat);
    } else {
      agencyChat.lastMessage = `دعوة انضمام جديدة للمضيف ${newInvite.hostId}`;
      agencyChat.lastMessageTime = nowTime;
      agencyChat.unreadCount = (agencyChat.unreadCount || 0) + 1;
    }

    agencyChat.messages.push({
      id: `msg-agency-${Date.now()}`,
      sender: 'them',
      text: `📢 إشعار رسمي من الوكالة: تم إرسال دعوة انضمام للمضيف (ID: ${newInvite.hostId}) مع بنود وشروط التعاقد.\nالرسالة: ${newInvite.message}`,
      time: nowTime,
      status: 'delivered',
      invitationId: newInvite.id
    });

    // 2. Broker / Inviter direct chat entry
    const brokerChatId = params.inviterType === 'broker' ? 'chat-broker-direct' : 'chat-manager-direct';
    const brokerName = params.inviterName || (params.inviterType === 'broker' ? 'الوسيط المعتمد' : 'مدير المضيفين بالوكالة');
    let brokerChat = chats.find((c: any) => c.id === brokerChatId);
    if (!brokerChat) {
      brokerChat = {
        id: brokerChatId,
        senderId: params.inviterId || (params.inviterType === 'broker' ? '994012' : '30032'),
        senderName: brokerName,
        senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
        vipLevel: 7,
        nobilityLevel: 'N2',
        isOnline: true,
        isSpecial: false,
        isPinned: false,
        lastMessage: `مرحباً! أرسلت لك دعوة الانضمام وشروط الوكالة 📜`,
        lastMessageTime: nowTime,
        unreadCount: 1,
        messages: []
      };
      chats.unshift(brokerChat);
    } else {
      brokerChat.lastMessage = `مرحباً! أرسلت لك دعوة الانضمام وشروط الوكالة 📜`;
      brokerChat.lastMessageTime = nowTime;
      brokerChat.unreadCount = (brokerChat.unreadCount || 0) + 1;
    }

    brokerChat.messages.push({
      id: `msg-broker-${Date.now()}`,
      sender: 'them',
      text: `أهلاً بك يا غالي! أرسلت لك دعوة انضمام رسمية وشروط العقد للوكالة.\n${newInvite.message}\nيرجى فتح الشروط والموافقة عليها لتفعيل عضويتك فوراً 🌟`,
      time: nowTime,
      status: 'delivered',
      invitationId: newInvite.id
    });

    localStorage.setItem('yoho_room_chats_list', JSON.stringify(chats));
    window.dispatchEvent(new CustomEvent('chat_messages_updated', { detail: chats }));
  } catch (err) {
    console.error('Failed to sync invitation messages to chats:', err);
  }

  return newInvite;
}

export function acceptInvitation(inviteId: string): boolean {
  const currentInvites = getAgencyInvitations();
  const target = currentInvites.find((i) => i.id === inviteId);
  if (!target) return false;

  target.status = 'accepted';
  target.termsAccepted = true;
  target.acceptedAt = 'الآن';

  saveAgencyInvitations([...currentInvites]);

  // Increment broadcaster count
  const currentCount = getBroadcastersCount();
  setBroadcastersCount(currentCount + 1);

  // Add to broadcaster list
  const currentList = getBroadcastersList();
  const alreadyInList = currentList.some((m) => m.gid === target.hostId);
  if (!alreadyInList) {
    const newMember: BroadcasterMember = {
      id: `bm-${Date.now()}`,
      gid: target.hostId,
      name: target.hostName,
      avatar: target.hostAvatar,
      brokerId: target.inviterType === 'broker' ? target.inviterId : undefined,
      brokerName: target.inviterType === 'broker' ? target.inviterName : undefined,
      diamonds: '0',
      days: '0 يوم',
      hours: '0.0 ساعة',
      joinedAt: new Date().toISOString().split('T')[0],
      isOnline: true
    };
    saveBroadcastersList([newMember, ...currentList]);
  }

  return true;
}

export function rejectInvitation(inviteId: string): boolean {
  const currentInvites = getAgencyInvitations();
  const target = currentInvites.find((i) => i.id === inviteId);
  if (!target) return false;

  target.status = 'rejected';
  saveAgencyInvitations([...currentInvites]);
  return true;
}

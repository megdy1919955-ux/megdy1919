import React, { useState, useEffect } from 'react';
import { 
  ChevronRight, 
  Check, 
  Copy, 
  HelpCircle, 
  Share2, 
  Send, 
  AlertCircle, 
  Sparkles, 
  ExternalLink,
  Shield,
  FileText,
  Calendar,
  Clock,
  Coins,
  DollarSign,
  Gift,
  Search,
  Users,
  Trophy,
  X
} from 'lucide-react';
import type { SubViewType } from '../BroadcasterCenterModal';
import { db } from '../../lib/firebase';
import { 
  doc, 
  onSnapshot, 
  collection, 
  query, 
  orderBy, 
  where, 
  getDoc, 
  getDocs, 
  setDoc, 
  deleteDoc, 
  updateDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { sendReceiveSupport } from '../../lib/serverRewardsService';

interface SubViewProps {
  onNavigate: (view: SubViewType) => void;
  showAlert: (msg: string) => void;
  onWhatsAppContact?: () => void;
  hostStats?: any;
  agencyGid?: string;
  agencyName?: string;
  currentUserId?: string;
  currentUserName?: string;
  currentUserAvatar?: string;
}

// Fallback 45 levels for Target System
const FALLBACK_TARGET_SYSTEM_LEVELS = [
  { rank: 1,  diamonds: 13500,     hostUsd: 1,     agencyUsd: 0,     totalUsd: 1 },
  { rank: 2,  diamonds: 27000,     hostUsd: 2,     agencyUsd: 0,     totalUsd: 2 },
  { rank: 3,  diamonds: 40500,     hostUsd: 5,     agencyUsd: 0,     totalUsd: 5 },
  { rank: 4,  diamonds: 100000,    hostUsd: 6,     agencyUsd: 1,     totalUsd: 7 },
  { rank: 5,  diamonds: 81500,     hostUsd: 7,     agencyUsd: 3,     totalUsd: 10 },
  { rank: 6,  diamonds: 100000,    hostUsd: 21,    agencyUsd: 7,     totalUsd: 28 },
  { rank: 7,  diamonds: 400000,    hostUsd: 21,    agencyUsd: 7,     totalUsd: 28 },
  { rank: 8,  diamonds: 300000,    hostUsd: 25,    agencyUsd: 9,     totalUsd: 34 },
  { rank: 9,  diamonds: 700000,    hostUsd: 39,    agencyUsd: 12,    totalUsd: 51 },
  { rank: 10, diamonds: 1000000,   hostUsd: 40,    agencyUsd: 16,    totalUsd: 56 },
  { rank: 11, diamonds: 1500000,   hostUsd: 117,   agencyUsd: 12,    totalUsd: 129 },
  { rank: 12, diamonds: 2000000,   hostUsd: 148,   agencyUsd: 44,    totalUsd: 192 },
  { rank: 13, diamonds: 2500000,   hostUsd: 210,   agencyUsd: 97,    totalUsd: 307 },
  { rank: 14, diamonds: 3000000,   hostUsd: 245,   agencyUsd: 66,    totalUsd: 311 },
  { rank: 15, diamonds: 4500000,   hostUsd: 315,   agencyUsd: 17,    totalUsd: 332 },
  { rank: 16, diamonds: 4500000,   hostUsd: 310,   agencyUsd: 43,    totalUsd: 353 },
  { rank: 17, diamonds: 5000000,   hostUsd: 310,   agencyUsd: 10,    totalUsd: 320 },
  { rank: 18, diamonds: 6000000,   hostUsd: 420,   agencyUsd: 120,   totalUsd: 540 },
  { rank: 19, diamonds: 6000000,   hostUsd: 420,   agencyUsd: 128,   totalUsd: 548 },
  { rank: 20, diamonds: 7000000,   hostUsd: 490,   agencyUsd: 154,   totalUsd: 644 },
  { rank: 21, diamonds: 8000000,   hostUsd: 630,   agencyUsd: 178,   totalUsd: 808 },
  { rank: 22, diamonds: 9000000,   hostUsd: 630,   agencyUsd: 118,   totalUsd: 748 },
  { rank: 23, diamonds: 10000000,  hostUsd: 875,   agencyUsd: 220,   totalUsd: 1095 },
  { rank: 24, diamonds: 12500000,  hostUsd: 875,   agencyUsd: 220,   totalUsd: 1095 },
  { rank: 25, diamonds: 15000000,  hostUsd: 1005,  agencyUsd: 335,   totalUsd: 1340 },
  { rank: 26, diamonds: 20000000,  hostUsd: 1355,  agencyUsd: 425,   totalUsd: 1780 },
  { rank: 27, diamonds: 25000000,  hostUsd: 1380,  agencyUsd: 518,   totalUsd: 1898 },
  { rank: 28, diamonds: 30000000,  hostUsd: 2370,  agencyUsd: 615,   totalUsd: 2985 },
  { rank: 29, diamonds: 40000000,  hostUsd: 2740,  agencyUsd: 715,   totalUsd: 3455 },
  { rank: 30, diamonds: 40000000,  hostUsd: 2740,  agencyUsd: 920,   totalUsd: 3660 },
  { rank: 31, diamonds: 50000000,  hostUsd: 4740,  agencyUsd: 920,   totalUsd: 5660 },
  { rank: 32, diamonds: 50000000,  hostUsd: 4410,  agencyUsd: 1000,  totalUsd: 5410 },
  { rank: 33, diamonds: 50000000,  hostUsd: 4440,  agencyUsd: 1800,  totalUsd: 6240 },
  { rank: 34, diamonds: 70000000,  hostUsd: 4830,  agencyUsd: 1600,  totalUsd: 6430 },
  { rank: 35, diamonds: 80000000,  hostUsd: 5520,  agencyUsd: 1600,  totalUsd: 7120 },
  { rank: 36, diamonds: 90000000,  hostUsd: 6770,  agencyUsd: 1000,  totalUsd: 7770 },
  { rank: 37, diamonds: 100000000, hostUsd: 6730,  agencyUsd: 2050,  totalUsd: 8780 },
  { rank: 38, diamonds: 150000000, hostUsd: 10250, agencyUsd: 1000,  totalUsd: 11250 },
  { rank: 39, diamonds: 200000000, hostUsd: 17600, agencyUsd: 1600,  totalUsd: 19200 },
  { rank: 40, diamonds: 250000000, hostUsd: 17500, agencyUsd: 8500,  totalUsd: 26000 },
  { rank: 41, diamonds: 300000000, hostUsd: 28510, agencyUsd: 8850,  totalUsd: 37360 },
  { rank: 42, diamonds: 350000000, hostUsd: 25575, agencyUsd: 8720,  totalUsd: 34295 },
  { rank: 43, diamonds: 400000000, hostUsd: 27400, agencyUsd: 7800,  totalUsd: 35200 },
  { rank: 44, diamonds: 450000000, hostUsd: 30625, agencyUsd: 8775,  totalUsd: 39400 },
  { rank: 45, diamonds: 500000000, hostUsd: 34250, agencyUsd: 9730,  totalUsd: 43980 }
];

/* ========================================================================= */
/* 1. MY AGENCY VIEW (وكالتي)                                                */
/* ========================================================================= */
export const MyAgencyView: React.FC<SubViewProps> = ({ 
  showAlert, 
  agencyGid = 'AG-101', 
  agencyName: initialAgencyName = 'وكالة النخبة الملكية' 
}) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [agencyData, setAgencyData] = useState<{
    name: string;
    level: string;
    ownerUid: string;
    ownerName: string;
    joinDate: string;
    announcement: string;
  } | null>(null);

  useEffect(() => {
    if (!agencyGid) {
      setLoading(false);
      return;
    }

    const docRef = doc(db, 'agencies', agencyGid);
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        let formattedDate = '(utc+0)16:13:13 2025-12-16';
        if (data.createdAt) {
          if (typeof data.createdAt.toDate === 'function') {
            formattedDate = data.createdAt.toDate().toISOString().replace('T', ' ').slice(0, 19);
          } else if (typeof data.createdAt === 'string') {
            formattedDate = data.createdAt;
          }
        }
        setAgencyData({
          name: data.agencyName || data.name || initialAgencyName || 'وكالة النخبة الملكية',
          level: data.level || 'F',
          ownerUid: data.ownerUid || '82639599',
          ownerName: data.ownerName || 'ابوامجدMá🎼',
          joinDate: formattedDate,
          announcement: data.announcement || 'اي مضيف يسكر تارجت اكبر له تسكير خاص غير المضيفين معا تحيت وكالت ابو امجد بتوفيق للجميع'
        });
      } else {
        setAgencyData({
          name: initialAgencyName || 'وكالة النخبة الملكية',
          level: 'F',
          ownerUid: '82639599',
          ownerName: 'ابوامجدMá🎼',
          joinDate: '(utc+0)16:13:13 2025-12-16',
          announcement: 'اي مضيف يسكر تارجت اكبر له تسكير خاص غير المضيفين معا تحيت وكالت ابو امجد بتوفيق للجميع'
        });
      }
      setLoading(false);
    }, (error) => {
      console.warn('Error fetching agency info from Firestore:', error);
      setAgencyData({
        name: initialAgencyName || 'وكالة النخبة الملكية',
        level: 'F',
        ownerUid: '82639599',
        ownerName: 'ابوامجدMá🎼',
        joinDate: '(utc+0)16:13:13 2025-12-16',
        announcement: 'اي مضيف يسكر تارجت اكبر له تسكير خاص غير المضيفين معا تحيت وكالت ابو امجد بتوفيق للجميع'
      });
      setLoading(false);
    });

    return () => unsubscribe();
  }, [agencyGid, initialAgencyName]);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    showAlert(`تم نسخ ${label} بنجاح: ${text}`);
    setTimeout(() => setCopiedField(null), 2500);
  };

  if (loading) {
    return (
      <div className="w-full max-w-md mx-auto p-4 space-y-4 font-sans text-right" dir="rtl">
        <div className="rounded-[28px] bg-white border border-slate-200 p-5 shadow-sm space-y-4 animate-pulse">
          <div className="h-5 bg-slate-200 rounded-md w-1/3 mb-4"></div>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="flex justify-between items-center py-2.5 border-b border-slate-100">
              <div className="h-4 bg-slate-200 rounded-md w-24"></div>
              <div className="h-4 bg-slate-100 rounded-md w-28"></div>
            </div>
          ))}
          <div className="h-16 bg-slate-100 rounded-2xl w-full mt-2"></div>
        </div>
      </div>
    );
  }

  const currentAgency = agencyData || {
    name: initialAgencyName || 'وكالة النخبة الملكية',
    level: 'F',
    ownerUid: '82639599',
    ownerName: 'ابوامجدMá🎼',
    joinDate: '(utc+0)16:13:13 2025-12-16',
    announcement: 'اي مضيف يسكر تارجت اكبر له تسكير خاص غير المضيفين معا تحيت وكالت ابو امجد بتوفيق للجميع'
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 space-y-4 font-sans text-right" dir="rtl">
      <div className="rounded-[28px] bg-white border border-slate-200 p-5 shadow-sm space-y-4">
        
        {/* Row 1: معرّف الوكالة */}
        <div className="flex items-center justify-between py-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="font-mono font-black text-sm text-slate-900">{agencyGid}</span>
            <button 
              onClick={() => handleCopy(agencyGid, 'معرّف الوكالة')}
              className="p-1 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors cursor-pointer"
              title="نسخ"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
          </div>
          <span className="text-xs font-bold text-slate-500">معرّف الوكالة:</span>
        </div>

        {/* Row 2: اسم الوكالة */}
        <div className="flex items-center justify-between py-2 border-b border-slate-100">
          <span className="font-bold text-sm text-slate-900">{currentAgency.name}</span>
          <span className="text-xs font-bold text-slate-500">اسم الوكالة:</span>
        </div>

        {/* Row 3: مستوى الوكالة */}
        <div className="flex items-center justify-between py-2 border-b border-slate-100">
          <span className="font-mono font-black text-sm text-slate-900 px-2.5 py-0.5 rounded-md bg-slate-100 border border-slate-200">
            {currentAgency.level}
          </span>
          <span className="text-xs font-bold text-slate-500">مستوى الوكالة:</span>
        </div>

        {/* Row 4: معرّف رئيس الوكالة */}
        <div className="flex items-center justify-between py-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="font-mono font-black text-sm text-slate-900">{currentAgency.ownerUid}</span>
            <button 
              onClick={() => handleCopy(currentAgency.ownerUid, 'معرّف رئيس الوكالة')}
              className="p-1 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors cursor-pointer"
              title="نسخ"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
          </div>
          <span className="text-xs font-bold text-slate-500">معرّف رئيس الوكالة:</span>
        </div>

        {/* Row 5: اسم رئيس الوكالة */}
        <div className="flex items-center justify-between py-2 border-b border-slate-100">
          <span className="font-black text-sm text-slate-900">{currentAgency.ownerName}</span>
          <span className="text-xs font-bold text-slate-500">اسم رئيس الوكالة:</span>
        </div>

        {/* Row 6: وقت الانضمام */}
        <div className="flex items-center justify-between py-2 border-b border-slate-100">
          <span className="font-mono font-bold text-xs text-slate-700 dir-ltr">{currentAgency.joinDate}</span>
          <span className="text-xs font-bold text-slate-500">وقت الانضمام:</span>
        </div>

        {/* Row 7: إعلان الوكالة */}
        <div className="space-y-1.5 py-2 border-b border-slate-100">
          <span className="text-xs font-bold text-slate-500 block">إعلان الوكالة:</span>
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs leading-relaxed text-slate-800 font-medium">
            {currentAgency.announcement}
          </div>
        </div>

        {/* Row 8: الحالة الحالية */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-full text-xs font-black">
            <Check className="w-3.5 h-3.5 stroke-[3]" />
            <span>تم الانضمام</span>
          </div>
          <span className="text-xs font-bold text-slate-500">الحالة الحالية:</span>
        </div>

      </div>
    </div>
  );
};

/* ========================================================================= */
/* 2. RECORDS VIEW (سجل البث)                                               */
/* ========================================================================= */
interface SessionDetail {
  id: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  diamonds: number;
  roomName?: string;
  listenersCount?: number;
}

interface DailyRecordData {
  id?: string;
  date: string; // YYYY-MM-DD
  month: string; // MM/YYYY
  totalDiamonds?: number;
  hostIncome?: number;
  guestIncome?: number;
  rewards?: number;
  roomDiamonds?: number;
  messageGift?: number;
  textChatRevenue?: number;
  callRevenue?: number;
  isValidDay?: boolean;
  activeDurationMinutes?: number;
  streamDurationMinutes?: number;
  guestDurationMinutes?: number;
  gameCoins?: number;
  gameIncome?: number;
  gameStreamMinutes?: number;
  sessions?: SessionDetail[];
}

export const RecordsView: React.FC<SubViewProps> = ({ 
  showAlert, 
  currentUserId, 
  hostStats 
}) => {
  const hostUid = currentUserId || '1001001';
  
  // Current date helpers
  const today = new Date();
  const currentMonthKey = `${String(today.getMonth() + 1).padStart(2, '0')}/${today.getFullYear()}`;
  const todayIso = today.toISOString().split('T')[0];
  const formatIsoToDisplayDate = (iso: string) => {
    const parts = iso.split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return iso;
  };
  const formatDisplayDateToIso = (display: string) => {
    const parts = display.split('/');
    if (parts.length === 3) {
      return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    return display;
  };

  const [selectedMonth, setSelectedMonth] = useState(currentMonthKey);
  const [selectedIsoDate, setSelectedIsoDate] = useState(todayIso);
  const [showDetail, setShowDetail] = useState(false);
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(true);
  const [records, setRecords] = useState<DailyRecordData[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);

  // Firestore real-time listener on users/{hostUid}/daily_records
  useEffect(() => {
    setLoading(true);
    const recordsCol = collection(db, 'users', hostUid, 'daily_records');
    const q = query(recordsCol, orderBy('date', 'desc'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const list: DailyRecordData[] = snapshot.docs.map((d) => ({
          id: d.id,
          date: d.data().date || d.id,
          month: d.data().month || currentMonthKey,
          totalDiamonds: Number(d.data().totalDiamonds || 0),
          hostIncome: Number(d.data().hostIncome || 0),
          guestIncome: Number(d.data().guestIncome || 0),
          rewards: Number(d.data().rewards || 0),
          roomDiamonds: Number(d.data().roomDiamonds || 0),
          messageGift: Number(d.data().messageGift || 0),
          textChatRevenue: Number(d.data().textChatRevenue || 0),
          callRevenue: Number(d.data().callRevenue || 0),
          isValidDay: Boolean(d.data().isValidDay),
          activeDurationMinutes: Number(d.data().activeDurationMinutes || 0),
          streamDurationMinutes: Number(d.data().streamDurationMinutes || 0),
          guestDurationMinutes: Number(d.data().guestDurationMinutes || 0),
          gameCoins: Number(d.data().gameCoins || 0),
          gameIncome: Number(d.data().gameIncome || 0),
          gameStreamMinutes: Number(d.data().gameStreamMinutes || 0),
          sessions: d.data().sessions || []
        }));
        setRecords(list);
        setLoading(false);
      },
      (err) => {
        console.warn('Firestore daily_records query notice:', err);
        // Fallback: try direct fetch without orderBy if index not ready
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [hostUid, currentMonthKey]);

  // Aggregate monthly stats
  const isCurrentMonth = selectedMonth === currentMonthKey;
  const monthRecords = records.filter((r) => r.month === selectedMonth);

  const rawMonthlyDiamonds = monthRecords.reduce((acc, r) => acc + (r.totalDiamonds || 0), 0);
  const rawMonthlyHostIncome = monthRecords.reduce((acc, r) => acc + (r.hostIncome || 0), 0);
  const rawMonthlyGuestIncome = monthRecords.reduce((acc, r) => acc + (r.guestIncome || 0), 0);
  const rawMonthlyRewards = monthRecords.reduce((acc, r) => acc + (r.rewards || 0), 0);
  const rawMonthlyRoomDiamonds = monthRecords.reduce((acc, r) => acc + (r.roomDiamonds || 0), 0);
  const rawMonthlyMessageGift = monthRecords.reduce((acc, r) => acc + (r.messageGift || 0), 0);
  const rawMonthlyTextChat = monthRecords.reduce((acc, r) => acc + (r.textChatRevenue || 0), 0);
  const rawMonthlyCallRevenue = monthRecords.reduce((acc, r) => acc + (r.callRevenue || 0), 0);
  const rawMonthlyValidDays = monthRecords.filter((r) => r.isValidDay || (r.streamDurationMinutes || 0) >= 60).length;
  const rawMonthlyStreamMinutes = monthRecords.reduce((acc, r) => acc + (r.streamDurationMinutes || 0), 0);
  const rawMonthlyGuestMinutes = monthRecords.reduce((acc, r) => acc + (r.guestDurationMinutes || 0), 0);
  const rawMonthlyActiveMinutes = monthRecords.reduce((acc, r) => acc + (r.activeDurationMinutes || 0), 0);
  const rawMonthlyGameCoins = monthRecords.reduce((acc, r) => acc + (r.gameCoins || 0), 0);
  const rawMonthlyGameIncome = monthRecords.reduce((acc, r) => acc + (r.gameIncome || 0), 0);
  const rawMonthlyGameStreamMinutes = monthRecords.reduce((acc, r) => acc + (r.gameStreamMinutes || 0), 0);

  // Sync with hostStats if current month has live server activity
  const hostStatsDiamonds = hostStats?.diamondsEarned || 0;
  const hostStatsValidDays = hostStats?.qualifiedDays || 0;
  const hostStatsStreamMinutes = Math.round((hostStats?.streamHours || 0) * 60);

  const monthlyTotalDiamonds = isCurrentMonth && hostStatsDiamonds > rawMonthlyDiamonds 
    ? hostStatsDiamonds 
    : rawMonthlyDiamonds;

  const monthlyHostIncome = isCurrentMonth && hostStatsDiamonds > rawMonthlyHostIncome 
    ? hostStatsDiamonds 
    : rawMonthlyHostIncome;

  const monthlyValidDays = isCurrentMonth && hostStatsValidDays > rawMonthlyValidDays 
    ? hostStatsValidDays 
    : rawMonthlyValidDays;

  const monthlyStreamMinutes = isCurrentMonth && hostStatsStreamMinutes > rawMonthlyStreamMinutes 
    ? hostStatsStreamMinutes 
    : rawMonthlyStreamMinutes;

  const monthlyActiveMinutes = Math.max(rawMonthlyActiveMinutes, monthlyStreamMinutes + rawMonthlyGuestMinutes);

  // Daily stats for selected date
  const dayRecord = records.find((r) => r.date === selectedIsoDate);
  const dailyTotalDiamonds = dayRecord?.totalDiamonds || 0;
  const dailyHostIncome = dayRecord?.hostIncome || 0;
  const dailyGuestIncome = dayRecord?.guestIncome || 0;
  const dailyRewards = dayRecord?.rewards || 0;
  const dailyRoomDiamonds = dayRecord?.roomDiamonds || 0;
  const dailyMessageGift = dayRecord?.messageGift || 0;
  const dailyTextChatRevenue = dayRecord?.textChatRevenue || 0;
  const dailyCallRevenue = dayRecord?.callRevenue || 0;
  const dailyActiveMinutes = dayRecord?.activeDurationMinutes || 0;
  const dailyStreamMinutes = dayRecord?.streamDurationMinutes || 0;
  const dailyGuestMinutes = dayRecord?.guestDurationMinutes || 0;
  const dailyGameStreamMinutes = dayRecord?.gameStreamMinutes || 0;

  // Month selection options
  const monthOptions = [
    currentMonthKey,
    '09/2026',
    '08/2026',
    '07/2026',
    '06/2026'
  ];

  // Quick simulation function to test live Firestore connection
  const handleSimulateBroadcastSession = async () => {
    setIsSimulating(true);
    try {
      const docRef = doc(db, 'users', hostUid, 'daily_records', selectedIsoDate);
      const newSession: SessionDetail = {
        id: 'sess_' + Date.now(),
        startTime: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
        endTime: new Date(Date.now() + 45 * 60000).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
        durationMinutes: 45,
        diamonds: 150,
        roomName: 'غرفة البث الصوتي المباشر',
        listenersCount: 18
      };

      await setDoc(docRef, {
        date: selectedIsoDate,
        month: selectedMonth,
        totalDiamonds: (dayRecord?.totalDiamonds || 0) + 150,
        hostIncome: (dayRecord?.hostIncome || 0) + 150,
        roomDiamonds: (dayRecord?.roomDiamonds || 0) + 200,
        streamDurationMinutes: (dayRecord?.streamDurationMinutes || 0) + 45,
        activeDurationMinutes: (dayRecord?.activeDurationMinutes || 0) + 45,
        isValidDay: ((dayRecord?.streamDurationMinutes || 0) + 45) >= 60,
        sessions: [...(dayRecord?.sessions || []), newSession],
        updatedAt: serverTimestamp()
      }, { merge: true });

      showAlert('✅ تم تسجيل جلسة بث تجريبية بنجاح وتحديث Firestore مباشرة!');
    } catch (err: any) {
      showAlert('تعذر حفظ الجلسة في Firestore: ' + (err.message || 'خطأ'));
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-3.5 space-y-3.5 font-sans text-right" dir="rtl">
      
      {/* Top Green Warning/Exemption Notice Banner */}
      <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-[11px] font-bold text-emerald-800 leading-relaxed shadow-2xs">
        في بث هذه المناطق (XM,TR,FR,DE,IT,PH,IN,PK,VN,TH,CG,ID,US,KH,MY) لن يتم احتساب التبرعات بين المستخدمين من الدول الأخرى لاستبدال الماس.
      </div>

      {/* Monthly Section Title & Date Picker */}
      <div className="flex items-center justify-between px-1">
        <div className="relative">
          <button
            onClick={() => setShowMonthPicker(!showMonthPicker)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 shadow-2xs text-xs font-bold text-slate-800 hover:border-slate-300 transition-all cursor-pointer"
          >
            <span>{selectedMonth}</span>
            <span className="text-[10px] text-slate-400">▼</span>
          </button>

          {/* Month Picker Dropdown */}
          {showMonthPicker && (
            <div className="absolute top-full mt-1.5 right-0 z-30 bg-white border border-slate-200 rounded-2xl shadow-lg p-2 min-w-[130px] space-y-1">
              {monthOptions.map((m) => (
                <button
                  key={m}
                  onClick={() => {
                    setSelectedMonth(m);
                    setShowMonthPicker(false);
                  }}
                  className={`w-full text-right px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    selectedMonth === m 
                      ? 'bg-amber-500 text-white' 
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {m} {m === currentMonthKey ? '(الحالي)' : ''}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-700 border border-emerald-200">
            🟢 مباشر Firestore
          </span>
          <span className="text-sm font-black text-slate-900">شهريًا</span>
        </div>
      </div>

      {/* Red Update Notice */}
      <div className="text-[11px] font-bold text-rose-500 text-left px-1">
        .سيتم تحديث جميع البيانات كل 10 دقائق
      </div>

      {/* Monthly Statistics Card */}
      {loading ? (
        <div className="rounded-3xl bg-white border border-slate-200 p-5 shadow-sm space-y-3.5 animate-pulse">
          <div className="h-4 w-32 bg-slate-200 rounded" />
          <div className="h-16 bg-slate-100 rounded-xl" />
          <div className="h-4 w-28 bg-slate-200 rounded" />
          <div className="h-10 bg-slate-100 rounded-xl" />
        </div>
      ) : (
        <div className="rounded-3xl bg-white border border-slate-200 p-4 shadow-sm space-y-3.5">
          
          {/* 1. إجمالي الماسات */}
          <div className="space-y-1.5">
            <div className="text-xs font-black text-slate-900 flex items-center justify-between">
              <div className="flex items-center gap-1">
                <span>💎</span>
                <span>إجمالي الماسات : {monthlyTotalDiamonds.toLocaleString('en-US')}</span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">
                {records.length > 0 ? `${monthRecords.length} سجلات مسجلة` : 'بيانات مباشرة'}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              <div>دخل المذيع: <span className="font-bold text-slate-900">{monthlyHostIncome.toLocaleString('en-US')}</span></div>
              <div>دخل الضيف: <span className="font-bold text-slate-900">{rawMonthlyGuestIncome.toLocaleString('en-US')}</span></div>
              <div>المكافآت: <span className="font-bold text-slate-900">{rawMonthlyRewards.toLocaleString('en-US')}</span></div>
              <div>حصيلة الماس للغرفة: <span className="font-bold text-slate-900">{rawMonthlyRoomDiamonds.toLocaleString('en-US')}</span></div>
              <div className="col-span-2">الرسالة والهدية: <span className="font-bold text-slate-900">{rawMonthlyMessageGift.toLocaleString('en-US')}</span></div>
              <div>إيرادات الدردشة النصية: <span className="font-bold text-slate-900">{rawMonthlyTextChat.toLocaleString('en-US')}</span></div>
              <div>إيرادات المكالمات: <span className="font-bold text-slate-900">{rawMonthlyCallRevenue.toLocaleString('en-US')}</span></div>
            </div>
          </div>

          {/* 2. إجمالي الأيام الصالحة */}
          <div className="py-2 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs font-black text-emerald-700">
              إجمالي الأيام الصالحة : {monthlyValidDays} يوميًا
            </span>
            <span className="text-[10px] text-slate-400 font-bold">
              الهدف: {hostStats?.qualifiedDaysTarget || 15} يوم
            </span>
          </div>

          {/* 3. إجمالي المدة النشطة */}
          <div className="space-y-1.5 border-t border-slate-100 pt-2">
            <div className="text-xs font-black text-slate-800">
              إجمالي المدة النشطة : {monthlyActiveMinutes} دقائق
            </div>
            <div className="flex items-center gap-4 text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              <div>مدة البث: <span className="font-bold text-slate-900">{monthlyStreamMinutes} دقائق</span></div>
              <div>مدة الضيف: <span className="font-bold text-slate-900">{rawMonthlyGuestMinutes} دقائق</span></div>
            </div>
          </div>

          {/* 4. عملات اللعبة المكتسبة */}
          <div className="space-y-1 border-t border-slate-100 pt-2">
            <div className="text-xs font-black text-slate-900">
              عملات اللعبة المكتسبة في الغرفة هذا الشهر : {rawMonthlyGameCoins.toLocaleString('en-US')}
            </div>
            <div className="text-[11px] text-slate-600 px-1">
              دخل اللعبة: <span className="font-bold text-slate-900">{rawMonthlyGameIncome.toLocaleString('en-US')}</span>
            </div>
          </div>

          {/* 5. مدة بث اللعبة */}
          <div className="border-t border-slate-100 pt-2 text-xs font-black text-slate-700">
            مدة بث اللعبة : {rawMonthlyGameStreamMinutes} دقائق
          </div>

        </div>
      )}

      {/* Daily Section Title & Date Picker */}
      <div className="flex items-center justify-between px-1 pt-2">
        <div className="flex items-center gap-2">
          {/* Native Date Picker Input for instant selection */}
          <div className="relative">
            <input 
              type="date"
              value={selectedIsoDate}
              onChange={(e) => setSelectedIsoDate(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 shadow-2xs text-xs font-bold text-slate-800 cursor-pointer focus:outline-none focus:ring-1 focus:ring-amber-400"
            />
          </div>
          <button
            onClick={() => setSelectedIsoDate(todayIso)}
            className="text-[10px] font-bold text-amber-600 hover:text-amber-700 px-2 py-1 rounded-lg bg-amber-50 border border-amber-200 cursor-pointer"
          >
            اليوم
          </button>
        </div>
        <span className="text-sm font-black text-slate-900">يوميًا ({formatIsoToDisplayDate(selectedIsoDate)})</span>
      </div>

      {/* Daily Statistics Card */}
      <div className="rounded-3xl bg-white border border-slate-200 p-4 shadow-sm space-y-3">
        
        {/* Daily Diamonds */}
        <div className="space-y-1.5">
          <div className="text-xs font-black text-slate-900 flex items-center justify-between">
            <div className="flex items-center gap-1">
              <span>💎</span>
              <span>إجمالي الماسات : {dailyTotalDiamonds.toLocaleString('en-US')}</span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">
              {dayRecord ? 'سجل موجود' : 'لا يوجد نشاط'}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
            <div>دخل المذيع: <span className="font-bold text-slate-900">{dailyHostIncome.toLocaleString('en-US')}</span></div>
            <div>دخل الضيف: <span className="font-bold text-slate-900">{dailyGuestIncome.toLocaleString('en-US')}</span></div>
            <div>المكافآت: <span className="font-bold text-slate-900">{dailyRewards.toLocaleString('en-US')}</span></div>
            <div>حصيلة الماس للغرفة: <span className="font-bold text-slate-900">{dailyRoomDiamonds.toLocaleString('en-US')}</span></div>
            <div className="col-span-2">الرسالة والهدية: <span className="font-bold text-slate-900">{dailyMessageGift.toLocaleString('en-US')}</span></div>
            <div>إيرادات الدردشة النصية: <span className="font-bold text-slate-900">{dailyTextChatRevenue.toLocaleString('en-US')}</span></div>
            <div>إيرادات المكالمات: <span className="font-bold text-slate-900">{dailyCallRevenue.toLocaleString('en-US')}</span></div>
          </div>
        </div>

        {/* Daily Active Duration */}
        <div className="space-y-1 border-t border-slate-100 pt-2">
          <div className="text-xs font-black text-slate-800">
            {dailyActiveMinutes > 0 ? '(Yes)' : '(No)'} إجمالي المدة النشطة : {dailyActiveMinutes} دقائق
          </div>
          <div className="flex items-center gap-4 text-[11px] text-slate-600 px-1">
            <div>مدة البث: <span className="font-bold text-slate-900">{dailyStreamMinutes} دقائق</span></div>
            <div>مدة الضيف: <span className="font-bold text-slate-900">{dailyGuestMinutes} دقائق</span></div>
          </div>
        </div>

        {/* Daily Game Duration */}
        <div className="border-t border-slate-100 pt-2 text-xs font-black text-slate-700">
          مدة بث اللعبة : {dailyGameStreamMinutes} دقائق
        </div>

        {/* Check Detail Expand Link */}
        <button 
          onClick={() => setShowDetail(!showDetail)}
          className="w-full pt-2 text-center text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center justify-center gap-1 cursor-pointer transition-all"
        >
          <span>Check detail</span>
          <span>{showDetail ? '▲' : '⌄'}</span>
        </button>

        {/* Expanded Detailed Breakdown */}
        {showDetail && (
          <div className="pt-3 border-t border-slate-100 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-900">جلسات البث المباشر لهذا اليوم</span>
              <button
                onClick={handleSimulateBroadcastSession}
                disabled={isSimulating}
                className="px-2.5 py-1 rounded-xl text-[10px] font-black bg-amber-500 text-white hover:bg-amber-600 transition-all cursor-pointer disabled:opacity-50"
              >
                {isSimulating ? 'جاري الحفظ...' : '+ محاكاة جلسة 45د'}
              </button>
            </div>

            {dayRecord?.sessions && dayRecord.sessions.length > 0 ? (
              <div className="space-y-2">
                {dayRecord.sessions.map((sess) => (
                  <div key={sess.id} className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1 text-xs">
                    <div className="flex items-center justify-between font-black text-slate-900">
                      <span>{sess.roomName || 'جلسة بث صوتي'}</span>
                      <span className="text-amber-600 font-mono">💎 +{sess.diamonds}</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span>{sess.startTime} - {sess.endTime} ({sess.durationMinutes} دقيقة)</span>
                      {sess.listenersCount ? <span>👥 {sess.listenersCount} مستمع</span> : null}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-center space-y-2">
                <div className="text-slate-400 text-base">🎙️</div>
                <div className="text-xs font-bold text-slate-500">لا توجد جلسات بث مسجلة لهذا اليوم المختار</div>
                <div className="text-[10px] text-slate-400">
                  يتم توثيق كل جلسة بث عند بدء البث الصوتي أو إرسال الهدايا تلقائياً في السيرفر
                </div>
              </div>
            )}
          </div>
        )}

      </div>

    </div>
  );
};

/* ========================================================================= */
/* 3. CHANGE AGENCY VIEW (تغيير الوكالة)                                     */
/* ========================================================================= */
export const ChangeAgencyView: React.FC<SubViewProps> = ({ onNavigate }) => {
  return (
    <div className="w-full max-w-md mx-auto p-4 space-y-3.5 font-sans text-right" dir="rtl">
      
      {/* 1. طلب التحويل */}
      <div 
        onClick={() => onNavigate('transfer_request')}
        className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between hover:bg-slate-50 active:scale-98 transition-all cursor-pointer"
      >
        <ChevronRight className="w-5 h-5 text-slate-400 rotate-180" />
        <div className="flex items-center gap-3">
          <span className="text-xs sm:text-sm font-black text-slate-900">طلب التحويل</span>
          <div className="w-9 h-9 rounded-xl bg-slate-800 text-white flex items-center justify-center text-base shadow-xs">
            🔄
          </div>
        </div>
      </div>

      {/* 2. سجل التحويل */}
      <div 
        onClick={() => onNavigate('transfer_history')}
        className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between hover:bg-slate-50 active:scale-98 transition-all cursor-pointer"
      >
        <ChevronRight className="w-5 h-5 text-slate-400 rotate-180" />
        <div className="flex items-center gap-3">
          <span className="text-xs sm:text-sm font-black text-slate-900">سجل التحويل</span>
          <div className="w-9 h-9 rounded-xl bg-slate-700 text-white flex items-center justify-center text-base shadow-xs">
            📋
          </div>
        </div>
      </div>

      {/* 3. تعليقات على التحويل */}
      <div 
        onClick={() => onNavigate('transfer_faq')}
        className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between hover:bg-slate-50 active:scale-98 transition-all cursor-pointer"
      >
        <ChevronRight className="w-5 h-5 text-slate-400 rotate-180" />
        <div className="flex items-center gap-3">
          <span className="text-xs sm:text-sm font-black text-slate-900">تعليقات على التحويل</span>
          <div className="w-9 h-9 rounded-xl bg-slate-600 text-white flex items-center justify-center text-base shadow-xs">
            ❓
          </div>
        </div>
      </div>

    </div>
  );
};

/* ========================================================================= */
/* 4. TRANSFER REQUEST FORM (طلب التحويل)                                    */
/* ========================================================================= */
export const TransferRequestView: React.FC<SubViewProps> = ({ 
  onNavigate, 
  showAlert, 
  currentUserId,
  currentUserName,
  currentUserAvatar,
  agencyGid,
  agencyName,
  hostStats
}) => {
  const [targetId, setTargetId] = useState('');
  const [reason, setReason] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [monthsDiff, setMonthsDiff] = useState<number | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [userProfile, setUserProfile] = useState<any>(null);

  const hostUid = currentUserId || '82639599';

  useEffect(() => {
    let isMounted = true;
    const fetchUserMembership = async () => {
      try {
        const userDoc = await getDoc(doc(db, 'users', hostUid));
        if (isMounted) {
          if (userDoc.exists()) {
            const data = userDoc.data();
            setUserProfile(data);
            const joinDateStr = data.agencyJoinDate || data.agencyJoinedAt;
            if (joinDateStr) {
              const joinedAt = new Date(joinDateStr);
              const now = new Date();
              const diff = (now.getFullYear() - joinedAt.getFullYear()) * 12 + (now.getMonth() - joinedAt.getMonth());
              setMonthsDiff(diff);
            } else {
              // Default to 2 months for established users
              setMonthsDiff(2);
            }
          } else {
            setMonthsDiff(2);
          }
        }
      } catch (err) {
        console.warn('Error fetching user agencyJoinDate:', err);
        if (isMounted) setMonthsDiff(2);
      } finally {
        if (isMounted) setLoadingProfile(false);
      }
    };

    fetchUserMembership();
    return () => { isMounted = false; };
  }, [hostUid]);

  // التحقق من الشروط المشتركة
  const validateCommon = async () => {
    if (!targetId.trim()) {
      showAlert('يرجى إدخال معرّف الوكالة المراد التحويل إليها');
      return false;
    }
    if (agencyGid && targetId.trim() === agencyGid.trim()) {
      showAlert('لا يمكنك طلب التحويل إلى نفس وكالتك الحالية');
      return false;
    }
    if (!agreeTerms) {
      showAlert('يرجى الموافقة على شروط وقواعد التحويل أولاً');
      return false;
    }

    // 1. قاعدة الشهرين
    if (monthsDiff !== null && monthsDiff < 2) {
      showAlert('لا يحق لك طلب النقل قبل مرور شهرين من الانضمام الحالي');
      return false;
    }

    // 2. التحقق من عدم وجود طلب قيد المراجعة
    try {
      const pendingQ = query(
        collection(db, 'agency_transfers'),
        where('hostId', '==', hostUid),
        where('status', '==', 'pending')
      );
      const pendingSnap = await getDocs(pendingQ);
      if (!pendingSnap.empty) {
        showAlert('لديك طلب تحويل معلق قيد المراجعة بالفعل في النظام');
        return false;
      }
    } catch (e) {
      console.warn('Pending transfers check notice:', e);
    }

    // 3. قاعدة الطلب الواحد / 30 يوم
    try {
      const recentQ = query(
        collection(db, 'agency_transfers'),
        where('hostId', '==', hostUid),
        orderBy('requestedAt', 'desc')
      );
      const recentSnap = await getDocs(recentQ);
      if (!recentSnap.empty) {
        const lastDoc = recentSnap.docs[0].data();
        const lastTime = lastDoc.requestedAt?.toMillis ? lastDoc.requestedAt.toMillis() : Date.now();
        const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000;
        if (Date.now() - lastTime < thirtyDaysMs && lastDoc.status !== 'cancelled') {
          showAlert('لا يمكن تقديم أكثر من طلب تحويل واحد خلال 30 يوماً');
          return false;
        }
      }
    } catch (e) {
      console.warn('30 days check notice:', e);
    }

    return true;
  };

  // إرسال طلب اعتيادي
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    const isValid = await validateCommon();
    if (!isValid) return;

    setIsSubmitting(true);
    try {
      let toAgencyName = `وكالة ${targetId.trim()}`;
      try {
        const agDoc = await getDoc(doc(db, 'agencies', targetId.trim()));
        if (agDoc.exists()) {
          toAgencyName = agDoc.data()?.name || agDoc.data()?.agencyName || toAgencyName;
        }
      } catch {}

      const transferId = `trans_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const transferData = {
        id: transferId,
        hostId: hostUid,
        hostName: currentUserName || 'المذيع',
        hostAvatar: currentUserAvatar || '',
        fromAgencyId: agencyGid || 'AG-101',
        fromAgencyName: agencyName || 'وكالة النخبة',
        toAgencyId: targetId.trim(),
        toAgencyName,
        reason: reason.trim() || 'طلب نقل اعتيادي',
        status: 'pending',
        isException: false,
        requestedAt: serverTimestamp(),
        reviewedAt: null,
        reviewedBy: null,
        reviewNote: ''
      };

      await setDoc(doc(db, 'agency_transfers', transferId), transferData);

      // تحديث حالة المستخدم في users/{uid}
      await setDoc(doc(db, 'users', hostUid), {
        agencyStatus: 'pending_transfer',
        lastTransferRequestId: transferId,
        updatedAt: serverTimestamp()
      }, { merge: true }).catch(() => {});

      showAlert('تم تقديم طلب التحويل بنجاح وهو قيد المراجعة الرسمية');
      setTimeout(() => onNavigate('transfer_history'), 1000);
    } catch (err: any) {
      showAlert('حدث خطأ أثناء إرسال الطلب: ' + (err.message || 'يرجى المحاولة ثانية'));
    } finally {
      setIsSubmitting(false);
    }
  };

  // إرسال طلب استثنائي (نقل فوري بدون راتب)
  const handleImmediateExceptionTransfer = async () => {
    if (isSubmitting) return;

    const isValid = await validateCommon();
    if (!isValid) return;

    setIsSubmitting(true);
    try {
      let toAgencyName = `وكالة ${targetId.trim()}`;
      try {
        const agDoc = await getDoc(doc(db, 'agencies', targetId.trim()));
        if (agDoc.exists()) {
          toAgencyName = agDoc.data()?.name || agDoc.data()?.agencyName || toAgencyName;
        }
      } catch {}

      const transferId = `trans_exc_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const transferData = {
        id: transferId,
        hostId: hostUid,
        hostName: currentUserName || 'المذيع',
        hostAvatar: currentUserAvatar || '',
        fromAgencyId: agencyGid || 'AG-101',
        fromAgencyName: agencyName || 'وكالة النخبة',
        toAgencyId: targetId.trim(),
        toAgencyName,
        reason: reason.trim() || 'نقل فوري استثنائي نظراً لعدم استلام راتب لمدة شهرين',
        status: 'auto_approved',
        isException: true,
        requestedAt: serverTimestamp(),
        reviewedAt: serverTimestamp(),
        reviewedBy: 'system_exception_rule',
        reviewNote: 'تمت الموافقة التلقائية الفورية استناداً للبند الاستثنائي'
      };

      await setDoc(doc(db, 'agency_transfers', transferId), transferData);

      // تطبيق النقل الفوري في ملف المستخدم
      await setDoc(doc(db, 'users', hostUid), {
        agencyId: targetId.trim(),
        agencyName: toAgencyName,
        agencyStatus: 'active',
        agencyJoinDate: new Date().toISOString(),
        lastTransferRequestId: transferId,
        updatedAt: serverTimestamp()
      }, { merge: true }).catch(() => {});

      showAlert('تم النقل الفوري الاستثنائي بنجاح! تم اعتماد وكالتك الجديدة فوراً.');
      setTimeout(() => onNavigate('transfer_history'), 1000);
    } catch (err: any) {
      showAlert('حدث خطأ أثناء تنفيذ النقل الفوري: ' + (err.message || 'خطأ'));
    } finally {
      setIsSubmitting(false);
    }
  };

  // استحقاق الاستثناء: مرور شهرين + آخر راتب 0
  const isEligibleForException = (monthsDiff !== null && monthsDiff >= 2) && 
    (hostStats?.earningsUsd === 0 || !userProfile?.lastSalaryAt || userProfile?.lastSalaryAt === 0);

  return (
    <div className="w-full max-w-md mx-auto p-4 space-y-4 font-sans text-right" dir="rtl">
      <form onSubmit={handleSubmit} className="rounded-3xl bg-white border border-slate-200 p-5 shadow-sm space-y-4">
        
        <div className="text-center space-y-1 border-b border-slate-100 pb-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-800 text-white flex items-center justify-center mx-auto text-xl shadow-xs">
            🔄
          </div>
          <h3 className="text-sm font-black text-slate-900">تقديم طلب تحويل الوكالة</h3>
          <p className="text-xs text-slate-500">يحق للمذيع طلب تغيير وكالته بعد مرور شهرين من الانضمام واستيفاء الشروط</p>
        </div>

        {/* Membership Duration Status Banner */}
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between text-xs">
          <span className="font-bold text-slate-600">مدة العضوية بالوكالة الحالية:</span>
          <span className="font-mono font-black text-slate-900">
            {loadingProfile ? 'جاري الفحص...' : `${monthsDiff ?? 0} أشهر`}
          </span>
        </div>

        {/* Agency ID Input */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 block">معرّف الوكالة الجديدة (Agency ID):</label>
          <input 
            type="text"
            placeholder="مثال: 30045"
            value={targetId}
            onChange={(e) => setTargetId(e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-mono font-bold text-slate-800 focus:outline-none focus:border-slate-400 focus:bg-white"
            required
          />
        </div>

        {/* Reason */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 block">سبب طلب التحويل (اختياري):</label>
          <textarea 
            rows={3}
            placeholder="اكتب سبب طلب النقل..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-800 focus:outline-none focus:border-slate-400 focus:bg-white resize-none"
          />
        </div>

        <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl text-[11px] text-amber-800 leading-relaxed font-medium">
          ⚠️ تنبيه نظامي: لا يحق تقديم طلب جديد إلا بعد مرور شهر كامل (30 يوماً) من آخر طلب سابق.
        </div>

        {/* Agree Terms */}
        <label className="flex items-center gap-2 cursor-pointer pt-1">
          <input 
            type="checkbox"
            checked={agreeTerms}
            onChange={(e) => setAgreeTerms(e.target.checked)}
            className="rounded border-slate-300 text-slate-800 focus:ring-0 w-4 h-4 cursor-pointer"
          />
          <span className="text-xs font-bold text-slate-700">أوافق على لوائح وسياسات تحويل المذيعين</span>
        </label>

        {/* Standard Submit Button */}
        <button 
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 bg-slate-900 text-white font-black text-xs rounded-2xl shadow-xs hover:bg-slate-800 active:scale-98 transition-all cursor-pointer border border-slate-700 disabled:opacity-50"
        >
          {isSubmitting ? 'جاري إرسال الطلب...' : 'إرسال طلب التحويل (للمراجعة)'}
        </button>

        {/* Rule 6: Immediate Exception Transfer Button */}
        {isEligibleForException && (
          <div className="pt-2 border-t border-slate-100 space-y-2">
            <div className="text-[11px] text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 p-2.5 rounded-xl text-center">
              ✨ أنت مؤهل للبند الاستثنائي (شهرين دون راتب): يمكنك النقل الفوري المباشر دون الحاجة للموافقة!
            </div>
            <button 
              type="button"
              onClick={handleImmediateExceptionTransfer}
              disabled={isSubmitting}
              className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-black text-xs rounded-2xl shadow-xs hover:opacity-90 active:scale-98 transition-all cursor-pointer border border-emerald-500 flex items-center justify-center gap-1.5"
            >
              <span>⚡ نقل فوري (استثناء شهرين بدون راتب)</span>
            </button>
          </div>
        )}

      </form>
    </div>
  );
};

/* ========================================================================= */
/* 5. TRANSFER HISTORY (سجل التحويل)                                          */
/* ========================================================================= */
interface AgencyTransferRecord {
  id: string;
  hostId: string;
  hostName: string;
  fromAgencyId: string;
  fromAgencyName: string;
  toAgencyId: string;
  toAgencyName: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected' | 'auto_approved' | 'cancelled';
  isException: boolean;
  requestedAt: any;
  reviewedAt: any;
  reviewNote?: string;
}

export const TransferHistoryView: React.FC<SubViewProps> = ({ 
  currentUserId,
  showAlert 
}) => {
  const [transfers, setTransfers] = useState<AgencyTransferRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const hostUid = currentUserId || '82639599';

  useEffect(() => {
    setLoading(true);
    const q = query(
      collection(db, 'agency_transfers'),
      where('hostId', '==', hostUid),
      orderBy('requestedAt', 'desc')
    );

    const unsub = onSnapshot(
      q,
      (snap) => {
        const list = snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<AgencyTransferRecord, 'id'>)
        }));
        setTransfers(list);
        setLoading(false);
      },
      (err) => {
        console.warn('Error fetching agency transfers history:', err);
        setLoading(false);
      }
    );

    return () => unsub();
  }, [hostUid]);

  const handleCancel = async (transferId: string) => {
    if (!confirm('هل أنت متأكد من رغبتك في إلغاء طلب التحويل؟')) return;
    setCancellingId(transferId);
    try {
      await updateDoc(doc(db, 'agency_transfers', transferId), {
        status: 'cancelled',
        reviewNote: 'تم إلغاء الطلب من قبل المذيع',
        reviewedAt: serverTimestamp()
      });

      await setDoc(doc(db, 'users', hostUid), {
        agencyStatus: 'active',
        updatedAt: serverTimestamp()
      }, { merge: true }).catch(() => {});

      showAlert('تم إلغاء طلب التحويل بنجاح');
    } catch (err: any) {
      showAlert('تعذر إلغاء الطلب: ' + (err.message || 'خطأ'));
    } finally {
      setCancellingId(null);
    }
  };

  const getStatusBadge = (status: string, isException: boolean) => {
    if (isException || status === 'auto_approved') {
      return (
        <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
          <span>⚡</span>
          <span>نقل فوري (استثناء)</span>
        </span>
      );
    }
    switch (status) {
      case 'pending':
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1">
            <span>⏳</span>
            <span>قيد المراجعة</span>
          </span>
        );
      case 'approved':
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
            <span>✅</span>
            <span>تمت الموافقة</span>
          </span>
        );
      case 'rejected':
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-rose-100 text-rose-800 border border-rose-300 flex items-center gap-1">
            <span>❌</span>
            <span>تم الرفض</span>
          </span>
        );
      case 'cancelled':
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-slate-100 text-slate-600 border border-slate-300">
            تم الإلغاء
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
            {status}
          </span>
        );
    }
  };

  const formatDate = (val: any) => {
    if (!val) return 'الآن';
    const date = val.toDate ? val.toDate() : new Date(val);
    return date.toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 space-y-4 font-sans text-right" dir="rtl">
      
      {/* Loading Skeleton */}
      {loading && (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="rounded-3xl bg-white border border-slate-200 p-5 shadow-sm space-y-3 animate-pulse">
              <div className="flex justify-between items-center">
                <div className="h-5 w-24 bg-slate-200 rounded-full" />
                <div className="h-4 w-32 bg-slate-200 rounded" />
              </div>
              <div className="h-3 w-48 bg-slate-200 rounded" />
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && transfers.length === 0 && (
        <div className="rounded-3xl bg-white border border-slate-200 p-8 shadow-sm text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center mx-auto text-2xl">
            📋
          </div>
          <h3 className="text-sm font-black text-slate-900">سجل طلبات التحويل</h3>
          <p className="text-xs text-slate-400 font-bold py-4">لا توجد طلبات تحويل مسجلة حالياً</p>
        </div>
      )}

      {/* Transfers List */}
      {!loading && transfers.length > 0 && (
        <div className="space-y-3">
          {transfers.map((item) => (
            <div 
              key={item.id}
              className="rounded-3xl bg-white border border-slate-200 p-4 sm:p-5 shadow-xs space-y-3 hover:border-slate-300 transition-all"
            >
              {/* Header: Target Agency & Status */}
              <div className="flex items-center justify-between">
                <div>{getStatusBadge(item.status, item.isException)}</div>
                <div className="text-right">
                  <div className="text-xs font-black text-slate-900 flex items-center gap-1">
                    <span>إلى: {item.toAgencyName || `وكالة ${item.toAgencyId}`}</span>
                  </div>
                  <div className="text-[10px] font-mono text-slate-500 mt-0.5">
                    Agency ID: {item.toAgencyId}
                  </div>
                </div>
              </div>

              {/* Agency transfer flow */}
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-[11px] font-bold">
                <span className="text-slate-500">من: {item.fromAgencyName || item.fromAgencyId}</span>
                <span className="text-slate-400">⬅</span>
                <span className="text-slate-900 font-black">إلى: {item.toAgencyName || item.toAgencyId}</span>
              </div>

              {/* Reason / Review note if any */}
              {item.reason && (
                <div className="text-xs text-slate-600 bg-white p-2 rounded-xl border border-slate-100">
                  <span className="font-bold text-slate-700">السبب: </span>
                  <span>{item.reason}</span>
                </div>
              )}

              {item.reviewNote && (
                <div className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded-xl border border-slate-200">
                  <span className="font-bold text-slate-800">ملاحظة الإدارة: </span>
                  <span>{item.reviewNote}</span>
                </div>
              )}

              {/* Footer: Date & Cancel Action if pending */}
              <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[11px]">
                <div className="text-slate-400 font-mono">
                  {formatDate(item.requestedAt)}
                </div>

                {item.status === 'pending' && (
                  <button 
                    onClick={() => handleCancel(item.id)}
                    disabled={cancellingId === item.id}
                    className="px-3 py-1 rounded-full text-[10px] font-black bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {cancellingId === item.id ? 'جاري الإلغاء...' : 'إلغاء الطلب'}
                  </button>
                )}
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};

/* ========================================================================= */
/* 6. TRANSFER FAQ (تعليقات على التحويل)                                      */
/* ========================================================================= */
export const TransferFaqView: React.FC<SubViewProps> = () => {
  return (
    <div className="w-full max-w-md mx-auto p-4 space-y-3 font-sans text-right" dir="rtl">
      <div className="rounded-3xl bg-white border border-slate-200 p-5 shadow-sm space-y-4">
        
        <h3 className="text-sm font-black text-slate-900 border-b border-slate-100 pb-2">قواعد وشروط تحويل الوكالة</h3>
        
        <div className="space-y-3 text-xs text-slate-700 leading-relaxed">
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
            <div className="font-black text-slate-900 mb-1">1. متى يحق لي طلب التحويل؟</div>
            <p className="text-slate-600">يحق للمذيع طلب التحويل بعد إكمال المدة المحددة في العقد أو بموافقة الطرفين.</p>
          </div>

          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
            <div className="font-black text-slate-900 mb-1">2. كم تستغرق فترة المراجعة؟</div>
            <p className="text-slate-600">تتم معالجة الطلبات خلال 24 - 48 ساعة بواسطة إدارة الوكالات المركزية.</p>
          </div>

          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
            <div className="font-black text-slate-900 mb-1">3. ماذا يحدث لأرباحي الحالية؟</div>
            <p className="text-slate-600">تحتفظ بكامل أرباحك وتتحول تلقائياً إلى حسابك دون أي نقصان.</p>
          </div>
        </div>

      </div>
    </div>
  );
};

/* ========================================================================= */
/* 7. SUPPORTERS VIEW (داعمي)                                                */
/* ========================================================================= */
interface SupporterDocument {
  id: string;
  supporterUid?: string;
  supporterName?: string;
  supporterAvatar?: string;
  totalDiamonds?: number;
  totalCoins?: number;
  supportCount?: number;
  lastSupportAt?: any;
}

export const SupportersView: React.FC<SubViewProps> = ({ currentUserId }) => {
  const [selectedMonth] = useState('2026/08');
  const [supporters, setSupporters] = useState<SupporterDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalDiamonds, setTotalDiamonds] = useState(0);

  const hostUid = currentUserId || '82639599';

  useEffect(() => {
    setLoading(true);
    const q = query(
      collection(db, 'users', hostUid, 'supporters'),
      orderBy('totalDiamonds', 'desc')
    );

    const unsub = onSnapshot(
      q,
      (snap) => {
        const list: SupporterDocument[] = snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<SupporterDocument, 'id'>)
        }));
        setSupporters(list);
        const sum = list.reduce((acc, s) => acc + (Number(s.totalDiamonds) || 0), 0);
        setTotalDiamonds(sum);
        setLoading(false);
      },
      (err) => {
        console.warn('Error fetching supporters from Firestore:', err);
        setLoading(false);
      }
    );

    return () => unsub();
  }, [hostUid]);

  return (
    <div className="w-full max-w-md mx-auto p-4 space-y-3.5 font-sans text-right" dir="rtl">
      
      {/* Month Selector & Total Diamonds Banner */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 shadow-2xs text-xs font-bold text-slate-800">
          <span>{selectedMonth}</span>
          <span className="text-[10px] text-slate-400">▼</span>
        </div>
        <div className="text-right">
          <div className="text-[11px] font-bold text-slate-500">إجمالي دعم القائمة</div>
          <div className="text-sm font-black font-mono text-slate-900 flex items-center gap-1 justify-end">
            <span>{totalDiamonds.toLocaleString('en-US')}</span>
            <span>💎</span>
          </div>
        </div>
      </div>

      {/* Loading Skeleton */}
      {loading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-3xl bg-white border border-slate-200 p-4 shadow-sm flex items-center justify-between animate-pulse">
              <div className="space-y-2 text-left">
                <div className="h-3 w-20 bg-slate-200 rounded" />
                <div className="h-4 w-12 bg-slate-200 rounded" />
              </div>
              <div className="flex items-center gap-3">
                <div className="space-y-2 text-right">
                  <div className="h-3 w-24 bg-slate-200 rounded" />
                  <div className="h-2.5 w-16 bg-slate-200 rounded" />
                </div>
                <div className="w-12 h-12 rounded-full bg-slate-200" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && supporters.length === 0 && (
        <div className="rounded-3xl bg-white border border-slate-200 p-8 text-center space-y-3 shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto text-2xl">
            🤲
          </div>
          <h3 className="text-sm font-black text-slate-800 font-serif">لا يوجد داعمون حتى الآن</h3>
          <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
            عندما يقوم المستخدمون بإرسال الهدايا والدعم إليك في الروم، ستظهر أسماؤهم وتصنيفاتهم هنا لحظياً.
          </p>
        </div>
      )}

      {/* Supporters List */}
      {!loading && supporters.length > 0 && (
        <div className="space-y-2.5">
          {supporters.map((supporter, index) => {
            const diamonds = Number(supporter.totalDiamonds) || 0;
            const rankEmoji = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`;
            return (
              <div 
                key={supporter.id} 
                className="rounded-3xl bg-white border border-slate-200 p-4 shadow-sm flex items-center justify-between hover:bg-slate-50 transition-colors"
              >
                {/* Support Diamond Stats */}
                <div className="text-left space-y-0.5">
                  <div className="text-[10px] font-bold text-slate-500">إجمالي الدعم:</div>
                  <div className="font-mono font-black text-sm text-slate-900 flex items-center gap-1 justify-end">
                    <span>{diamonds.toLocaleString('en-US')}</span>
                    <span>💎</span>
                  </div>
                </div>

                {/* User Info & Badges */}
                <div className="flex items-center gap-3">
                  <div className="text-right space-y-1">
                    <div className="text-xs font-black text-slate-900 flex items-center gap-1.5 justify-end">
                      <span>{supporter.supporterName || 'داعم'}</span>
                      <span className="text-xs font-mono font-bold text-slate-500">{rankEmoji}</span>
                    </div>
                    <div className="text-[10px] font-mono text-slate-500">
                      ID: {supporter.supporterUid || supporter.id}
                    </div>
                    
                    {/* Badges Pill Row */}
                    <div className="flex items-center justify-end gap-1 text-[9px] font-bold">
                      <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                        {supporter.supportCount || 1} 💖
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-200">
                        {diamonds >= 1000 ? 'VIP 👑' : 'داعم 🌟'}
                      </span>
                    </div>
                  </div>

                  {/* User Avatar */}
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-slate-300 shadow-2xs bg-slate-100">
                      <img 
                        src={supporter.supporterAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'} 
                        alt={supporter.supporterName || 'داعم'} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200';
                        }}
                      />
                    </div>
                    {index < 3 && (
                      <span className="absolute -bottom-1 -left-1 text-xs">
                        {index === 0 ? '👑' : ''}
                      </span>
                    )}
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Bottom Serial Hash */}
      <div className="text-center pt-8 text-[11px] font-mono text-slate-400 font-bold tracking-widest opacity-80">
        e2b39057dc
      </div>

    </div>
  );
};

/* ========================================================================= */
/* 8. EARNINGS DETAILS / SALARY SLIP (قسيمة الراتب)                          */
/* ========================================================================= */
export const EarningsDetailsView: React.FC<SubViewProps> = ({ onNavigate, hostStats }) => {
  const [selectedMonth, setSelectedMonth] = useState('2026/08');
  const [showLevelsModal, setShowLevelsModal] = useState(false);
  const [levels, setLevels] = useState<any[]>(FALLBACK_TARGET_SYSTEM_LEVELS);
  const [levelsLoading, setLevelsLoading] = useState(true);

  const rate = hostStats?.exchangeRateDiamondsPerUsd || 13500;
  const rawDiamonds = hostStats?.diamondsEarned !== undefined ? Number(hostStats.diamondsEarned) : 8377;
  const calculatedUsd = hostStats?.diamondsEarned !== undefined 
    ? (hostStats.diamondsEarned / rate).toFixed(2)
    : (hostStats?.earningsUsd !== undefined ? Number(hostStats.earningsUsd).toFixed(2) : '0.62');
  const usdEarnings = hostStats?.earningsUsd !== undefined ? Number(hostStats.earningsUsd).toFixed(2) : calculatedUsd;
  const diamondsCount = hostStats?.diamondsEarned !== undefined ? hostStats.diamondsEarned.toLocaleString('en-US') : '8,377';
  const qualifiedDays = hostStats?.qualifiedDays ?? 5;
  const qualifiedDaysTarget = hostStats?.qualifiedDaysTarget ?? 15;

  useEffect(() => {
    if (!showLevelsModal) return;
    setLevelsLoading(true);

    const docRef = doc(db, 'configs', 'target_system');
    const unsubscribe = onSnapshot(docRef, (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        if (data.levels && Array.isArray(data.levels) && data.levels.length > 0) {
          setLevels(data.levels);
        }
      }
      setLevelsLoading(false);
    }, (err) => {
      console.warn('Error reading target_system config from Firestore:', err);
      setLevelsLoading(false);
    });

    return () => unsubscribe();
  }, [showLevelsModal]);

  // Determine current active rank/level based on diamonds earned
  const currentRank = levels.reduce((best, lvl) => {
    if (rawDiamonds >= lvl.diamonds) {
      return lvl.rank;
    }
    return best;
  }, 0);

  return (
    <div className="w-full max-w-md mx-auto p-4 space-y-3.5 font-sans text-right" dir="rtl">
      
      {/* Month Picker Dropdown */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 shadow-2xs text-xs font-bold text-slate-800">
          <span>{selectedMonth}</span>
          <span className="text-[10px] text-slate-400">▼</span>
        </div>
        <span className="text-xs font-bold text-slate-500">اختر الشهر</span>
      </div>

      {/* Card 1: إجمالي الراتب */}
      <div className="rounded-3xl bg-white border border-slate-200 p-5 shadow-sm space-y-2">
        <div className="text-xs font-bold text-slate-800">إجمالي الراتب المحول من الألماس:</div>
        <div className="font-mono font-black text-3xl text-emerald-600 text-left" dir="ltr">
          {usdEarnings} $
        </div>
        <div className="text-[11px] font-bold text-slate-500 border-t border-slate-100 pt-2 flex items-center justify-between">
          <span>سعر الصرف المركزي: {rate.toLocaleString('en-US')} 💎 = 1.00 $</span>
          <span className="text-slate-800 font-mono font-black">{diamondsCount} 💎</span>
        </div>
      </div>

      {/* Card 2: الراتب الأساسي */}
      <div className="rounded-3xl bg-white border border-slate-200 p-4 shadow-sm space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-mono font-black text-base text-slate-900" dir="ltr">{usdEarnings} $</span>
          <span className="text-xs font-bold text-slate-800 flex items-center gap-1">
            <span>الراتب الأساسي:</span>
            <span className="w-3.5 h-3.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 flex items-center justify-center text-[9px] font-bold">؟</span>
          </span>
        </div>
        <div className="text-[11px] font-bold text-slate-500 border-t border-slate-100 pt-2 flex items-center justify-between">
          <span className="font-mono font-bold text-slate-800" dir="ltr">{usdEarnings} $</span>
          <span>راتب المستوى ({hostStats?.hostLevel || 'LV.5'}):</span>
        </div>
      </div>

      {/* Card 3: الراتب الغير مفكوك */}
      <div className="rounded-3xl bg-white border border-slate-200 p-4 shadow-sm space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-mono font-black text-base text-slate-900" dir="ltr">0.00 $</span>
          <span className="text-xs font-bold text-slate-800 flex items-center gap-1">
            <span>الراتب الغير مفكوك:</span>
            <span className="w-3.5 h-3.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 flex items-center justify-center text-[9px] font-bold">؟</span>
          </span>
        </div>
        <div className="text-[11px] font-bold text-slate-500 border-t border-slate-100 pt-2 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className={qualifiedDays >= qualifiedDaysTarget ? "text-emerald-600 font-bold" : "text-amber-500 font-bold"}>
              {qualifiedDays >= qualifiedDaysTarget ? 'مكتملة' : 'قيد الإنجاز'}
            </span>
            <span className="font-mono font-bold text-slate-800">{qualifiedDays}/{qualifiedDaysTarget}</span>
          </div>
          <span>يوم (أيام) البث:</span>
        </div>
      </div>

      {/* Button: عرض جدول المستويات */}
      <div className="pt-1">
        <button 
          type="button"
          onClick={() => setShowLevelsModal(true)}
          className="w-full py-3 px-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs shadow-sm border border-slate-700 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98"
        >
          <Trophy className="w-4 h-4 text-amber-400" />
          <span>عرض جدول المستويات (نظام التارجت)</span>
          <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
        </button>
      </div>

      {/* Bottom Link: التحقق من بيانات البث */}
      <div className="pt-2 text-center">
        <button 
          onClick={() => onNavigate('records')}
          className="text-xs font-bold text-slate-700 hover:text-slate-900 underline cursor-pointer"
        >
          التحقق من بيانات البث
        </button>
      </div>

      {/* Levels Modal */}
      {showLevelsModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 z-50 animate-in fade-in duration-200">
          <div 
            className="bg-white rounded-3xl w-full max-w-lg max-h-[85vh] border border-slate-200 shadow-2xl flex flex-col text-right font-sans overflow-hidden"
            dir="rtl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <button 
                type="button"
                onClick={() => setShowLevelsModal(false)}
                className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-700 flex items-center justify-center text-sm font-bold cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="text-right">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm sm:text-base font-black text-slate-900">
                    جدول المستويات لنظام التارجت
                  </h3>
                  <span className="text-lg">🏆</span>
                </div>
                <p className="text-[11px] text-slate-500 font-bold mt-0.5">
                  رصيدك: <span className="font-mono text-emerald-600 font-black">{diamondsCount} 💎</span> (المستوى المحقق: {currentRank > 0 ? `LV.${currentRank}` : 'قيد الإنجاز'})
                </p>
              </div>
            </div>

            {/* Content List */}
            <div className="p-4 overflow-y-auto space-y-2 flex-1">
              {levelsLoading ? (
                <div className="space-y-2 animate-pulse">
                  {[1, 2, 3, 4, 5, 6].map((idx) => (
                    <div key={idx} className="h-14 bg-slate-100 rounded-2xl w-full" />
                  ))}
                </div>
              ) : (
                levels.map((lvl) => {
                  const isCurrent = currentRank === lvl.rank;
                  const isPassed = rawDiamonds >= lvl.diamonds;

                  return (
                    <div 
                      key={lvl.rank}
                      className={`p-3 rounded-2xl border transition-all flex items-center justify-between text-xs ${
                        isCurrent 
                          ? 'bg-amber-50/80 border-amber-400 shadow-xs ring-1 ring-amber-300' 
                          : isPassed 
                            ? 'bg-emerald-50/40 border-emerald-200 text-slate-800' 
                            : 'bg-white border-slate-200 text-slate-700'
                      }`}
                    >
                      {/* Host Earnings Only (Agency commission is hidden) */}
                      <div className="text-left font-mono">
                        <div className="font-black text-emerald-600 text-sm">
                          ${lvl.hostUsd} <span className="text-[10px] text-slate-500 font-sans">راتب المضيف</span>
                        </div>
                      </div>

                      {/* Rank & Diamonds */}
                      <div className="flex items-center gap-2.5">
                        <div className="text-right">
                          <div className="font-black text-slate-900 flex items-center gap-1.5 justify-end">
                            {isCurrent && (
                              <span className="px-1.5 py-0.5 rounded-full bg-amber-200 text-amber-900 text-[9px] font-black animate-pulse">
                                مستواك الحالي 🎯
                              </span>
                            )}
                            <span>المستوى {lvl.rank}</span>
                          </div>
                          <div className="text-[11px] font-mono font-bold text-slate-500">
                            {Number(lvl.diamonds).toLocaleString('en-US')} 💎
                          </div>
                        </div>

                        {/* Rank Badge */}
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-mono font-black text-xs ${
                          isCurrent 
                            ? 'bg-amber-400 text-amber-950 font-black shadow-xs' 
                            : isPassed 
                              ? 'bg-emerald-100 text-emerald-800' 
                              : 'bg-slate-100 text-slate-600'
                        }`}>
                          #{lvl.rank}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-700">
              <span className="flex items-center gap-1 font-mono text-emerald-700 font-black">
                <span>رصيدك:</span>
                <span>{diamondsCount} 💎</span>
              </span>
              <button
                type="button"
                onClick={() => setShowLevelsModal(false)}
                className="px-4 py-1.5 bg-slate-900 text-white rounded-xl text-xs font-black cursor-pointer hover:bg-slate-800"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

/* ========================================================================= */
/* 9. WALLET VIEW (محفظتي)                                                   */
/* ========================================================================= */
export const WalletView: React.FC<SubViewProps> = ({ 
  showAlert, 
  hostStats,
  currentUserId = '82639599',
  currentUserName = 'أبو مجد(M✈️)'
}) => {
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [recipientUid, setRecipientUid] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Available balance calculation from gifts / host stats
  const availableEarnings = hostStats?.earningsUsd !== undefined 
    ? Number(hostStats.earningsUsd).toFixed(2) 
    : '25.50';

  // Mock recipient lookup based on UID entered
  const getRecipientInfo = (uid: string) => {
    const trimmed = uid.trim();
    if (!trimmed) return null;
    
    if (trimmed === '82639599' || trimmed.startsWith('82')) {
      return {
        name: 'ابوامجدMá🎼 (رئيس وكالة)',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150',
        badge: '👑 معتمد'
      };
    }
    return {
      name: `مستخدم معتمد (${trimmed})`,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
      badge: '✓ موثق'
    };
  };

  const recipient = getRecipientInfo(recipientUid);

  const handleConfirmWithdraw = async () => {
    if (!recipientUid.trim()) {
      showAlert('يرجى إدخال UID المستلم أولاً');
      return;
    }
    const num = parseFloat(withdrawAmount);
    if (isNaN(num) || num <= 0) {
      showAlert('يرجى إدخال مبلغ صالح للسحب');
      return;
    }
    if (num > parseFloat(availableEarnings)) {
      showAlert(`المبلغ المطلوب ($${num}) أكبر من الرصيد المتاح ($${availableEarnings})`);
      return;
    }
    
    setIsSubmitting(true);
    try {
      const result = await sendReceiveSupport(recipientUid.trim(), {
        senderId: currentUserId,
        senderName: currentUserName,
        giftId: 'withdrawal',
        giftName: 'سحب رصيد',
        giftValue: Math.round(num * 13500),  // 13500 ماسة = $1
        roomId: undefined
      });

      if (result.success) {
        showAlert('✅ تم السحب بنجاح');
        setShowWithdrawModal(false);
        setRecipientUid('');
        setWithdrawAmount('');
      } else {
        showAlert(`⚠️ فشل: ${result.error || 'تعذر معالجة طلب السحب'}`);
      }
    } catch (err: any) {
      showAlert(`⚠️ خطأ: ${err?.message || 'حدث خطأ أثناء السحب'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 space-y-4 font-sans text-right" dir="rtl">
      <div className="rounded-3xl bg-white border border-slate-200 p-5 shadow-sm space-y-4">
        
        <div className="text-center space-y-1">
          <span className="text-xs font-bold text-slate-500">رصيد المحفظة المتاح للسحب</span>
          <div className="font-mono font-black text-3xl text-emerald-600" dir="ltr">${availableEarnings}</div>
          <div className="text-[11px] font-bold text-slate-600">من حصيلة هدايا ودعم البث المباشر 💎</div>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-2">
          <button 
            type="button"
            onClick={() => showAlert('جاري تحويل الماسات إلى رصيد نقدي...')}
            className="py-2.5 px-3 bg-slate-100 border border-slate-200 text-slate-800 rounded-2xl text-xs font-black hover:bg-slate-200 transition-all cursor-pointer"
          >
            استبدال الماسات 💎
          </button>
          <button 
            type="button"
            onClick={() => setShowWithdrawModal(true)}
            className="py-2.5 px-3 bg-slate-900 text-white rounded-2xl text-xs font-black shadow-xs hover:bg-slate-800 transition-all cursor-pointer border border-slate-700"
          >
            سحب الأرباح 💳
          </button>
        </div>

      </div>

      {/* Withdrawal Modal (المستطيل 1 + المستطيل 2) */}
      {showWithdrawModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div 
            className="bg-white rounded-3xl p-5 w-full max-w-sm border border-slate-200 shadow-2xl space-y-4 text-right font-sans"
            dir="rtl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <button 
                type="button"
                onClick={() => !isSubmitting && setShowWithdrawModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-slate-900 flex items-center justify-center text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-black text-slate-900">طلب سحب الأرباح</h3>
                <span className="text-base">💳</span>
              </div>
            </div>

            {/* 📱 المستطيل 1: إدخال UID المستلم */}
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                <span>📱</span>
                <span>المستطيل 1: معرّف المستلم (UID)</span>
              </label>
              
              <input 
                type="text"
                placeholder="أدخل UID المستلم (مثال: 82639599)..."
                value={recipientUid}
                onChange={(e) => setRecipientUid(e.target.value)}
                disabled={isSubmitting}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-mono font-bold text-slate-800 focus:outline-none focus:border-slate-400 focus:bg-white"
                autoFocus
              />

              {/* Dynamic Recipient Preview Card */}
              {recipient ? (
                <div className="flex items-center justify-between p-2.5 bg-emerald-50/70 border border-emerald-200 rounded-2xl animate-in fade-in duration-150">
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    {recipient.badge}
                  </span>
                  <div className="flex items-center gap-2.5">
                    <div className="text-right">
                      <div className="text-xs font-black text-slate-900">{recipient.name}</div>
                      <div className="text-[10px] font-mono text-slate-500">UID: {recipientUid}</div>
                    </div>
                    <img 
                      src={recipient.avatar} 
                      alt="Recipient Avatar" 
                      className="w-9 h-9 rounded-full object-cover border border-emerald-300 shadow-2xs"
                    />
                  </div>
                </div>
              ) : (
                <p className="text-[10px] text-slate-400 px-1">
                  * اكتب الـ UID لعرض صورة واسم الشخص المستلم فورياً
                </p>
              )}
            </div>

            {/* 💰 المستطيل 2: إدخال المبلغ */}
            <div className="space-y-2 pt-1 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-emerald-700 font-mono">
                  المتاح: ${availableEarnings} (من الهدايا)
                </span>
                <label className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                  <span>💰</span>
                  <span>المستطيل 2: إدخال المبلغ ($)</span>
                </label>
              </div>

              <div className="relative">
                <input 
                  type="number"
                  step="0.01"
                  min="1"
                  max={availableEarnings}
                  placeholder="0.00"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  disabled={isSubmitting}
                  className="w-full px-4 py-2.5 pl-12 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-mono font-black text-slate-900 focus:outline-none focus:border-slate-400 focus:bg-white text-left"
                  dir="ltr"
                />
                <button
                  type="button"
                  onClick={() => setWithdrawAmount(availableEarnings)}
                  disabled={isSubmitting}
                  className="absolute right-2 top-2 px-2.5 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 text-[10px] font-black rounded-lg cursor-pointer transition-colors"
                >
                  الكل
                </button>
              </div>
            </div>

            {/* Notice */}
            <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-[10.5px] text-emerald-800 leading-relaxed font-medium">
              ℹ️ سعر التحويل المعتمد: 13,500 ماسة = $1.00 يتم الخصم والإيداع المباشر بالسيرفر المركزي.
            </div>

            {/* Modal Actions */}
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button 
                type="button"
                onClick={handleConfirmWithdraw}
                disabled={isSubmitting}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-black text-xs rounded-2xl shadow-xs transition-colors cursor-pointer border border-emerald-700 flex items-center justify-center gap-1.5"
              >
                {isSubmitting ? (
                  <span>جاري معالجة السحب...</span>
                ) : (
                  <span>تأكيد السحب</span>
                )}
              </button>
              <button 
                type="button"
                onClick={() => setShowWithdrawModal(false)}
                disabled={isSubmitting}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-2xl transition-colors cursor-pointer border border-slate-200"
              >
                إلغاء
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};


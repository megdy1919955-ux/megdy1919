import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronRight, 
  HelpCircle, 
  X, 
  Crown, 
  Shield, 
  Sparkles, 
  Eye, 
  EyeOff, 
  Car, 
  Heart, 
  UserCheck, 
  MessageSquare, 
  Zap, 
  Gift, 
  ShieldAlert, 
  ShieldCheck, 
  FileText, 
  Edit3, 
  CreditCard, 
  Smile, 
  Home, 
  Image as ImageIcon, 
  LogOut, 
  Radio, 
  Award,
  Lock,
  Check
} from 'lucide-react';
import { UserProfileData } from '../types';

interface VipCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile?: UserProfileData;
  onUpgrade?: (newVipLevel: string) => void;
}

// Full List of 26 VIP Privileges matching the screenshot
interface PrivilegeItem {
  id: string;
  name: string;
  minVip: number;
  icon: React.ReactNode;
  description: string;
}

// 3D Majestic Golden Crest SVG with Royal Lion, Imperial Crown, Glowing Blue Crystals, and Silk Ribbon
const VipRoyalCrest: React.FC<{ level: number; className?: string }> = ({ level, className = "w-64 h-64" }) => {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* Background Golden & Blue Cosmic Glow */}
      <div className="absolute inset-0 bg-radial from-amber-500/25 via-blue-600/10 to-transparent blur-2xl rounded-full scale-110 pointer-events-none" />
      
      <svg className="w-full h-full drop-shadow-[0_12px_28px_rgba(0,0,0,0.85)]" viewBox="0 0 240 240" fill="none">
        <defs>
          <linearGradient id="crestGoldLight" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FFFBE6" />
            <stop offset="30%" stopColor="#FAD663" />
            <stop offset="60%" stopColor="#E5A71F" />
            <stop offset="100%" stopColor="#8A5809" />
          </linearGradient>
          <linearGradient id="crestGoldDark" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F5CD47" />
            <stop offset="50%" stopColor="#B87D14" />
            <stop offset="100%" stopColor="#5E3A03" />
          </linearGradient>
          <linearGradient id="crystalBlue" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#E0F2FE" />
            <stop offset="30%" stopColor="#38BDF8" />
            <stop offset="70%" stopColor="#0284C7" />
            <stop offset="100%" stopColor="#082F49" />
          </linearGradient>
          <linearGradient id="crystalPurple" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#F5D0FE" />
            <stop offset="40%" stopColor="#C084FC" />
            <stop offset="80%" stopColor="#7E22CE" />
            <stop offset="100%" stopColor="#3B0764" />
          </linearGradient>
          <linearGradient id="royalRibbon" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#1E3A8A" />
            <stop offset="25%" stopColor="#3B82F6" />
            <stop offset="50%" stopColor="#60A5FA" />
            <stop offset="75%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#1E3A8A" />
          </linearGradient>
          <radialGradient id="sunburst" cx="50%" cy="45%" r="50%">
            <stop offset="0%" stopColor="#FFFDEB" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Outer Radiant Sunburst Rays */}
        <g opacity="0.65">
          <circle cx="120" cy="110" r="75" fill="url(#sunburst)" />
        </g>

        {/* Back Wings (Left and Right) */}
        <g filter="drop-shadow(0 4px 6px rgba(0,0,0,0.5))">
          {/* Left Wing Feathers */}
          <path d="M120 100 C90 70 50 75 30 105 C45 105 60 115 70 130 C50 125 35 135 25 150 C45 150 65 160 80 175 C95 160 110 140 120 125 Z" fill="url(#crestGoldDark)" stroke="#FFF6CE" strokeWidth="1" />
          {/* Right Wing Feathers */}
          <path d="M120 100 C150 70 190 75 210 105 C195 105 180 115 170 130 C190 125 205 135 215 150 C195 150 175 160 160 175 C145 160 130 140 120 125 Z" fill="url(#crestGoldDark)" stroke="#FFF6CE" strokeWidth="1" />
        </g>

        {/* Imperial Crown Spikes on Top */}
        <g>
          {/* Central Peak */}
          <path d="M120 22 L128 55 H112 Z" fill="url(#crestGoldLight)" stroke="#FFFDF0" strokeWidth="1" />
          <circle cx="120" cy="20" r="5" fill="url(#crestGoldLight)" stroke="#FFF" strokeWidth="1" />
          {/* Left Peaks */}
          <path d="M102 32 L112 58 H96 Z" fill="url(#crestGoldLight)" stroke="#FFFDF0" strokeWidth="0.8" />
          <circle cx="101" cy="30" r="4" fill="url(#crystalBlue)" stroke="#FFF" strokeWidth="0.8" />
          <path d="M85 45 L98 65 H82 Z" fill="url(#crestGoldDark)" stroke="#FFFDF0" strokeWidth="0.8" />
          <circle cx="84" cy="43" r="3.5" fill="url(#crestGoldLight)" stroke="#FFF" strokeWidth="0.8" />
          {/* Right Peaks */}
          <path d="M138 32 L144 58 H128 Z" fill="url(#crestGoldLight)" stroke="#FFFDF0" strokeWidth="0.8" />
          <circle cx="139" cy="30" r="4" fill="url(#crystalBlue)" stroke="#FFF" strokeWidth="0.8" />
          <path d="M155 45 L158 65 H142 Z" fill="url(#crestGoldDark)" stroke="#FFFDF0" strokeWidth="0.8" />
          <circle cx="156" cy="43" r="3.5" fill="url(#crestGoldLight)" stroke="#FFF" strokeWidth="0.8" />
        </g>

        {/* Crown Arched Diadem Base */}
        <path d="M78 68 C105 60 135 60 162 68 L168 80 C138 72 102 72 72 80 Z" fill="url(#crestGoldLight)" stroke="#FFF8E0" strokeWidth="1" />
        
        {/* Glowing Sapphire Jewels on Crown Band */}
        <circle cx="95" cy="71" r="3" fill="url(#crystalBlue)" stroke="#FFF" strokeWidth="0.6" />
        <circle cx="120" cy="69" r="4.5" fill="url(#crystalPurple)" stroke="#FFF" strokeWidth="0.8" />
        <circle cx="145" cy="71" r="3" fill="url(#crystalBlue)" stroke="#FFF" strokeWidth="0.6" />

        {/* Large Left Blue Diamond / Crystal Gem */}
        <g filter="drop-shadow(0 4px 8px rgba(2,132,199,0.7))">
          <polygon points="56,86 78,86 90,105 67,132 44,105" fill="url(#crystalBlue)" stroke="#E0F2FE" strokeWidth="1.2" />
          <polygon points="56,86 78,86 67,105" fill="#E0F2FE" opacity="0.6" />
          <polygon points="44,105 67,105 67,132" fill="#0369A1" opacity="0.8" />
          <polygon points="90,105 67,105 67,132" fill="#38BDF8" opacity="0.9" />
          {/* Glint */}
          <circle cx="60" cy="94" r="1.5" fill="#FFF" />
        </g>

        {/* Large Right Blue Diamond / Crystal Gem */}
        <g filter="drop-shadow(0 4px 8px rgba(2,132,199,0.7))">
          <polygon points="162,86 184,86 196,105 173,132 150,105" fill="url(#crystalBlue)" stroke="#E0F2FE" strokeWidth="1.2" />
          <polygon points="162,86 184,86 173,105" fill="#E0F2FE" opacity="0.6" />
          <polygon points="150,105 173,105 173,132" fill="#0369A1" opacity="0.8" />
          <polygon points="196,105 173,105 173,132" fill="#38BDF8" opacity="0.9" />
          {/* Glint */}
          <circle cx="180" cy="94" r="1.5" fill="#FFF" />
        </g>

        {/* Central Royal Golden Lion / Guardian Mask */}
        <g filter="drop-shadow(0 6px 12px rgba(0,0,0,0.7))">
          {/* Face Base */}
          <path d="M120 78 C100 78 85 92 88 115 C90 135 105 152 120 158 C135 152 150 135 152 115 C155 92 140 78 120 78 Z" fill="url(#crestGoldLight)" stroke="#FFFDF0" strokeWidth="1.5" />
          
          {/* Lion Eyes (Glowing Blue / Cyan) */}
          <polygon points="102,105 112,108 106,112 98,110" fill="#00F0FF" filter="drop-shadow(0 0 4px #00F0FF)" />
          <polygon points="138,105 128,108 134,112 142,110" fill="#00F0FF" filter="drop-shadow(0 0 4px #00F0FF)" />

          {/* Golden Brow & Snout Details */}
          <path d="M100 96 C110 102 130 102 140 96 L136 104 C128 100 112 100 104 104 Z" fill="url(#crestGoldDark)" />
          <path d="M114 116 L126 116 L120 126 Z" fill="#451A03" />
          <path d="M110 128 C116 134 124 134 130 128" stroke="#6B3A0A" strokeWidth="2" strokeLinecap="round" />

          {/* Lion Golden Whiskers & Mane Tufts */}
          <path d="M84 105 C75 115 76 130 84 140 C88 132 88 120 86 110 Z" fill="url(#crestGoldLight)" />
          <path d="M156 105 C165 115 164 130 156 140 C152 132 152 120 154 110 Z" fill="url(#crestGoldLight)" />
        </g>

        {/* Left Guardian Lion Body & Paws */}
        <g>
          <path d="M72 138 C60 142 55 155 58 168 C68 172 80 165 82 150 Z" fill="url(#crestGoldLight)" stroke="#FFE899" strokeWidth="0.8" />
          <circle cx="68" cy="155" r="5" fill="url(#crestGoldDark)" />
        </g>

        {/* Right Guardian Lion Body & Paws */}
        <g>
          <path d="M168 138 C180 142 185 155 182 168 C172 172 160 165 158 150 Z" fill="url(#crestGoldLight)" stroke="#FFE899" strokeWidth="0.8" />
          <circle cx="172" cy="155" r="5" fill="url(#crestGoldDark)" />
        </g>

        {/* Bottom Hanging Purple / Blue Center Gem */}
        <g filter="drop-shadow(0 4px 8px rgba(126,34,206,0.6))">
          <polygon points="120,158 132,172 120,188 108,172" fill="url(#crystalPurple)" stroke="#F5D0FE" strokeWidth="1" />
          <polygon points="120,158 132,172 120,174 108,172" fill="#FFF" opacity="0.6" />
        </g>

        {/* Royal Blue Silk Ribbon Banner Across the Bottom */}
        <g filter="drop-shadow(0 8px 16px rgba(0,0,0,0.75))">
          {/* Ribbon Ends */}
          <path d="M38 185 L52 165 L56 182 L42 195 Z" fill="#1E3A8A" />
          <path d="M202 185 L188 165 L184 182 L198 195 Z" fill="#1E3A8A" />

          {/* Main Curved Banner */}
          <path d="M48 165 C85 150 155 150 192 165 L186 185 C152 170 88 170 54 185 Z" fill="url(#royalRibbon)" stroke="#FDE047" strokeWidth="1.5" />
          <path d="M50 167 C86 153 154 153 190 167" stroke="#FFF" strokeWidth="0.8" strokeDasharray="3 2" opacity="0.7" />
          
          {/* Golden Ribbon Text */}
          <text 
            x="120" 
            y="178" 
            textAnchor="middle" 
            fill="#FEF08A" 
            fontSize="14" 
            fontWeight="900" 
            fontFamily="sans-serif"
            letterSpacing="2"
            filter="drop-shadow(0 2px 4px rgba(0,0,0,0.8))"
          >
            VIP{level}
          </text>
        </g>
      </svg>
    </div>
  );
};

export const VipCenterModal: React.FC<VipCenterModalProps> = ({ 
  isOpen, 
  onClose, 
  profile, 
  onUpgrade 
}) => {
  const [selectedVipNumber, setSelectedVipNumber] = useState<number>(6);
  const [showEliteHelp, setShowEliteHelp] = useState(false);
  const [selectedPrivilege, setSelectedPrivilege] = useState<PrivilegeItem | null>(null);
  const [showRenewModal, setShowRenewModal] = useState(false);
  const [showSendModal, setShowSendModal] = useState(false);

  if (!isOpen) return null;

  const vipLevels = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  // 26 Privileges exactly listed in the screenshot
  const privilegesList: PrivilegeItem[] = [
    {
      id: 'vip_icon',
      name: `أيقونة VIP${selectedVipNumber}`,
      minVip: 1,
      icon: (
        <div className="w-9 h-9 rounded-full bg-slate-900 border border-slate-700/80 flex items-center justify-center">
          <span className="text-[10px] font-black tracking-tighter text-amber-300 font-mono px-1.5 py-0.5 rounded border border-amber-400/40 bg-amber-950/40">
            VIP
          </span>
        </div>
      ),
      description: `شارة VIP${selectedVipNumber} الملكية المتوهجة تظهر بجانب اسمك في كافة الغرف والمحادثات وقوائم الترتيب.`
    },
    {
      id: 'custom_frames',
      name: 'براويز مميزة',
      minVip: 1,
      icon: (
        <div className="w-9 h-9 rounded-full bg-slate-900 border border-slate-700/80 flex items-center justify-center text-amber-300">
          <Crown className="w-4 h-4" />
        </div>
      ),
      description: 'إطارات ملكية خاصة ومتحركة مصممة لتمييز صورتك الشخصية في الغرف والمقاعد.'
    },
    {
      id: 'entrance_effects',
      name: 'مؤثرات الدخول',
      minVip: 1,
      icon: (
        <div className="w-9 h-9 rounded-full bg-slate-900 border border-slate-700/80 flex items-center justify-center text-amber-300">
          <Zap className="w-4 h-4" />
        </div>
      ),
      description: 'مؤثرات دخول سينمائية وبانرات ترحيبية تملأ الشاشة عند دخولك أي غرفة صوتية.'
    },
    {
      id: 'get_car',
      name: 'احصل/ي على هذه السيارة',
      minVip: 2,
      icon: (
        <div className="w-9 h-9 rounded-full bg-slate-900 border border-slate-700/80 flex items-center justify-center text-slate-200">
          <Car className="w-4 h-4" />
        </div>
      ),
      description: 'مركبة دخول ملكية فاخرة خاصة برتبة VIP ترافقك أينما تنقلت في التطبيق.'
    },
    {
      id: 'more_friends',
      name: 'مزيد من الاصدقاء',
      minVip: 2,
      icon: (
        <div className="w-9 h-9 rounded-full bg-slate-900 border border-slate-700/80 flex items-center justify-center text-slate-200">
          <Heart className="w-4 h-4" />
        </div>
      ),
      description: 'زيادة سعة قائمة الأصدقاء والمتابعين حتى 10,000 صديق بدون قيود.'
    },
    {
      id: 'follow_boost',
      name: 'المتابعة *800%',
      minVip: 2,
      icon: (
        <div className="w-9 h-9 rounded-full bg-slate-900 border border-slate-700/80 flex items-center justify-center text-slate-200">
          <UserCheck className="w-4 h-4" />
        </div>
      ),
      description: 'مضاعفة سرعة ونقاط التفاعل المكتسبة من المتابعة والإعجابات بنسبة 800%.'
    },
    {
      id: 'exclusive_bubble',
      name: 'فقاعة حصرية',
      minVip: 3,
      icon: (
        <div className="w-9 h-9 rounded-full bg-slate-900 border border-slate-700/80 flex items-center justify-center text-slate-200">
          <MessageSquare className="w-4 h-4" />
        </div>
      ),
      description: 'فقاعات دردشة مخصصة وذهبية تجعل رسائلك أكثر جاذبية وأناقة.'
    },
    {
      id: 'barrage_stream',
      name: 'وابل',
      minVip: 3,
      icon: (
        <div className="w-9 h-9 rounded-full bg-slate-900 border border-slate-700/80 flex items-center justify-center text-slate-200">
          <Radio className="w-4 h-4" />
        </div>
      ),
      description: 'إمكانية إرسال وابل الرسائل الطائرة (الدانماكو) عبر الغرفة كاملة.'
    },
    {
      id: 'hide_country_time',
      name: 'إخفاء الدولة / المنطقة والوقت عبر الإنترنت',
      minVip: 3,
      icon: (
        <div className="w-9 h-9 rounded-full bg-slate-900 border border-slate-700/80 flex items-center justify-center text-slate-200">
          <Lock className="w-4 h-4" />
        </div>
      ),
      description: 'خصوصية كاملة لإخفاء بلد إقامتك ووقت تواجدك وظهورك على الإنترنت.'
    },
    {
      id: 'exclusive_gifts',
      name: 'هدايا حصرية',
      minVip: 4,
      icon: (
        <div className="w-9 h-9 rounded-full bg-slate-900 border border-slate-700/80 flex items-center justify-center text-slate-200">
          <Gift className="w-4 h-4" />
        </div>
      ),
      description: 'الوصول إلى كتالوج هدايا VIP النادرة والحصرية لإهدائها للمميزين.'
    },
    {
      id: 'anti_kick',
      name: 'منع التعرض للطرد (VIP 5+)',
      minVip: 5,
      icon: (
        <div className="w-9 h-9 rounded-full bg-slate-900 border border-slate-700/80 flex items-center justify-center text-slate-200">
          <ShieldAlert className="w-4 h-4" />
        </div>
      ),
      description: 'حصانة ملكية تمنع أي شخص من طردك من الغرف (مخصصة لرتب VIP 5 فما فوق).'
    },
    {
      id: 'ban_protection',
      name: 'حماية من الحظر (VIP 5+)',
      minVip: 5,
      icon: (
        <div className="w-9 h-9 rounded-full bg-slate-900 border border-slate-700/80 flex items-center justify-center text-slate-200">
          <ShieldCheck className="w-4 h-4" />
        </div>
      ),
      description: 'حماية حسابك من كتم الصوت العشوائي أو الحظر داخل الغرف.'
    },
    {
      id: 'invisible_mode',
      name: 'مخفي',
      minVip: 5,
      icon: (
        <div className="w-9 h-9 rounded-full bg-slate-900 border border-slate-700/80 flex items-center justify-center text-slate-200">
          <EyeOff className="w-4 h-4" />
        </div>
      ),
      description: 'وضع التخفي الكامل للتنقل في الغرف دون الظهور في قائمة المتواجدين.'
    },
    {
      id: 'hide_view_history',
      name: 'إخفاء سجل المشاهدة',
      minVip: 5,
      icon: (
        <div className="w-9 h-9 rounded-full bg-slate-900 border border-slate-700/80 flex items-center justify-center text-slate-200">
          <FileText className="w-4 h-4" />
        </div>
      ),
      description: 'عدم تسجيل زياراتك في قائمة زوار الملفات الشخصية للآخرين.'
    },
    {
      id: 'colored_nickname',
      name: 'اسم مستعار ملون',
      minVip: 5,
      icon: (
        <div className="w-9 h-9 rounded-full bg-slate-900 border border-slate-700/80 flex items-center justify-center text-slate-200">
          <Edit3 className="w-4 h-4" />
        </div>
      ),
      description: 'تلوين اسمك المستعار بتدرجات الألوان الملكية المتدرجة والبراقة.'
    },
    {
      id: 'color_id',
      name: 'معرّف اللون',
      minVip: 6,
      icon: (
        <div className="w-9 h-9 rounded-full bg-slate-900 border border-slate-700/80 flex items-center justify-center text-slate-200">
          <span className="text-[9px] font-black tracking-widest border border-slate-600 px-1 py-0.2 rounded">ID</span>
        </div>
      ),
      description: 'بطاقة معرف حساب ID ملونة بتأثير هولوغرافي متوهج.'
    },
    {
      id: 'dynamic_avatar',
      name: 'صورة رمزية ديناميكية',
      minVip: 6,
      icon: (
        <div className="w-9 h-9 rounded-full bg-slate-900 border border-slate-700/80 flex items-center justify-center text-slate-200">
          <ImageIcon className="w-4 h-4" />
        </div>
      ),
      description: 'إمكانية رفع صور بروفيل متحركة GIF بجودة فائقة.'
    },
    {
      id: 'remove_users',
      name: 'ازالة المستخدمين',
      minVip: 6,
      icon: (
        <div className="w-9 h-9 rounded-full bg-slate-900 border border-slate-700/80 flex items-center justify-center text-slate-200">
          <LogOut className="w-4 h-4" />
        </div>
      ),
      description: 'صلاحيات طرد وإخراج المزعجين من الغرف للحفاظ على هدوء البث.'
    },
    {
      id: 'exclusive_emojis',
      name: 'ايموجي حصرية',
      minVip: 6,
      icon: (
        <div className="w-9 h-9 rounded-full bg-slate-900 border border-slate-700/80 flex items-center justify-center text-slate-200">
          <Smile className="w-4 h-4" />
        </div>
      ),
      description: 'حزمة ملصقات وإيموجيات VIP ثلاثية الأبعاد متحركة.'
    },
    {
      id: 'no_stalking',
      name: 'لا تتبع',
      minVip: 7,
      icon: (
        <div className="w-9 h-9 rounded-full bg-slate-900 border border-slate-700/80 flex items-center justify-center text-slate-200">
          <Home className="w-4 h-4" />
        </div>
      ),
      description: 'منع الآخرين من ملاحقتك أو الدخول التلقائي للغرف التي تتواجد بها.'
    },
    {
      id: 'colored_typing',
      name: 'تأثير الكتابة الملون',
      minVip: 7,
      icon: (
        <div className="w-9 h-9 rounded-full bg-slate-900 border border-slate-700/80 flex items-center justify-center text-slate-200">
          <MessageSquare className="w-4 h-4" />
        </div>
      ),
      description: 'نصوص دردشة ملونة تظهر بخطوط ملكية عريضة تبرز بين كل الرسائل.'
    },
    {
      id: 'unhideable_entrance',
      name: 'لا يمكن إخفاء تأثيرات الدخولية',
      minVip: 8,
      icon: (
        <div className="w-9 h-9 rounded-full bg-slate-900 border border-slate-700/80 flex items-center justify-center text-slate-200">
          <Car className="w-4 h-4" />
        </div>
      ),
      description: 'تأثيرات دخولك تفرض حضورها الإجباري الفاخر ولا يمكن لأحد كتمها أو إخفائها.'
    },
    {
      id: 'profile_decor_effect',
      name: 'تاثير تزين الملف الشخصي',
      minVip: 8,
      icon: (
        <div className="w-9 h-9 rounded-full bg-slate-900 border border-slate-700/80 flex items-center justify-center text-slate-200">
          <CreditCard className="w-4 h-4" />
        </div>
      ),
      description: 'ثيمات وخلفيات متحركة لصفحة بروفايلك تعكس رتبتك العالية.'
    },
    {
      id: 'colored_name_card',
      name: 'اسم ملون',
      minVip: 9,
      icon: (
        <div className="w-9 h-9 rounded-full bg-slate-900 border border-slate-700/80 flex items-center justify-center text-slate-200">
          <CreditCard className="w-4 h-4" />
        </div>
      ),
      description: 'بطاقة اسم ملونة ذهبية كاملة مع شارة التاج الإمبراطوري.'
    },
    {
      id: 'animated_cover',
      name: 'صورة غلاف متحرك',
      minVip: 9,
      icon: (
        <div className="w-9 h-9 rounded-full bg-slate-900 border border-slate-700/80 flex items-center justify-center text-slate-200">
          <ImageIcon className="w-4 h-4" />
        </div>
      ),
      description: 'غلاف بروفايل سينمائي عالي الدقة يتحرك بتأثيرات النجوم والذهب.'
    },
    {
      id: 'profile_luxury_decor',
      name: 'تاثير تزين البروفيل',
      minVip: 10,
      icon: (
        <div className="w-9 h-9 rounded-full bg-slate-900 border border-slate-700/80 flex items-center justify-center text-slate-200">
          <Award className="w-4 h-4" />
        </div>
      ),
      description: 'وسام التاج الإمبراطوري الحصري لكبار شخصيات السيرفر.'
    }
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md" dir="rtl">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 20 }}
          transition={{ type: 'spring', damping: 26, stiffness: 320 }}
          className="w-full max-w-md h-full sm:h-[94vh] max-h-[920px] bg-[#0E1422] rounded-none sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col relative text-white border-0 sm:border border-slate-800"
        >
          {/* Top Bar Header */}
          <div className="relative px-4 pt-4 pb-2 flex items-center justify-between shrink-0 bg-[#0E1422] z-20">
            <button
              onClick={onClose}
              className="p-2 rounded-full text-white/90 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            <h1 className="text-base sm:text-lg font-black tracking-wide text-white">مركز VIP</h1>

            <div className="w-10" />
          </div>

          {/* Horizontally Scrollable VIP Levels Selector */}
          <div className="flex items-center gap-6 px-5 overflow-x-auto no-scrollbar bg-[#0E1422] shrink-0 z-20 border-b border-slate-800/40">
            {vipLevels.map((lvl) => {
              const isSelected = selectedVipNumber === lvl;
              return (
                <button
                  key={lvl}
                  onClick={() => setSelectedVipNumber(lvl)}
                  className={`pb-2 pt-1 text-xs sm:text-sm font-black whitespace-nowrap transition-all relative cursor-pointer ${
                    isSelected
                      ? 'text-[#F5D061] scale-105'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span>VIP{lvl}</span>
                  {isSelected && (
                    <motion.div
                      layoutId="vip_tab_active"
                      className="absolute bottom-0 left-1 right-1 h-0.5 bg-[#F5D061] rounded-full shadow-[0_0_8px_#F5D061]"
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col bg-[#0E1422]">
            {/* Massive Royal Gold Crest Showcase */}
            <div className="relative py-2 flex flex-col items-center justify-center shrink-0">
              <VipRoyalCrest level={selectedVipNumber} className="w-56 h-56 -my-2" />

              {/* Decorative Privileges Headline */}
              <div className="flex items-center justify-center gap-3 w-full px-8 mt-2 mb-3">
                <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-slate-600/60 to-transparent" />
                <span className="text-xs font-bold text-slate-300 tracking-wider flex items-center gap-1.5">
                  <span className="text-[#F5D061] text-[10px]">✦</span>
                  <span>الامتيازات</span>
                  <span className="text-[#F5D061] text-[10px]">✦</span>
                </span>
                <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-slate-600/60 to-transparent" />
              </div>
            </div>

            {/* Featured Elite Privilege Banner Card ("امتيازات النخبة") */}
            <div className="px-4 mb-4">
              <div className="relative rounded-2xl bg-[#141B2D] border border-amber-500/30 p-4 text-center overflow-hidden shadow-lg">
                {/* Background Damask Pattern Overlay */}
                <div className="absolute inset-0 bg-[radial-gradient(#F59E0B_1px,transparent_1px)] [background-size:12px_12px] opacity-10 pointer-events-none" />

                {/* Top Arched Banner Label */}
                <div className="absolute -top-0.5 left-1/2 -translate-x-1/2 px-6 py-1 bg-gradient-to-r from-[#B45309] via-[#F59E0B] to-[#B45309] rounded-b-xl border-x border-b border-amber-300 shadow-md">
                  <span className="text-[11px] font-black text-slate-950 tracking-wide block">
                    امتيازات النخبة
                  </span>
                </div>

                {/* Question Info Mark */}
                <button
                  onClick={() => setShowEliteHelp(true)}
                  className="absolute top-3 right-3 text-slate-400 hover:text-white p-1 cursor-pointer transition-colors"
                >
                  <HelpCircle className="w-4 h-4" />
                </button>

                {/* Central Mystery Mask Graphic */}
                <div className="mt-4 mb-2 flex justify-center">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-b from-slate-800 to-slate-900 border border-slate-700/80 flex items-center justify-center shadow-inner">
                    {/* Venetian Mystery Mask */}
                    <svg className="w-8 h-8 text-slate-300" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM8.5 9.5C9.33 9.5 10 10.17 10 11C10 11.83 9.33 12.5 8.5 12.5C7.67 12.5 7 11.83 7 11C7 10.17 7.67 9.5 8.5 9.5ZM15.5 9.5C16.33 9.5 17 10.17 17 11C17 11.83 16.33 12.5 15.5 12.5C14.67 12.5 14 11.83 14 11C14 10.17 14.67 9.5 15.5 9.5ZM12 18.5C9.5 18.5 7.43 17.06 6.5 15H17.5C16.57 17.06 14.5 18.5 12 18.5Z" opacity="0.3"/>
                      <path d="M3 10C5 7 9 7 11 9.5C11.5 10.1 12.5 10.1 13 9.5C15 7 19 7 21 10C21.5 11 20.5 13 18 13.5C15 14 13 12 12 12C11 12 9 14 6 13.5C3.5 13 2.5 11 3 10ZM8 10C7.4 10 7 10.4 7 11C7 11.6 7.4 12 8 12C8.6 12 9 11.6 9 11C9 10.4 8.6 10 8 10ZM16 10C15.4 10 15 10.4 15 11C15 11.6 15.4 12 16 12C16.6 12 17 11.6 17 11C17 10.4 16.6 10 16 10Z"/>
                    </svg>
                  </div>
                </div>

                <p className="text-xs text-slate-300 font-medium tracking-wide">
                  دخل رجل غامض الغرفة للتو.
                </p>
              </div>
            </div>

            {/* 3-Columns Grid of 26 Privileges */}
            <div className="px-3 pb-8">
              <div className="grid grid-cols-3 gap-y-6 gap-x-2">
                {privilegesList.map((priv) => {
                  const isUnlocked = selectedVipNumber >= priv.minVip;

                  return (
                    <motion.div
                      key={priv.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedPrivilege(priv)}
                      className="flex flex-col items-center text-center cursor-pointer group px-1"
                    >
                      {/* Circular Icon Container */}
                      <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-all relative ${
                        isUnlocked 
                          ? 'bg-[#141C2E] border border-slate-700/80 group-hover:border-amber-400/80 shadow-md group-hover:shadow-[0_0_12px_rgba(245,158,11,0.3)]' 
                          : 'bg-[#101522] border border-slate-800 opacity-60'
                      }`}>
                        {priv.icon}

                        {!isUnlocked && (
                          <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-slate-800 border border-slate-600 flex items-center justify-center text-[9px] text-slate-400">
                            <Lock className="w-2.5 h-2.5" />
                          </div>
                        )}
                      </div>

                      {/* Privilege Label */}
                      <span className={`text-[11px] font-bold mt-2 leading-tight tracking-tight max-w-[95px] line-clamp-2 ${
                        isUnlocked ? 'text-slate-300 group-hover:text-white' : 'text-slate-500'
                      }`}>
                        {priv.name}
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Bottom Fixed Action Bar */}
          <div className="p-4 bg-[#0B0F19] border-t border-slate-800/90 flex items-center justify-between shrink-0 z-20">
            {/* Right: VIP Level and Deadline */}
            <div className="text-right">
              <h3 className="text-base font-black text-white leading-none tracking-wide">
                VIP{selectedVipNumber}
              </h3>
              <p className="text-[10px] text-slate-400 mt-1 font-mono tracking-tighter">
                الموعد النهائي: 13:46:42 2026/09/03
              </p>
            </div>

            {/* Left: Action Buttons (إرسال / تجديد) */}
            <div className="flex items-center gap-2">
              {/* إرسال Button */}
              <button
                onClick={() => setShowSendModal(true)}
                className="px-5 py-2 rounded-full border border-slate-700 bg-[#161F33] hover:bg-[#1E2B45] text-white font-bold text-xs transition-colors cursor-pointer shadow-xs"
              >
                إرسال
              </button>

              {/* تجديد Button */}
              <button
                onClick={() => {
                  if (onUpgrade) onUpgrade(`VIP ${selectedVipNumber}`);
                  setShowRenewModal(true);
                }}
                className="px-5 py-2 rounded-full bg-gradient-to-r from-amber-100 via-white to-amber-100 hover:from-white hover:to-white text-slate-950 font-black text-xs transition-transform active:scale-95 cursor-pointer shadow-md"
              >
                تجديد
              </button>
            </div>
          </div>

          {/* Privilege Detail Modal */}
          <AnimatePresence>
            {selectedPrivilege && (
              <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-[#141C2E] rounded-3xl p-6 max-w-xs w-full text-center text-white shadow-2xl relative border border-amber-500/40 space-y-3"
                >
                  <button
                    onClick={() => setSelectedPrivilege(null)}
                    className="absolute top-4 left-4 p-1.5 rounded-full bg-white/10 text-white/70 hover:bg-white/20"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  <div className="w-16 h-16 rounded-full bg-slate-900 border-2 border-amber-400/80 flex items-center justify-center mx-auto shadow-lg">
                    {selectedPrivilege.icon}
                  </div>

                  <h3 className="text-base font-black text-amber-300">{selectedPrivilege.name}</h3>
                  <div className="inline-block bg-amber-500/20 text-amber-300 text-xs font-bold px-3 py-0.5 rounded-full border border-amber-500/40">
                    متاح ابتداءً من VIP{selectedPrivilege.minVip}
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {selectedPrivilege.description}
                  </p>

                  <button
                    onClick={() => setSelectedPrivilege(null)}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black text-xs shadow-md mt-2 cursor-pointer"
                  >
                    فهمت ذلك
                  </button>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          {/* Elite Help Modal */}
          <AnimatePresence>
            {showEliteHelp && (
              <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-[#141C2E] rounded-3xl p-6 max-w-sm w-full text-white shadow-2xl relative border border-amber-500/40 space-y-4"
                >
                  <button
                    onClick={() => setShowEliteHelp(false)}
                    className="absolute top-4 left-4 p-1.5 rounded-full bg-white/10 text-white/70 hover:bg-white/20"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-black">
                      <Crown className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-base font-black text-amber-300">امتيازات النخبة VIP</h3>
                      <p className="text-xs text-slate-400">ميزات التخفي والغموض الملكي</p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    عند تفعيل وضع التخفي والنخبة، يظهر إشعار في الغرفة: <span className="text-amber-300 font-bold">"دخل رجل غامض الغرفة للتو."</span> بدلاً من اسمك الحقيقي ومعلوماتك لتمنحك كامل الخصوصية والهيبة.
                  </p>

                  <button
                    onClick={() => setShowEliteHelp(false)}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black text-xs shadow-md"
                  >
                    إغلاق
                  </button>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          {/* Renew VIP Success Modal */}
          <AnimatePresence>
            {showRenewModal && (
              <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-[#141C2E] rounded-3xl p-6 max-w-xs w-full text-center text-white shadow-2xl relative border border-emerald-500/40 space-y-3"
                >
                  <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto">
                    <Check className="w-7 h-7 stroke-[3]" />
                  </div>

                  <h3 className="text-base font-black text-emerald-400">تم تجديد VIP{selectedVipNumber} بنجاح</h3>
                  <p className="text-xs text-slate-300">
                    تم تمديد فترة صلاحية عضويتك الملكية حتى 2026/10/03. استمتع بكافة الامتيازات الحصرية!
                  </p>

                  <button
                    onClick={() => setShowRenewModal(false)}
                    className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs shadow-md mt-2"
                  >
                    رائع
                  </button>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          {/* Gift / Send VIP Modal */}
          <AnimatePresence>
            {showSendModal && (
              <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-[#141C2E] rounded-3xl p-6 max-w-sm w-full text-white shadow-2xl relative border border-amber-500/40 space-y-4"
                >
                  <button
                    onClick={() => setShowSendModal(false)}
                    className="absolute top-4 left-4 p-1.5 rounded-full bg-white/10 text-white/70 hover:bg-white/20"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-black">
                      <Gift className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-base font-black text-amber-300">إهداء VIP{selectedVipNumber} لصديق</h3>
                      <p className="text-xs text-slate-400">شارك الفخامة مع من تحب</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-300 block">أدخل معرّف الصديق (ID):</label>
                    <input
                      type="text"
                      placeholder="مثال: 9482103"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono focus:border-amber-400 focus:outline-hidden"
                    />
                  </div>

                  <button
                    onClick={() => {
                      alert('تم إرسال بطاقة إهداء VIP بنجاح إلى الصديق!');
                      setShowSendModal(false);
                    }}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black text-xs shadow-md cursor-pointer"
                  >
                    تأكيد الإرسال
                  </button>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};


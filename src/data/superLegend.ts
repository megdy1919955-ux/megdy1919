export interface Perk {
  id: number;
  title: string;
  desc: string;
}

export interface SuperLegendLevel {
  level: number;
  name: string;
  badgeIcon: string;
  perks: Perk[];
}

export interface VipTier {
  level: number;
  title: string;
  requiredCoins: number;
  discount: string;
  privileges: string[];
}

export const VIP_TIERS: VipTier[] = [
  {
    level: 1,
    title: "VIP 1 - كبار الشخصيات",
    requiredCoins: 1000,
    discount: "5%",
    privileges: [
      "ميزة التمييز في شات الغرفة",
      "إطار صور شخصي كبار الشخصيات VIP 1",
      "خصم 5% على الهدايا الفاخرة"
    ]
  },
  {
    level: 2,
    title: "VIP 2 - كبار الشخصيات",
    requiredCoins: 5000,
    discount: "8%",
    privileges: [
      "تأثير دخول مميز للغرف الصوتية",
      "إطار ميكروفون ذهبي VIP 2",
      "خصم 8% على جميع الهدايا"
    ]
  },
  {
    level: 3,
    title: "VIP 3 - كبار الشخصيات",
    requiredCoins: 12000,
    discount: "10%",
    privileges: [
      "شارة حصرية في الملف الشخصي",
      "زيادة حد الأصدقاء والمتابعين",
      "خصم 10% على الهدايا الفاخرة"
    ]
  },
  {
    level: 4,
    title: "VIP 4 - كبار الشخصيات",
    requiredCoins: 25000,
    discount: "12%",
    privileges: [
      "مركبة حصرية كبار الشخصيات",
      "إخفاء حالة الاتصال لراحة أكبر",
      "خصم 12% على الهدايا والخدمات"
    ]
  },
  {
    level: 5,
    title: "VIP 5 - كبار الشخصيات",
    requiredCoins: 50000,
    discount: "15%",
    privileges: [
      "شارة VIP 5 متلألئة",
      "دخول الغرف بتأثير صوتي وبصري خاص",
      "خصم 15% على متجر الشارات والمظهر"
    ]
  },
  {
    level: 6,
    title: "VIP 6 - كبار الشخصيات",
    requiredCoins: 100000,
    discount: "18%",
    privileges: [
      "حماية ضد الحظر والطرد في الغرف العامة",
      "بنر مميز أعلى شاشة الغرفة الصوتية",
      "خصم 18% على كافة الخدمات والهدايا"
    ]
  },
  {
    level: 7,
    title: "VIP 7 - كبار الشخصيات",
    requiredCoins: 200000,
    discount: "20%",
    privileges: [
      "خدمة عملاء فرسان كبار الشخصيات VIP 7",
      "هدايا شهرية مجانية حصرية",
      "خصم 20% على جميع الهدايا"
    ]
  },
  {
    level: 8,
    title: "VIP 8 - كبار الشخصيات",
    requiredCoins: 500000,
    discount: "25%",
    privileges: [
      "أولوية العرض في القائمة العلوية بكافة الغرف",
      "إطار متحرك نادراً وأيقونة VIP 8 ملكية",
      "خصم 25% على الهدايا والخدمات الفاخرة",
      "ملازم خادم خاص واستجابة فورية للطلبات"
    ]
  },
  {
    level: 9,
    title: "VIP 9 - كبار الشخصيات الملكية",
    requiredCoins: 1000000,
    discount: "30%",
    privileges: [
      "دخول أسطوري بأسطول مركبات ملكية",
      "تصميم اسم بلون ذهبي ماسي متألق",
      "خصم 30% شامل لكافة ميزات التطبيق"
    ]
  },
  {
    level: 10,
    title: "VIP 10 - الإمبراطور الأسطوري",
    requiredCoins: 2500000,
    discount: "35%",
    privileges: [
      "أعلى مستوى VIP في منصة سوبر ليجند",
      "قوة وإدارة كاملة وحصانة مطلقة",
      "خصم 35% واسترجاع عمولات تلقائي"
    ]
  }
];

export const SUPER_LEGEND_LEVELS: SuperLegendLevel[] = [
  {
    level: 1,
    name: "Super Legend 1",
    badgeIcon: "🐺",
    perks: [
      { id: 1, title: "إطار ميكروفون حصري", desc: "Super Legend 1 (SL1)" },
      { id: 2, title: "شارة حصرية", desc: "Super Legend 1 (SL1)" },
      { id: 3, title: "شارة الحالة", desc: "Super Legend 1 (SL1)" },
      { id: 4, title: "زيادة حد الأصدقاء", desc: "Super Legend 1 (SL1)" },
      { id: 5, title: "زيادة حد المتابعة", desc: "Super Legend 1 (SL1)" }
    ]
  },
  {
    level: 2,
    name: "Super Legend 2",
    badgeIcon: "🐺",
    perks: [
      { id: 1, title: "فقاعة حصرية", desc: "Super Legend 2 (SL2)" },
      { id: 2, title: "إطار ميكروفون متطور", desc: "Super Legend 2 (SL2)" },
      { id: 3, title: "مضاعف نقاط الأصدقاء", desc: "Super Legend 2 (SL2)" }
    ]
  },
  {
    level: 3,
    name: "Super Legend 3",
    badgeIcon: "🦅",
    perks: [
      { id: 1, title: "بيان الدخول", desc: "Super Legend 3 (SL3)" },
      { id: 2, title: "تمييز الحساب في القائمة", desc: "Super Legend 3 (SL3)" }
    ]
  },
  {
    level: 4,
    name: "Super Legend 4",
    badgeIcon: "🦁",
    perks: [
      { id: 1, title: "إخفاء الدولة", desc: "Super Legend 4 (SL4)" },
      { id: 2, title: "سرعة مضاعفة في الشات", desc: "Super Legend 4 (SL4)" }
    ]
  },
  {
    level: 5,
    name: "Super Legend 5",
    badgeIcon: "🐅",
    perks: [
      { id: 1, title: "إخفاء آخر ظهور", desc: "Super Legend 5 (SL5)" },
      { id: 2, title: "حصانة ضد الطرد المؤقت", desc: "Super Legend 5 (SL5)" }
    ]
  },
  {
    level: 6,
    name: "Super Legend 6",
    badgeIcon: "⚡",
    perks: [
      { id: 1, title: "زيادة خبرة الألعاب", desc: "Super Legend 6 (SL6)" },
      { id: 2, title: "صورة دردشة الشاشة العامة", desc: "Super Legend 6 (SL6)" },
      { id: 3, title: "رمز تعبيري مخصص", desc: "Super Legend 6 (SL6)" }
    ]
  },
  {
    level: 7,
    name: "Super Legend 7",
    badgeIcon: "👑",
    perks: [
      { id: 1, title: "مركبة حصرية", desc: "Super Legend 7 (SL7)" },
      { id: 2, title: "بانر البث المباشر", desc: "Super Legend 7 (SL7)" }
    ]
  },
  {
    level: 8,
    name: "Super Legend 8",
    badgeIcon: "💎",
    perks: [
      { id: 1, title: "بطاقة تجربة العلاقة", desc: "Super Legend 8 (SL8)" },
      { id: 2, title: "منع حظر الكتابة", desc: "Super Legend 8 (SL8)" }
    ]
  },
  {
    level: 9,
    name: "Super Legend 9",
    badgeIcon: "🔥",
    perks: [
      { id: 1, title: "الرجل الغامض في الغرفة", desc: "Super Legend 9 (SL9)" },
      { id: 2, title: "مكافأة EXP مضاعفة", desc: "Super Legend 9 (SL9)" }
    ]
  },
  {
    level: 10,
    name: "Super Legend 10",
    badgeIcon: "🌟",
    perks: [
      { id: 1, title: "مقعد حصري متألق", desc: "Super Legend 10 (SL10)" },
      { id: 2, title: "بانر دخول بتأثير خاص خارق", desc: "Super Legend 10 (SL10)" },
      { id: 3, title: "هدية حصرية أسطورية", desc: "Super Legend 10 (SL10)" }
    ]
  }
];

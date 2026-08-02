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

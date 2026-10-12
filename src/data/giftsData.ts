import { GiftItem } from '../lib/giftCmsService';

export const ALL_GIFTS: GiftItem[] = [
  { id: 'g1', name: 'وردة بيضاء', price: 10, icon: '🌸', category: 'شائع' },
  { id: 'g2', name: 'قلب وردي', price: 20, icon: '💖', category: 'شائع' },
  { id: 'g3', name: 'شاي كرك', price: 50, icon: '🫖', category: 'شائع' },
  { id: 'g4', name: 'قهوة يمنية', price: 100, icon: '☕', category: 'شائع' },
  { id: 'g5', name: 'عطر العود', price: 200, icon: '🧴', category: 'مميز' },
  { id: 'g6', name: 'خنجر ملكي', price: 500, icon: '🗡️', category: 'مميز' },
  { id: 'g7', name: 'ساعة ألماس', price: 1000, icon: '⌚', category: 'فاخر' },
  { id: 'g8', name: 'سيارة رياضية', price: 2000, icon: '🏎️', category: 'فاخر' },
  { id: 'g9', name: 'صقر ذهبي', price: 5000, icon: '🦅', category: 'ملكي' },
  { id: 'g10', name: 'تاج الإمبراطور', price: 10000, icon: '👑', category: 'ملكي' },
  { id: 'g11', name: 'يخت النجوم', price: 25000, icon: '🛥️', category: 'أسطوري' },
  { id: 'g12', name: 'قلعة الفاتح', price: 50000, icon: '🏰', category: 'أسطوري' },
  { id: 'g13', name: 'جوهرة الاسترداد 100', price: 100, icon: '💎', category: 'استرداد', isRefund: true },
  { id: 'g14', name: 'صندوق الاسترداد المحظوظ', price: 500, icon: '📦', category: 'استرداد', isRefund: true }
];

export const GIFT_CATEGORIES = ['الكل', 'شائع', 'مميز', 'فاخر', 'ملكي', 'أسطوري', 'استرداد'];

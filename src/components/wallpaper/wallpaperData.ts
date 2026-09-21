export interface RoomWallpaperItem {
  id: string;
  name: string;
  imageUrl: string;
  durationDays?: number;
  priceCoins?: number;
  isPurchased?: boolean;
}

// Available (متاح) Wallpapers - Kept only 1 default wallpaper, rest managed via external dashboard
export const AVAILABLE_WALLPAPERS: RoomWallpaperItem[] = [
  {
    id: 'avail-1-default',
    name: 'الخلفية الافتراضية للغرفة',
    imageUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&q=80&w=800'
  }
];

// Store (متجر) Wallpapers - Kept only 1 store wallpaper, rest managed via external dashboard
export const STORE_WALLPAPERS: RoomWallpaperItem[] = [
  {
    id: 'store-1-flower-couple',
    name: 'عشاق الورد والقلوب',
    imageUrl: 'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&q=80&w=800',
    durationDays: 14,
    priceCoins: 30000
  }
];

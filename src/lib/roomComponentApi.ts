/**
 * Room Component Independent API & Control Bridge
 * واجهة برمجية معمارية للتحكم المستقل بكل مكون من مكونات الروم
 * Super Legend App (c) 2026
 * 
 * المبادئ المعمارية:
 * 1. عزل تام: كل مكون (الهدايا، الإيموجي، المايكات، الشات، الحضور، الإعدادات) له واجهة مستقلة (Sub-API).
 * 2. استقبال البيانات من لوحة التحكم بشكل مستقل دون إعادة رسم باقي الروم (Decoupled Rendering).
 * 3. لا يتم تحميل كود أي نافذة أو أداة ثقيلة إلا عند الاستدعاء الفعلي (Lazy On-Demand).
 */

export type RoomGiftCatalogCategory = {
  id: string;
  name: string;
  icon?: string;
  items: Array<{
    id: string;
    name: string;
    icon: string;
    price: number;
    svgEffect?: string;
    animationUrl?: string;
  }>;
};

export type RoomEmojiPack = {
  id: string;
  name: string;
  items: Array<{
    id: string;
    emoji: string;
    name: string;
    iconUrl?: string;
  }>;
};

export type SeatReactionPayload = {
  seatId: number;
  emoji: string;
  name: string;
  iconUrl?: string;
  durationMs?: number;
};

export type MicControlAction =
  | { type: 'mute'; seatId: number; isMuted: boolean }
  | { type: 'lock'; seatId: number; isLocked: boolean }
  | { type: 'occupy'; seatId: number; user: { id: string; name: string; avatar: string } }
  | { type: 'kick'; seatId: number }
  | { type: 'set_count'; count: number }
  | { type: 'toggle_my_mic' };

export type ChatControlAction =
  | { type: 'push_system'; text: string; userColor?: string }
  | { type: 'push_user'; userName: string; text: string; isVip?: boolean; isOwner?: boolean; avatar?: string }
  | { type: 'clear' }
  | { type: 'open_input'; replyTo?: { id: string; userName: string; text: string; avatar?: string } }
  | { type: 'close_input' }
  | { type: 'report_message'; message: any }
  | { type: 'translate'; data: { originalText: string; translatedText: string; senderName: string } };

export type RoomInfoUpdatePayload = {
  title?: string;
  avatar?: string;
  isLocked?: boolean;
  announcement?: string;
  wallpaperUrl?: string;
};

type Listener<T> = (data: T) => void;

class SubChannel<T> {
  private listeners: Set<Listener<T>> = new Set();

  subscribe(listener: Listener<T>): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  emit(data: T): void {
    this.listeners.forEach((fn) => {
      try {
        fn(data);
      } catch (err) {
        console.error('[SubChannel Error]', err);
      }
    });
  }
}

/**
 * 1. الواجهة المستقلة للهدايا (Gifts Component API)
 */
class GiftsComponentApi {
  private openStateChannel = new SubChannel<boolean>();
  private sendGiftChannel = new SubChannel<{ gift: any; combo: number; recipientSeatId?: string | number }>();
  private catalogUpdateChannel = new SubChannel<RoomGiftCatalogCategory[]>();
  private isOpen = false;

  open(initialTab?: string, initialRecipientSeatId?: string | number): void {
    this.isOpen = true;
    this.openStateChannel.emit(true);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('room_gift_open', {
          detail: { initialTab, initialRecipientSeatId }
        })
      );
    }
  }

  close(): void {
    this.isOpen = false;
    this.openStateChannel.emit(false);
  }

  getIsOpen(): boolean {
    return this.isOpen;
  }

  onOpenStateChange(listener: Listener<boolean>): () => void {
    return this.openStateChannel.subscribe(listener);
  }

  sendGift(gift: any, combo = 1, recipientSeatId?: string | number): void {
    this.sendGiftChannel.emit({ gift, combo, recipientSeatId });
  }

  onSendGift(listener: Listener<{ gift: any; combo: number; recipientSeatId?: string | number }>): () => void {
    return this.sendGiftChannel.subscribe(listener);
  }

  updateCatalog(categories: RoomGiftCatalogCategory[]): void {
    this.catalogUpdateChannel.emit(categories);
  }

  onCatalogUpdate(listener: Listener<RoomGiftCatalogCategory[]>): () => void {
    return this.catalogUpdateChannel.subscribe(listener);
  }
}

/**
 * 2. الواجهة المستقلة للإيموجي والتفاعلات (Emoji Component API)
 */
class EmojiComponentApi {
  private openStateChannel = new SubChannel<boolean>();
  private reactionChannel = new SubChannel<SeatReactionPayload>();
  private packsUpdateChannel = new SubChannel<RoomEmojiPack[]>();
  private isOpen = false;

  open(): void {
    this.isOpen = true;
    this.openStateChannel.emit(true);
  }

  close(): void {
    this.isOpen = false;
    this.openStateChannel.emit(false);
  }

  getIsOpen(): boolean {
    return this.isOpen;
  }

  onOpenStateChange(listener: Listener<boolean>): () => void {
    return this.openStateChannel.subscribe(listener);
  }

  triggerSeatReaction(payload: SeatReactionPayload): void {
    this.reactionChannel.emit(payload);
  }

  onSeatReaction(listener: Listener<SeatReactionPayload>): () => void {
    return this.reactionChannel.subscribe(listener);
  }

  updatePacks(packs: RoomEmojiPack[]): void {
    this.packsUpdateChannel.emit(packs);
  }

  onPacksUpdate(listener: Listener<RoomEmojiPack[]>): () => void {
    return this.packsUpdateChannel.subscribe(listener);
  }
}

/**
 * 3. الواجهة المستقلة للمايكات والمقاعد (Mics Component API)
 */
class MicsComponentApi {
  private actionChannel = new SubChannel<MicControlAction>();

  muteSeat(seatId: number, isMuted: boolean): void {
    this.actionChannel.emit({ type: 'mute', seatId, isMuted });
  }

  lockSeat(seatId: number, isLocked: boolean): void {
    this.actionChannel.emit({ type: 'lock', seatId, isLocked });
  }

  kickSeat(seatId: number): void {
    this.actionChannel.emit({ type: 'kick', seatId });
  }

  occupySeat(seatId: number, user: { id: string; name: string; avatar: string }): void {
    this.actionChannel.emit({ type: 'occupy', seatId, user });
  }

  setMicCount(count: number): void {
    this.actionChannel.emit({ type: 'set_count', count });
  }

  toggleMyMic(): void {
    this.actionChannel.emit({ type: 'toggle_my_mic' });
  }

  onAction(listener: Listener<MicControlAction>): () => void {
    return this.actionChannel.subscribe(listener);
  }
}

/**
 * 4. الواجهة المستقلة للدردشة والشات (Chat Component API)
 */
class ChatComponentApi {
  private actionChannel = new SubChannel<ChatControlAction>();

  pushSystemNotice(text: string, userColor = '#F59E0B'): void {
    this.actionChannel.emit({ type: 'push_system', text, userColor });
  }

  pushUserMessage(userName: string, text: string, options?: { isVip?: boolean; isOwner?: boolean; avatar?: string }): void {
    this.actionChannel.emit({
      type: 'push_user',
      userName,
      text,
      isVip: options?.isVip,
      isOwner: options?.isOwner,
      avatar: options?.avatar
    });
  }

  clearChat(): void {
    this.actionChannel.emit({ type: 'clear' });
  }

  openInput(replyTo?: { id: string; userName: string; text: string; avatar?: string }): void {
    this.actionChannel.emit({ type: 'open_input', replyTo });
  }

  closeInput(): void {
    this.actionChannel.emit({ type: 'close_input' });
  }

  reportMessage(message: any): void {
    this.actionChannel.emit({ type: 'report_message', message });
  }

  showTranslation(data: { originalText: string; translatedText: string; senderName: string }): void {
    this.actionChannel.emit({ type: 'translate', data });
  }

  onAction(listener: Listener<ChatControlAction>): () => void {
    return this.actionChannel.subscribe(listener);
  }
}

/**
 * 5. الواجهة المستقلة لمعلومات الغرفة والإعدادات (RoomInfo & Settings Component API)
 */
class RoomInfoComponentApi {
  private infoModalOpenChannel = new SubChannel<boolean>();
  private settingsMenuOpenChannel = new SubChannel<boolean>();
  private infoUpdateChannel = new SubChannel<RoomInfoUpdatePayload>();
  private isInfoModalOpen = false;
  private isSettingsMenuOpen = false;

  openInfoModal(): void {
    this.isInfoModalOpen = true;
    this.infoModalOpenChannel.emit(true);
  }

  closeInfoModal(): void {
    this.isInfoModalOpen = false;
    this.infoModalOpenChannel.emit(false);
  }

  onInfoModalOpenChange(listener: Listener<boolean>): () => void {
    return this.infoModalOpenChannel.subscribe(listener);
  }

  openSettingsMenu(): void {
    this.isSettingsMenuOpen = true;
    this.settingsMenuOpenChannel.emit(true);
  }

  closeSettingsMenu(): void {
    this.isSettingsMenuOpen = false;
    this.settingsMenuOpenChannel.emit(false);
  }

  onSettingsMenuOpenChange(listener: Listener<boolean>): () => void {
    return this.settingsMenuOpenChannel.subscribe(listener);
  }

  updateInfo(payload: RoomInfoUpdatePayload): void {
    this.infoUpdateChannel.emit(payload);
  }

  onInfoUpdate(listener: Listener<RoomInfoUpdatePayload>): () => void {
    return this.infoUpdateChannel.subscribe(listener);
  }
}

/**
 * 6. الواجهة المستقلة لقائمة الحضور والمستمعين (Audience Component API)
 */
class AudienceComponentApi {
  private openStateChannel = new SubChannel<boolean>();
  private attendeesUpdateChannel = new SubChannel<any[]>();
  private isOpen = false;

  open(): void {
    this.isOpen = true;
    this.openStateChannel.emit(true);
  }

  close(): void {
    this.isOpen = false;
    this.openStateChannel.emit(false);
  }

  onOpenStateChange(listener: Listener<boolean>): () => void {
    return this.openStateChannel.subscribe(listener);
  }

  updateAttendees(list: any[]): void {
    this.attendeesUpdateChannel.emit(list);
  }

  onAttendeesUpdate(listener: Listener<any[]>): () => void {
    return this.attendeesUpdateChannel.subscribe(listener);
  }
}

/**
 * 7. الواجهة المستقلة لكرت بروفايل المستخدم (User Profile Component API)
 */
class ProfileModalComponentApi {
  private userSelectChannel = new SubChannel<any | null>();
  private currentUser: any | null = null;

  openProfile(user: any): void {
    this.currentUser = user;
    this.userSelectChannel.emit(user);
  }

  closeProfile(): void {
    this.currentUser = null;
    this.userSelectChannel.emit(null);
  }

  getCurrentUser(): any | null {
    return this.currentUser;
  }

  onUserSelect(listener: Listener<any | null>): () => void {
    return this.userSelectChannel.subscribe(listener);
  }
}

/**
 * 8. الواجهة المستقلة لإغلاق ومغادرة الغرفة (Exit Component API)
 */
class ExitModalComponentApi {
  private openStateChannel = new SubChannel<boolean>();
  private isOpen = false;

  open(): void {
    this.isOpen = true;
    this.openStateChannel.emit(true);
  }

  close(): void {
    this.isOpen = false;
    this.openStateChannel.emit(false);
  }

  onOpenStateChange(listener: Listener<boolean>): () => void {
    return this.openStateChannel.subscribe(listener);
  }
}

/**
 * الواجهة البرمجية المركزية المتكاملة للغرفة
 * تستطيع لوحات التحكم (Control Panel) من أي مكان في التطبيق أو عبر إشعارات السيرفر
 * إرسال واستقبال البيانات لكل مكوّن بشكل مستقل تماماً.
 */
export class RoomComponentApiHub {
  readonly gifts = new GiftsComponentApi();
  readonly emojis = new EmojiComponentApi();
  readonly mics = new MicsComponentApi();
  readonly chat = new ChatComponentApi();
  readonly roomInfo = new RoomInfoComponentApi();
  readonly audience = new AudienceComponentApi();
  readonly profile = new ProfileModalComponentApi();
  readonly exit = new ExitModalComponentApi();

  /**
   * دالة عامة لبث أوامر من لوحة التحكم الخارجية مباشرة
   */
  dispatchControlCommand(targetComponent: 'gifts' | 'emojis' | 'mics' | 'chat' | 'roomInfo' | 'audience' | 'profile' | 'exit', action: string, payload?: any): void {
    switch (targetComponent) {
      case 'gifts':
        if (action === 'open') this.gifts.open(payload?.tab, payload?.recipient);
        else if (action === 'close') this.gifts.close();
        else if (action === 'send') this.gifts.sendGift(payload?.gift, payload?.combo, payload?.recipient);
        else if (action === 'updateCatalog') this.gifts.updateCatalog(payload);
        break;

      case 'emojis':
        if (action === 'open') this.emojis.open();
        else if (action === 'close') this.emojis.close();
        else if (action === 'reaction') this.emojis.triggerSeatReaction(payload);
        else if (action === 'updatePacks') this.emojis.updatePacks(payload);
        break;

      case 'mics':
        if (action === 'mute') this.mics.muteSeat(payload.seatId, payload.isMuted);
        else if (action === 'lock') this.mics.lockSeat(payload.seatId, payload.isLocked);
        else if (action === 'kick') this.mics.kickSeat(payload.seatId);
        else if (action === 'occupy') this.mics.occupySeat(payload.seatId, payload.user);
        else if (action === 'setCount') this.mics.setMicCount(payload.count);
        else if (action === 'toggleMyMic') this.mics.toggleMyMic();
        break;

      case 'chat':
        if (action === 'pushSystem') this.chat.pushSystemNotice(payload.text, payload.userColor);
        else if (action === 'pushUser') this.chat.pushUserMessage(payload.userName, payload.text, payload.options);
        else if (action === 'clear') this.chat.clearChat();
        else if (action === 'openInput') this.chat.openInput(payload);
        else if (action === 'closeInput') this.chat.closeInput();
        break;

      case 'roomInfo':
        if (action === 'openInfo') this.roomInfo.openInfoModal();
        else if (action === 'closeInfo') this.roomInfo.closeInfoModal();
        else if (action === 'openSettings') this.roomInfo.openSettingsMenu();
        else if (action === 'closeSettings') this.roomInfo.closeSettingsMenu();
        else if (action === 'update') this.roomInfo.updateInfo(payload);
        break;

      case 'audience':
        if (action === 'open') this.audience.open();
        else if (action === 'close') this.audience.close();
        else if (action === 'update') this.audience.updateAttendees(payload);
        break;

      case 'profile':
        if (action === 'open') this.profile.openProfile(payload);
        else if (action === 'close') this.profile.closeProfile();
        break;

      case 'exit':
        if (action === 'open') this.exit.open();
        else if (action === 'close') this.exit.close();
        break;
    }
  }
}

// تصدير نسخة عامة وحيدة (Singleton)
export const roomComponentApi = new RoomComponentApiHub();

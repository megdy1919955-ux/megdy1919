export interface DigitalCounterControlModalProps {
  isOpen: boolean;
  onClose: () => void;
  seatId: number | null;
  seatUserName?: string;
  currentValue: number;
  onUpdateCounter: (seatId: number, newValue: number) => void;
  onResetCounter: (seatId: number) => void;
  onTriggerToast?: (msg: string) => void;
  isCounterRunning?: boolean;
  isCounterPaused?: boolean;
  onToggleCounterRunning?: () => void;
}

export const QUICK_ADD_STEPS = [10, 50, 100, 1000] as const;
export const QUICK_SUB_STEPS = [10, 50, 100] as const;

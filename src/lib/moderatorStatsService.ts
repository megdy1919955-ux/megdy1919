import { ModeratorActionLog, SupervisorStatsSummary, ModeratorActionType } from '../types/moderatorStats';

const STORAGE_KEY = 'super_legend_moderator_stats_logs_v1';

const INITIAL_LOGS: ModeratorActionLog[] = [
  {
    id: 'mod-log-1',
    timestamp: Date.now() - 1000 * 60 * 3, // 3 minutes ago
    moderatorName: 'المشرف عابر',
    moderatorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    moderatorRole: 'moderator',
    targetUserName: 'روح',
    targetUserAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    targetSeatId: 3,
    actionType: 'drop_mic',
    actionTitle: 'إنزال من المايك',
    description: 'المشرف عابر قام بإنزال روح من المايك #3',
    reason: 'إفساح المجال لمتحدث جديد'
  },
  {
    id: 'mod-log-2',
    timestamp: Date.now() - 1000 * 60 * 12, // 12 minutes ago
    moderatorName: 'المشرف عابر',
    moderatorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    moderatorRole: 'moderator',
    targetUserName: 'روح',
    targetUserAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    actionType: 'kick_room',
    actionTitle: 'طرد من الغرفة',
    description: 'المشرف عابر قام بطرد روح من الغرفة',
    reason: 'مخالفة قوانين الدردشة الصوتية'
  },
  {
    id: 'mod-log-3',
    timestamp: Date.now() - 1000 * 60 * 35, // 35 minutes ago
    moderatorName: 'المشرف صقر الشام',
    moderatorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
    moderatorRole: 'moderator',
    targetUserName: 'خالد العتيبي',
    targetUserAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    targetSeatId: 4,
    actionType: 'drop_mic',
    actionTitle: 'إنزال من المايك',
    description: 'المشرف صقر الشام قام بإنزال خالد العتيبي من المايك #4',
    reason: 'عدم التواجد على المايك'
  },
  {
    id: 'mod-log-4',
    timestamp: Date.now() - 1000 * 60 * 75, // 1 hour ago
    moderatorName: 'المشرف ريان',
    moderatorAvatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=200',
    moderatorRole: 'moderator',
    targetUserName: 'سلطان القحطاني',
    targetUserAvatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=200',
    actionType: 'kick_room',
    actionTitle: 'طرد من الغرفة',
    description: 'المشرف ريان قام بطرد سلطان القحطاني من الغرفة',
    reason: 'تكرار الإزعاج في الروم'
  },
  {
    id: 'mod-log-5',
    timestamp: Date.now() - 1000 * 60 * 120, // 2 hours ago
    moderatorName: 'المالك (أميرة الشرق)',
    moderatorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    moderatorRole: 'owner',
    targetUserName: 'المقعد #2 (أصيل)',
    targetSeatId: 2,
    actionType: 'mute_seat',
    actionTitle: 'كتم المايك',
    description: 'المالكة أميرة الشرق قامت بكتم المايك #2 (أصيل)',
    reason: 'تشويش صوتي'
  }
];

export function getModeratorActionLogs(): ModeratorActionLog[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_LOGS));
      return INITIAL_LOGS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : INITIAL_LOGS;
  } catch (err) {
    console.error('Error loading moderator action logs:', err);
    return INITIAL_LOGS;
  }
}

export function recordModeratorAction(
  entry: Omit<ModeratorActionLog, 'id' | 'timestamp'>
): ModeratorActionLog {
  const currentLogs = getModeratorActionLogs();
  const newLog: ModeratorActionLog = {
    ...entry,
    id: `mod-log-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
    timestamp: Date.now()
  };

  const updatedLogs = [newLog, ...currentLogs].slice(0, 100); // Keep latest 100 actions
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedLogs));
  } catch (err) {
    console.error('Error saving moderator action log:', err);
  }

  // Dispatch custom event for real-time listener updates
  window.dispatchEvent(
    new CustomEvent('moderator_action_logged', {
      detail: { log: newLog, allLogs: updatedLogs }
    })
  );

  return newLog;
}

export function clearModeratorLogs(): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
    window.dispatchEvent(
      new CustomEvent('moderator_action_logged', {
        detail: { log: null, allLogs: [] }
      })
    );
  } catch (err) {
    console.error('Error clearing moderator action logs:', err);
  }
}

export function getModeratorsSummary(logs: ModeratorActionLog[]): SupervisorStatsSummary[] {
  const map = new Map<string, SupervisorStatsSummary>();

  // Ensure default supervisors appear even if logs are cleared
  const defaultSupervisors: Array<{ name: string; avatar: string; role: 'owner' | 'moderator' | 'admin' }> = [
    {
      name: 'المشرف عابر',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
      role: 'moderator'
    },
    {
      name: 'المشرف صقر الشام',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
      role: 'moderator'
    },
    {
      name: 'المشرف ريان',
      avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=200',
      role: 'moderator'
    },
    {
      name: 'المالك (أميرة الشرق)',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      role: 'owner'
    }
  ];

  defaultSupervisors.forEach((s) => {
    map.set(s.name, {
      moderatorName: s.name,
      moderatorAvatar: s.avatar,
      role: s.role,
      totalKicks: 0,
      totalMicDrops: 0,
      totalMutes: 0,
      totalActions: 0,
      lastActive: 0
    });
  });

  logs.forEach((log) => {
    let summary = map.get(log.moderatorName);
    if (!summary) {
      summary = {
        moderatorName: log.moderatorName,
        moderatorAvatar:
          log.moderatorAvatar ||
          'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
        role: log.moderatorRole || 'moderator',
        totalKicks: 0,
        totalMicDrops: 0,
        totalMutes: 0,
        totalActions: 0,
        lastActive: 0
      };
      map.set(log.moderatorName, summary);
    }

    summary.totalActions += 1;
    if (log.actionType === 'kick_room' || log.actionType === 'ban_user') {
      summary.totalKicks += 1;
    } else if (log.actionType === 'drop_mic') {
      summary.totalMicDrops += 1;
    } else if (log.actionType === 'mute_seat' || log.actionType === 'lock_seat') {
      summary.totalMutes += 1;
    }

    if (log.timestamp > summary.lastActive) {
      summary.lastActive = log.timestamp;
    }
  });

  return Array.from(map.values()).sort((a, b) => b.totalActions - a.totalActions);
}

export function subscribeToModeratorStats(
  callback: (logs: ModeratorActionLog[]) => void
): () => void {
  const handler = (e: Event) => {
    const customEvent = e as CustomEvent<{ log: ModeratorActionLog; allLogs: ModeratorActionLog[] }>;
    if (customEvent.detail?.allLogs) {
      callback(customEvent.detail.allLogs);
    } else {
      callback(getModeratorActionLogs());
    }
  };

  window.addEventListener('moderator_action_logged', handler);
  return () => {
    window.removeEventListener('moderator_action_logged', handler);
  };
}

/**
 * مدير التنقل والرجوع بالزر الفعلي للجوال
 * Hardware / Browser Back Button & Exit App Manager
 * Al-Najm App (c) 2026
 */

type BackHandler = () => boolean | void;

class BackNavigationManager {
  private handlers: { id: string; priority: number; handler: BackHandler }[] = [];
  private isListening = false;
  private isPushingState = false;

  constructor() {
    this.setupPopstateListener();
  }

  private setupPopstateListener() {
    if (typeof window === 'undefined') return;

    if (!this.isListening) {
      this.isListening = true;

      // Push initial dummy state to ensure history is available to intercept
      try {
        if (!window.history.state || window.history.state._najm_nav !== true) {
          window.history.replaceState({ _najm_nav: true, step: 0 }, '');
          window.history.pushState({ _najm_nav: true, step: 1 }, '');
        }
      } catch (e) {
        console.warn('Failed to initialize history state:', e);
      }

      window.addEventListener('popstate', this.handlePopState);
    }
  }

  private handlePopState = (e: PopStateEvent) => {
    // If we have registered handlers, pick the one with highest priority
    if (this.handlers.length > 0) {
      // Re-push state so user doesn't accidentally navigate away from SPA
      try {
        window.history.pushState({ _najm_nav: true, step: Date.now() }, '');
      } catch {}

      const sorted = [...this.handlers].sort((a, b) => b.priority - a.priority);
      const topHandler = sorted[0];

      try {
        topHandler.handler();
      } catch (err) {
        console.error('Error executing back navigation handler:', err);
      }
    } else {
      // No modals or sub-pages open -> Broadcast global request to show Exit Confirmation Dialog
      try {
        window.history.pushState({ _najm_nav: true, step: Date.now() }, '');
      } catch {}

      window.dispatchEvent(new CustomEvent('najm_request_exit_app'));
    }
  };

  /**
   * Register a back-button handler (e.g., to close a modal or return to previous tab)
   * Priority: Modals (100+), Nested Drawers (150+), VoiceRoom (80), Sub-tabs (50), Root Exit (10)
   * Returns an unregister cleanup function.
   */
  public registerHandler(id: string, priority: number, handler: BackHandler): () => void {
    // Ensure popstate listener is alive
    this.setupPopstateListener();

    // Remove any existing handler with same ID
    this.handlers = this.handlers.filter((h) => h.id !== id);
    this.handlers.push({ id, priority, handler });

    // Push history state to ensure popstate will fire on hardware back button
    try {
      window.history.pushState({ _najm_nav: true, id, time: Date.now() }, '');
    } catch {}

    return () => {
      this.unregisterHandler(id);
    };
  }

  public unregisterHandler(id: string) {
    this.handlers = this.handlers.filter((h) => h.id !== id);
  }

  /**
   * Trigger back navigation programmatically
   */
  public goBack() {
    if (this.handlers.length > 0) {
      const sorted = [...this.handlers].sort((a, b) => b.priority - a.priority);
      const topHandler = sorted[0];
      topHandler.handler();
    } else {
      window.dispatchEvent(new CustomEvent('najm_request_exit_app'));
    }
  }
}

export const backNavigation = new BackNavigationManager();

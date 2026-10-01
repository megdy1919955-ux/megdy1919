import React from 'react';

/**
 * Enhanced lazy import with automatic retry on network disconnects,
 * dev-server restarts, or stale dynamic chunk cache failures.
 */
export function lazyWithRetry<T extends React.ComponentType<any>>(
  componentImport: () => Promise<{ default: T } | { [key: string]: any } | any>,
  componentName?: string
): React.LazyExoticComponent<T> {
  return React.lazy(async () => {
    const storageKey = `retry-refresh-${componentName || 'chunk'}`;
    const hasRefreshed = sessionStorage.getItem(storageKey);

    try {
      const module = await componentImport();
      sessionStorage.removeItem(storageKey);
      const resolved =
        module?.default ||
        (componentName ? module?.[componentName] : null) ||
        module?.VoiceRoomScreen ||
        module?.HomeScreen ||
        module?.ExploreScreen ||
        module?.GamesScreen ||
        module?.MessagesScreen ||
        (typeof module === 'function' ? module : null) ||
        (() => React.createElement('div', null));
      return { default: resolved };
    } catch (error: any) {
      console.warn(`[lazyWithRetry] Initial load failed for ${componentName || 'component'}, retrying in 400ms...`, error);

      // Attempt retry after brief backoff
      try {
        await new Promise((resolve) => setTimeout(resolve, 400));
        const retryModule = await componentImport();
        sessionStorage.removeItem(storageKey);
        const resolved =
          retryModule?.default ||
          (componentName ? retryModule?.[componentName] : null) ||
          retryModule?.VoiceRoomScreen ||
          retryModule?.HomeScreen ||
          retryModule?.ExploreScreen ||
          retryModule?.GamesScreen ||
          retryModule?.MessagesScreen ||
          (typeof retryModule === 'function' ? retryModule : null) ||
          (() => React.createElement('div', null));
        return { default: resolved };
      } catch (retryError: any) {
        console.error(`[lazyWithRetry] Retry failed for ${componentName || 'component'}:`, retryError);

        // If the chunk failed because the server restarted or deployed a new version, reload once
        if (!hasRefreshed && typeof window !== 'undefined') {
          sessionStorage.setItem(storageKey, 'true');
          window.location.reload();
          return new Promise(() => {}); // Page is reloading
        }

        throw retryError;
      }
    }
  });
}

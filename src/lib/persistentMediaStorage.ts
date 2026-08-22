/**
 * Persistent Device Media Storage Manager (IndexedDB Media Vault)
 * 
 * Provides permanent, high-capacity offline storage in phone memory / browser IndexedDB
 * for large video files (WebM/MP4), custom audio, and images.
 * 
 * Ensures media files persist indefinitely across sessions, restarts, and reloads
 * so users never have to re-enter or re-upload them multiple times.
 */

const MEDIA_DB_NAME = 'super_legend_media_vault_db';
const MEDIA_DB_VERSION = 1;
const MEDIA_STORE_NAME = 'media_blobs';

export interface StoredMediaRecord {
  id: string;
  blob: Blob;
  mimeType: string;
  fileName?: string;
  size: number;
  updatedAt: number;
}

class PersistentMediaStorage {
  private dbPromise: Promise<IDBDatabase | null> | null = null;
  // Active session object URLs mapped by media ID for zero-latency retrieval
  private activeObjectUrls: Map<string, string> = new Map();
  // In-memory Blobs for instant access
  private memoryBlobs: Map<string, Blob> = new Map();

  constructor() {
    if (typeof window !== 'undefined') {
      this.getDB();
    }
  }

  private getDB(): Promise<IDBDatabase | null> {
    if (this.dbPromise) return this.dbPromise;
    if (typeof window === 'undefined' || !('indexedDB' in window)) {
      return Promise.resolve(null);
    }

    this.dbPromise = new Promise((resolve) => {
      try {
        const request = indexedDB.open(MEDIA_DB_NAME, MEDIA_DB_VERSION);
        request.onupgradeneeded = () => {
          const db = request.result;
          if (!db.objectStoreNames.contains(MEDIA_STORE_NAME)) {
            db.createObjectStore(MEDIA_STORE_NAME, { keyPath: 'id' });
          }
        };
        request.onsuccess = () => resolve(request.result);
        request.onerror = (err) => {
          console.warn('Persistent Media DB open failed:', err);
          resolve(null);
        };
      } catch (err) {
        console.warn('Error opening Persistent Media DB:', err);
        resolve(null);
      }
    });

    return this.dbPromise;
  }

  /**
   * Save a media File or Blob permanently to Phone / Device IndexedDB storage.
   * Returns a live, working Object URL for the current session.
   */
  public async saveMediaBlob(id: string, fileOrBlob: File | Blob, fileName?: string): Promise<{ id: string; objectUrl: string }> {
    const mimeType = fileOrBlob.type || (fileOrBlob instanceof File ? fileOrBlob.type : 'video/webm');
    const name = fileName || (fileOrBlob instanceof File ? fileOrBlob.name : id);
    const size = fileOrBlob.size;

    // 1. Cache Blob & Object URL in memory
    this.memoryBlobs.set(id, fileOrBlob);
    
    // Revoke old object URL if any
    const oldUrl = this.activeObjectUrls.get(id);
    if (oldUrl && oldUrl.startsWith('blob:')) {
      try {
        URL.revokeObjectURL(oldUrl);
      } catch {}
    }

    const objectUrl = URL.createObjectURL(fileOrBlob);
    this.activeObjectUrls.set(id, objectUrl);

    // 2. Persist raw Blob into device IndexedDB permanently
    try {
      const db = await this.getDB();
      if (db) {
        await new Promise<void>((resolve, reject) => {
          const tx = db.transaction(MEDIA_STORE_NAME, 'readwrite');
          const store = tx.objectStore(MEDIA_STORE_NAME);
          const record: StoredMediaRecord = {
            id,
            blob: fileOrBlob,
            mimeType,
            fileName: name,
            size,
            updatedAt: Date.now()
          };
          const req = store.put(record);
          req.onsuccess = () => resolve();
          req.onerror = () => reject(req.error);
        });
      }
    } catch (err) {
      console.warn(`Failed persisting media ${id} to IndexedDB:`, err);
    }

    return { id, objectUrl };
  }

  /**
   * Retrieve raw Blob from memory or Device IndexedDB
   */
  public async getMediaBlob(id: string): Promise<Blob | null> {
    if (this.memoryBlobs.has(id)) {
      return this.memoryBlobs.get(id)!;
    }

    try {
      const db = await this.getDB();
      if (!db) return null;

      return new Promise<Blob | null>((resolve) => {
        const tx = db.transaction(MEDIA_STORE_NAME, 'readonly');
        const store = tx.objectStore(MEDIA_STORE_NAME);
        const req = store.get(id);
        req.onsuccess = () => {
          const record = req.result as StoredMediaRecord | undefined;
          if (record && record.blob) {
            this.memoryBlobs.set(id, record.blob);
            resolve(record.blob);
          } else {
            resolve(null);
          }
        };
        req.onerror = () => resolve(null);
      });
    } catch {
      return null;
    }
  }

  /**
   * Get a live, working Object URL for the media item.
   * If not active in memory, it automatically reads the Blob from device IndexedDB and generates a new Object URL.
   */
  public async getMediaObjectUrl(id: string): Promise<string | null> {
    if (this.activeObjectUrls.has(id)) {
      return this.activeObjectUrls.get(id)!;
    }

    const blob = await this.getMediaBlob(id);
    if (!blob) return null;

    const newUrl = URL.createObjectURL(blob);
    this.activeObjectUrls.set(id, newUrl);
    return newUrl;
  }

  /**
   * Synchronously get current active object URL if already rehydrated
   */
  public getActiveObjectUrlSync(id: string): string | null {
    return this.activeObjectUrls.get(id) || null;
  }

  /**
   * Check if a specific media asset exists in persistent device storage
   */
  public async hasMedia(id: string): Promise<boolean> {
    if (this.memoryBlobs.has(id)) return true;
    const blob = await this.getMediaBlob(id);
    return blob !== null;
  }

  /**
   * Delete media asset from Phone / Device storage
   */
  public async deleteMedia(id: string): Promise<void> {
    this.memoryBlobs.delete(id);
    const oldUrl = this.activeObjectUrls.get(id);
    if (oldUrl && oldUrl.startsWith('blob:')) {
      try {
        URL.revokeObjectURL(oldUrl);
      } catch {}
    }
    this.activeObjectUrls.delete(id);

    try {
      const db = await this.getDB();
      if (db) {
        const tx = db.transaction(MEDIA_STORE_NAME, 'readwrite');
        tx.objectStore(MEDIA_STORE_NAME).delete(id);
      }
    } catch (err) {
      console.warn('Error deleting media from DB:', err);
    }
  }

  /**
   * Rehydrate and preload all media files stored in device memory at app boot
   */
  public async preloadAllDeviceMedia(): Promise<Map<string, string>> {
    const urls = new Map<string, string>();
    try {
      const db = await this.getDB();
      if (!db) return urls;

      const records = await new Promise<StoredMediaRecord[]>((resolve) => {
        const tx = db.transaction(MEDIA_STORE_NAME, 'readonly');
        const store = tx.objectStore(MEDIA_STORE_NAME);
        const req = store.getAll();
        req.onsuccess = () => resolve((req.result as StoredMediaRecord[]) || []);
        req.onerror = () => resolve([]);
      });

      for (const record of records) {
        if (record.id && record.blob) {
          this.memoryBlobs.set(record.id, record.blob);
          const objUrl = URL.createObjectURL(record.blob);
          this.activeObjectUrls.set(record.id, objUrl);
          urls.set(record.id, objUrl);
        }
      }
    } catch (err) {
      console.warn('Error preloading device media:', err);
    }
    return urls;
  }

  /**
   * Get total persistent storage usage in device memory
   */
  public async getStorageUsageStats(): Promise<{ totalBytes: number; fileCount: number; formattedSize: string }> {
    let totalBytes = 0;
    let fileCount = 0;
    try {
      const db = await this.getDB();
      if (db) {
        const records = await new Promise<StoredMediaRecord[]>((resolve) => {
          const tx = db.transaction(MEDIA_STORE_NAME, 'readonly');
          const store = tx.objectStore(MEDIA_STORE_NAME);
          const req = store.getAll();
          req.onsuccess = () => resolve((req.result as StoredMediaRecord[]) || []);
          req.onerror = () => resolve([]);
        });

        fileCount = records.length;
        totalBytes = records.reduce((acc, curr) => acc + (curr.size || curr.blob?.size || 0), 0);
      }
    } catch {}

    const mb = totalBytes / (1024 * 1024);
    const formattedSize = mb > 1 ? `${mb.toFixed(1)} MB` : `${(totalBytes / 1024).toFixed(0)} KB`;
    return { totalBytes, fileCount, formattedSize };
  }
}

export const persistentMediaStorage = new PersistentMediaStorage();

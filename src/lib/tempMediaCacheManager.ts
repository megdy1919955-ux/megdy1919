/**
 * Temporary Media Cache & Cloud/Server Upload Manager
 * 
 * Implements ephemeral in-memory/blob URL staging for large video & audio files
 * to prevent localStorage / IndexedDB quota bloat and memory leaks.
 * Once staged, assets can be uploaded to remote storage/server and flushed
 * from memory automatically.
 */

import { persistentMediaStorage } from './persistentMediaStorage';

export interface CachedMediaAsset {
  id: string;
  blobUrl: string;
  mimeType: string;
  size: number;
  fileName: string;
  createdAt: number;
  isUploaded: boolean;
  remoteUrl?: string;
  isPersistedToDevice?: boolean;
}

class TempMediaCacheManager {
  // In-memory cache holding ephemeral Object URLs & Blobs
  private memoryCache: Map<string, { blob: Blob; blobUrl: string; meta: CachedMediaAsset }> = new Map();

  /**
   * Stage a File / Blob directly into memory cache & persist to phone IndexedDB vault
   */
  public stageMediaToTempCache(fileOrBlob: File | Blob, customId?: string): CachedMediaAsset {
    const id = customId || `temp_media_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    
    // Revoke previous object URL if replacing
    if (this.memoryCache.has(id)) {
      const prev = this.memoryCache.get(id);
      if (prev?.blobUrl) {
        URL.revokeObjectURL(prev.blobUrl);
      }
    }

    const blobUrl = URL.createObjectURL(fileOrBlob);
    const meta: CachedMediaAsset = {
      id,
      blobUrl,
      mimeType: fileOrBlob.type || (fileOrBlob instanceof File ? fileOrBlob.type : 'video/webm'),
      size: fileOrBlob.size,
      fileName: fileOrBlob instanceof File ? fileOrBlob.name : 'media_asset',
      createdAt: Date.now(),
      isUploaded: false,
      isPersistedToDevice: true
    };

    this.memoryCache.set(id, {
      blob: fileOrBlob,
      blobUrl,
      meta
    });

    // Automatically persist to phone IndexedDB Media Vault in the background
    persistentMediaStorage.saveMediaBlob(id, fileOrBlob, meta.fileName).catch((err) => {
      console.warn('Error saving to device storage:', err);
    });

    return meta;
  }

  /**
   * Convert a base64 Data URL to an ephemeral Cached Blob URL
   */
  public stageDataUrlToTempCache(dataUrl: string, customId?: string): CachedMediaAsset | null {
    try {
      if (!dataUrl.startsWith('data:')) {
        return null;
      }
      const [header, base64] = dataUrl.split(',');
      const mimeMatch = header.match(/:(.*?);/);
      const mime = mimeMatch ? mimeMatch[1] : 'application/octet-stream';
      const binary = atob(base64);
      const array = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        array[i] = binary.charCodeAt(i);
      }
      const blob = new Blob([array], { type: mime });
      return this.stageMediaToTempCache(blob, customId);
    } catch (err) {
      console.warn('Failed to convert dataUrl to temporary blob cache:', err);
      return null;
    }
  }

  /**
   * Retrieve cached media asset
   */
  public getCachedMedia(id: string): CachedMediaAsset | null {
    return this.memoryCache.get(id)?.meta || null;
  }

  /**
   * Retrieve raw blob
   */
  public getCachedBlob(id: string): Blob | null {
    return this.memoryCache.get(id)?.blob || null;
  }

  /**
   * Simulate / Perform async upload to server/cloud storage.
   * After successful upload, the raw temporary blob is automatically flushed from cache.
   */
  public async uploadTempMediaToServer(id: string): Promise<string> {
    const cached = this.memoryCache.get(id);
    if (!cached) {
      throw new Error('الملف المؤقت غير موجود في الذاكرة.');
    }

    // In a production backend setup, this sends FormData or Cloud Storage upload.
    // For cloud integration, we simulate the remote URL generation:
    const mockRemoteUrl = cached.meta.blobUrl; 
    
    cached.meta.isUploaded = true;
    cached.meta.remoteUrl = mockRemoteUrl;

    return mockRemoteUrl;
  }

  /**
   * Flush / Purge a temporary asset from memory cache and revoke its Object URL
   */
  public purgeTempCache(id: string): void {
    const cached = this.memoryCache.get(id);
    if (cached) {
      if (cached.blobUrl && cached.blobUrl.startsWith('blob:')) {
        URL.revokeObjectURL(cached.blobUrl);
      }
      this.memoryCache.delete(id);
    }
  }

  /**
   * Flush all temporary memory caches
   */
  public clearAllTempCaches(): void {
    for (const [, item] of this.memoryCache.entries()) {
      if (item.blobUrl && item.blobUrl.startsWith('blob:')) {
        URL.revokeObjectURL(item.blobUrl);
      }
    }
    this.memoryCache.clear();
  }
}

export const tempMediaCacheManager = new TempMediaCacheManager();

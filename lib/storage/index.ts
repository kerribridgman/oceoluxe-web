import { StorageService, StorageConfig, StorageType } from './types';
import { VercelBlobStorageService } from './vercel-blob';

/**
 * Factory function to create appropriate storage service based on configuration
 */
export function createStorageService(config?: StorageConfig): StorageService {
  const storageType: StorageType =
    (config?.type as StorageType) ||
    (process.env.STORAGE_TYPE as StorageType) ||
    'vercel-blob';

  switch (storageType) {
    case 'vercel-blob':
      const token = config?.vercelBlob?.token || process.env.BLOB_READ_WRITE_TOKEN;
      return new VercelBlobStorageService(token);

    default:
      throw new Error(`Unsupported storage type: ${storageType}`);
  }
}

// Export a singleton instance for the default configuration
let defaultStorageService: StorageService | null = null;

export function getStorageService(): StorageService {
  if (!defaultStorageService) {
    defaultStorageService = createStorageService();
  }
  return defaultStorageService;
}

// Export types and classes
export * from './types';
export { VercelBlobStorageService } from './vercel-blob';

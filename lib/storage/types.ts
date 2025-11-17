export interface StorageService {
  /**
   * Upload a file to storage
   * @param file - File buffer to upload
   * @param path - Relative path where file should be stored
   * @param contentType - MIME type of the file
   * @returns Full path/URL to the uploaded file
   */
  upload(file: Buffer, path: string, contentType?: string): Promise<string>;

  /**
   * Download a file from storage
   * @param path - Path to the file
   * @returns File buffer
   */
  download(path: string): Promise<Buffer>;

  /**
   * Delete a file from storage
   * @param path - Path to the file
   */
  delete(path: string): Promise<void>;

  /**
   * Get a signed URL for temporary file access
   * @param path - Path to the file
   * @param expiresIn - Expiration time in seconds
   * @returns Signed URL
   */
  getSignedUrl(path: string, expiresIn: number): Promise<string>;

  /**
   * Check if a file exists
   * @param path - Path to the file
   * @returns true if file exists
   */
  exists(path: string): Promise<boolean>;
}

export type StorageType = 'vercel-blob';

export interface StorageConfig {
  type: StorageType;
  vercelBlob?: {
    token: string;
  };
}

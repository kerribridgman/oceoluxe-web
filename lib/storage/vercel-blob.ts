import { StorageService } from './types';
import { put, del, head } from '@vercel/blob';

export class VercelBlobStorageService implements StorageService {
  private token: string;

  constructor(token?: string) {
    this.token = token || process.env.BLOB_READ_WRITE_TOKEN || '';

    if (!this.token) {
      throw new Error('Vercel Blob token is required. Set BLOB_READ_WRITE_TOKEN environment variable.');
    }
  }

  async upload(file: Buffer, relativePath: string, contentType?: string): Promise<string> {
    try {
      const blob = await put(relativePath, file, {
        access: 'public',
        token: this.token,
        contentType: contentType || 'application/octet-stream',
      });

      // Return the public URL
      return blob.url;
    } catch (error: any) {
      console.error('Vercel Blob upload error:', error);
      throw new Error(`Failed to upload to Vercel Blob: ${error.message}`);
    }
  }

  async download(path: string): Promise<Buffer> {
    try {
      // If path is a full URL, fetch it directly
      const url = path.startsWith('http') ? path : path;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Failed to download: ${response.statusText}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      return Buffer.from(arrayBuffer);
    } catch (error: any) {
      console.error('Vercel Blob download error:', error);
      throw new Error(`Failed to download from Vercel Blob: ${error.message}`);
    }
  }

  async delete(path: string): Promise<void> {
    try {
      // If path is a relative path, we need the full URL
      // For deletion, we need the full URL from Vercel Blob
      await del(path, { token: this.token });
    } catch (error: any) {
      console.error('Vercel Blob delete error:', error);
      throw new Error(`Failed to delete from Vercel Blob: ${error.message}`);
    }
  }

  async getSignedUrl(path: string, expiresIn: number = 3600): Promise<string> {
    // Vercel Blob URLs are already public and don't need signing
    // If the path is already a full URL, return it
    if (path.startsWith('http')) {
      return path;
    }

    // Otherwise, this might be a relative path that was stored
    // In practice, we should always store the full URL from upload()
    return path;
  }

  async exists(path: string): Promise<boolean> {
    try {
      // Use the head() method to check if blob exists
      await head(path, { token: this.token });
      return true;
    } catch (error: any) {
      // If the blob doesn't exist, head() will throw an error
      if (error.message?.includes('not found') || error.message?.includes('404')) {
        return false;
      }
      // For other errors, rethrow
      throw error;
    }
  }
}

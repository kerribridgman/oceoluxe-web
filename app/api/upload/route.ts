import { NextRequest, NextResponse } from 'next/server';
import { getUser } from '@/lib/db/queries';
import { getStorageService } from '@/lib/storage';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const user = await getUser();

    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string; // 'cover', 'og', 'blog', etc.

    if (!file) {
      return NextResponse.json(
        { message: 'No file provided' },
        { status: 400 }
      );
    }

    // SECURITY: Validate the type parameter to prevent path traversal
    const allowedTypes = ['cover', 'og', 'blog'];
    if (!type || !allowedTypes.includes(type) || type.includes('/') || type.includes('\\') || type.includes('..')) {
      return NextResponse.json(
        { message: 'Invalid file type' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { message: 'Only image files are allowed' },
        { status: 400 }
      );
    }

    // Validate file size (10MB max)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { message: 'File size must be less than 10MB' },
        { status: 400 }
      );
    }

    const storage = getStorageService();
    const buffer = Buffer.from(await file.arrayBuffer());

    // Generate unique filename
    const timestamp = Date.now();
    const fileExt = path.extname(file.name);
    const fileName = `${type}-${user.id}-${timestamp}${fileExt}`;
    const filePath = `users/${user.id}/${fileName}`;

    // Upload to storage
    const uploadedUrl = await storage.upload(buffer, filePath, file.type);

    // The upload method returns the correct URL:
    // - For Vercel Blob: full public URL (https://...vercel-storage.com/...)
    // Use it directly without calling getSignedUrl
    return NextResponse.json({
      message: 'File uploaded successfully',
      url: uploadedUrl,
      fileName,
      filePath, // Also return the relative file path for reference
    });
  } catch (error: any) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { message: error.message || 'Failed to upload file' },
      { status: 500 }
    );
  }
}

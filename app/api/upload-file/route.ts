import { put } from '@vercel/blob';
import { NextRequest, NextResponse } from 'next/server';
import { getUser } from '@/lib/db/queries';

const ALLOWED_TYPES: Record<string, string[]> = {
  // Images
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/gif': ['.gif'],
  'image/svg+xml': ['.svg'],
  // Documents
  'application/pdf': ['.pdf'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
  'application/msword': ['.doc'],
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
  'application/vnd.ms-excel': ['.xls'],
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
  'text/csv': ['.csv'],
  // Archives
  'application/zip': ['.zip'],
  'application/x-zip-compressed': ['.zip'],
};

const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB

export async function POST(request: NextRequest) {
  try {
    const user = await getUser();

    if (!user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { message: 'No file provided' },
        { status: 400 }
      );
    }

    if (!ALLOWED_TYPES[file.type]) {
      return NextResponse.json(
        {
          message:
            'Invalid file type. Allowed: JPG, PNG, GIF, SVG, PDF, DOC, DOCX, XLS, XLSX, PPTX, CSV, ZIP',
        },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { message: 'File size exceeds 25MB limit' },
        { status: 400 }
      );
    }

    const folder = (formData.get('folder') as string) || 'attachments';
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(7);
    const extension = file.name.split('.').pop()?.toLowerCase() || 'bin';
    const filename = `${folder}/${timestamp}-${randomString}.${extension}`;

    const blob = await put(filename, file, {
      access: 'public',
      addRandomSuffix: false,
    });

    return NextResponse.json({
      url: blob.url,
      filename: file.name,
      type: file.type,
      size: file.size,
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { message: 'Failed to upload file' },
      { status: 500 }
    );
  }
}

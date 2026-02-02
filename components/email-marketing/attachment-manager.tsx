'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import {
  Paperclip,
  X,
  FileText,
  Image,
  FileSpreadsheet,
  File,
  Presentation,
  Archive,
  Upload,
  Loader2,
} from 'lucide-react';

export interface Attachment {
  filename: string;
  url: string;
  type: string;
}

interface AttachmentManagerProps {
  attachments: Attachment[];
  onChange: (attachments: Attachment[]) => void;
}

const ACCEPT =
  '.jpg,.jpeg,.png,.gif,.svg,.pdf,.doc,.docx,.xls,.xlsx,.pptx,.csv,.zip';

function getFileIcon(type: string) {
  if (type.startsWith('image/')) return Image;
  if (type.includes('pdf')) return FileText;
  if (type.includes('spreadsheet') || type.includes('excel') || type.includes('csv'))
    return FileSpreadsheet;
  if (type.includes('presentation') || type.includes('pptx')) return Presentation;
  if (type.includes('zip')) return Archive;
  if (type.includes('word') || type.includes('document')) return FileText;
  return File;
}

function getFileColor(type: string) {
  if (type.startsWith('image/')) return 'text-blue-500';
  if (type.includes('pdf')) return 'text-red-500';
  if (type.includes('spreadsheet') || type.includes('excel') || type.includes('csv'))
    return 'text-green-600';
  if (type.includes('presentation') || type.includes('pptx')) return 'text-orange-500';
  if (type.includes('zip')) return 'text-amber-600';
  if (type.includes('word') || type.includes('document')) return 'text-blue-600';
  return 'text-[#967F71]';
}

export function AttachmentManager({ attachments: rawAttachments, onChange }: AttachmentManagerProps) {
  // Handle case where attachments arrive as a JSON string instead of an array
  const attachments: Attachment[] = Array.isArray(rawAttachments)
    ? rawAttachments
    : typeof rawAttachments === 'string'
      ? (() => { try { const parsed = JSON.parse(rawAttachments); return Array.isArray(parsed) ? parsed : []; } catch { return []; } })()
      : [];

  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setError('');

    const newAttachments: Attachment[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'email-attachments');

      try {
        const response = await fetch('/api/upload-file', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const data = await response.json();
          setError(data.message || `Failed to upload ${file.name}`);
          continue;
        }

        const data = await response.json();
        newAttachments.push({
          filename: data.filename,
          url: data.url,
          type: data.type,
        });
      } catch {
        setError(`Failed to upload ${file.name}`);
      }
    }

    if (newAttachments.length > 0) {
      onChange([...attachments, ...newAttachments]);
    }

    setIsUploading(false);

    // Reset input so same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }

  function handleRemove(index: number) {
    onChange(attachments.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Paperclip className="h-4 w-4 text-[#967F71]" />
        <span className="text-sm font-medium text-[#3B3937]">Attachments</span>
        {attachments.length > 0 && (
          <span className="text-xs text-[#967F71]">({attachments.length})</span>
        )}
      </div>

      {/* Attached files list */}
      {attachments.length > 0 && (
        <div className="space-y-2">
          {attachments.map((attachment, index) => {
            const Icon = getFileIcon(attachment.type);
            const color = getFileColor(attachment.type);
            return (
              <div
                key={index}
                className="flex items-center gap-3 px-3 py-2 bg-[#faf8f5] rounded-lg border border-[#967F71]/10"
              >
                <Icon className={`h-4 w-4 flex-shrink-0 ${color}`} />
                <span className="text-sm text-[#3B3937] truncate flex-1">
                  {attachment.filename}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  className="p-1 text-[#967F71] hover:text-red-500 transition-colors"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Upload button */}
      <input
        ref={fileInputRef}
        type="file"
        accept={ACCEPT}
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
        className="text-[#967F71]"
      >
        {isUploading ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Uploading...
          </>
        ) : (
          <>
            <Upload className="h-4 w-4 mr-2" />
            Add Files
          </>
        )}
      </Button>
      <p className="text-xs text-[#967F71]">
        JPG, PNG, GIF, SVG, PDF, Word, Excel, PowerPoint, CSV, ZIP (max 25MB)
      </p>

      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

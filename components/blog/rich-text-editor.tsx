'use client';

import { useEffect, useState } from 'react';
import { BlockNoteEditor, defaultBlockSpecs, PartialBlock } from '@blocknote/core';
import { BlockNoteView } from '@blocknote/mantine';
import '@blocknote/core/fonts/inter.css';
import '@blocknote/mantine/style.css';

interface RichTextEditorProps {
  initialContent?: string | null;
  initialContentJson?: any;
  onChange?: (markdown: string, json: any) => void;
  editable?: boolean;
}

export function RichTextEditor({
  initialContent,
  initialContentJson,
  onChange,
  editable = true,
}: RichTextEditorProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [editor, setEditor] = useState<any>(null);

  // Upload image to Vercel Blob storage
  async function uploadFile(file: File): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      const data = await response.json();
      return data.url;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  }

  // Create editor on client side only
  useEffect(() => {
    if (typeof window !== 'undefined' && !editor) {
      const newEditor = BlockNoteEditor.create({
        uploadFile,
        initialContent: initialContentJson
          ? (initialContentJson as PartialBlock[])
          : undefined,
      });
      setEditor(newEditor);
      setIsMounted(true);
    }
  }, []);

  // Load initial markdown content if no JSON content is provided
  // This effect runs whenever initialContent, initialContentJson, or editor changes
  useEffect(() => {
    async function loadMarkdown() {
      if (!editor) return;

      // If we have JSON content, load it
      if (initialContentJson) {
        try {
          editor.replaceBlocks(editor.document, initialContentJson as PartialBlock[]);
        } catch (error) {
          console.error('Error loading JSON content:', error);
        }
      }
      // Otherwise, if we have markdown content, parse and load it
      else if (initialContent && initialContent.trim()) {
        try {
          // Try to parse the markdown
          const blocks = await editor.tryParseMarkdownToBlocks(initialContent);
          editor.replaceBlocks(editor.document, blocks);
        } catch (error) {
          console.error('Error parsing markdown:', error);
          // If parsing fails, just clear the editor and let the user start fresh
          // This avoids showing broken content
          editor.replaceBlocks(editor.document, [
            {
              type: "paragraph",
              content: "",
            },
          ]);
        }
      }
    }

    loadMarkdown();
  }, [initialContent, initialContentJson, editor]);

  // Handle content changes
  async function handleEditorChange() {
    if (!editor || !onChange) return;

    const markdown = await editor.blocksToMarkdownLossy(editor.document);
    const json = editor.document;
    onChange(markdown, json);
  }

  if (!isMounted || !editor) {
    return (
      <div className="min-h-[400px] bg-gray-50 rounded-md border border-gray-200 flex items-center justify-center">
        <p className="text-gray-500">Loading editor...</p>
      </div>
    );
  }

  return (
    <div className="blocknote-editor-wrapper">
      <BlockNoteView
        editor={editor}
        editable={editable}
        theme="light"
        className="min-h-[400px]"
        onChange={handleEditorChange}
      />
    </div>
  );
}

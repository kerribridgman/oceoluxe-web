/**
 * Upload Image Tool
 */

import { readFileSync } from 'fs';

export const definition = {
  name: 'upload_image',
  description: 'Upload an image to the blog. Returns a URL that can be used in blog posts.',
  inputSchema: {
    type: 'object',
    properties: {
      filePath: {
        type: 'string',
        description: 'Path to the image file on your local system',
      },
    },
    required: ['filePath'],
  },
};

export async function execute(args, { API_BASE_URL, API_KEY }) {
  try {
    // Read the file
    const fileBuffer = readFileSync(args.filePath);
    const fileName = args.filePath.split('/').pop();

    // Detect mime type from file extension
    const extension = fileName.split('.').pop().toLowerCase();
    const mimeTypes = {
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'png': 'image/png',
      'gif': 'image/gif',
      'webp': 'image/webp',
    };
    const mimeType = mimeTypes[extension] || 'image/jpeg';

    // Create form data
    const formData = new FormData();
    const blob = new Blob([fileBuffer], { type: mimeType });
    formData.append('file', blob, fileName);

    const response = await fetch(`${API_BASE_URL}/api/mcp/upload-image`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to upload image');
    }

    const data = await response.json();

    return {
      content: [
        {
          type: 'text',
          text: `✅ Image uploaded successfully!

**URL:** ${data.url}

You can use this URL in your blog posts:
![Image description](${data.url})`,
        },
      ],
    };
  } catch (error) {
    throw new Error(`Failed to upload image: ${error.message}`);
  }
}

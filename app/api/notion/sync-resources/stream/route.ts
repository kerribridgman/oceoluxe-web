import { NextRequest } from 'next/server';
import { getUser } from '@/lib/db/queries';
import { syncNotionResources } from '@/lib/notion-resources-sync';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const user = await getUser();

  if (!user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Check if user is admin/owner
  if (user.role !== 'owner' && user.role !== 'admin') {
    return new Response(JSON.stringify({ error: 'Forbidden' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Check if NOTION_RESOURCES_DB_ID is configured
  if (!process.env.NOTION_RESOURCES_DB_ID) {
    return new Response(
      JSON.stringify({ error: 'NOTION_RESOURCES_DB_ID not configured' }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const result = await syncNotionResources(user.id, (progress) => {
          const data = JSON.stringify({
            type: 'progress',
            ...progress,
          });
          controller.enqueue(encoder.encode(`data: ${data}\n\n`));
        });

        // Send final result
        const finalData = JSON.stringify({
          type: 'complete',
          ...result,
        });
        controller.enqueue(encoder.encode(`data: ${finalData}\n\n`));
        controller.close();
      } catch (error) {
        const errorData = JSON.stringify({
          type: 'error',
          error: error instanceof Error ? error.message : 'Unknown error',
        });
        controller.enqueue(encoder.encode(`data: ${errorData}\n\n`));
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  });
}

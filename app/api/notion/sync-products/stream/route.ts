import { NextRequest } from 'next/server';
import { syncNotionProducts } from '@/lib/notion-product-sync';
import { getUser } from '@/lib/db/queries';

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

  // Get limit from query params
  const { searchParams } = new URL(request.url);
  const limitParam = searchParams.get('limit');
  const limit = limitParam ? parseInt(limitParam, 10) : undefined;

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const sendEvent = (data: any) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      };

      try {
        // Send initial event
        const limitText = limit === 1 ? 'latest product' : limit ? `last ${limit} products` : 'all products';
        sendEvent({ type: 'start', message: `Starting sync of ${limitText}...` });

        const result = await syncNotionProducts(user.id, (progress) => {
          sendEvent({
            type: 'progress',
            current: progress.current,
            total: progress.total,
            title: progress.currentTitle,
            status: progress.status,
            percentage: Math.round((progress.current / progress.total) * 100),
          });
        }, limit);

        // Send completion event
        sendEvent({
          type: 'complete',
          success: result.success,
          synced: result.synced,
          products: result.products,
          errors: result.errors,
        });

      } catch (error) {
        sendEvent({
          type: 'error',
          message: error instanceof Error ? error.message : 'Unknown error',
        });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}

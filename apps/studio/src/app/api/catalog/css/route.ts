import { readPreviewCss } from '@/lib/catalog-files';

export async function GET() {
  return new Response(await readPreviewCss(), {
    headers: {
      'Content-Type': 'text/css; charset=utf-8',
      'Cache-Control': 'public, max-age=300, stale-while-revalidate=3600',
    },
  });
}

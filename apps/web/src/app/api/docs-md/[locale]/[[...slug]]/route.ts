import { ContentRepository } from '@/lib/content-repository';
import { locales, type SupportedLocale } from '@/lib/domains';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ locale: string; slug?: string[] }> },
) {
  const { locale, slug } = await params;

  if (!locales.includes(locale as SupportedLocale)) {
    return new Response('Not found', { status: 404 });
  }

  const doc = ContentRepository.getDocBySlug(slug?.join('/') ?? '', locale);

  if (!doc || !doc.published) {
    return new Response('Not found', { status: 404 });
  }

  const body = `# ${doc.title}\n\n${doc.description ? `> ${doc.description}\n\n` : ''}${doc.raw.trim()}\n`;

  return new Response(body, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}

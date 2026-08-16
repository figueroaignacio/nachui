import { ContentRepository } from '@/lib/content-repository';
import { baseUrl } from '@/lib/domains';

export async function GET() {
  const docs = ContentRepository.getDocs('en')
    .filter((doc) => doc.published)
    .sort((a, b) => a.slugAsParams.localeCompare(b.slugAsParams));

  const section = (title: string, prefix: string) => {
    const entries = docs.filter((doc) =>
      prefix === '' ? doc.slugAsParams === '' : doc.slugAsParams.startsWith(prefix),
    );

    if (entries.length === 0) return '';

    const lines = entries.map(
      (doc) =>
        `- [${doc.title}](${baseUrl}/en/docs${doc.slugAsParams ? `/${doc.slugAsParams}` : ''}.md)${
          doc.description ? `: ${doc.description}` : ''
        }`,
    );

    return `## ${title}\n\n${lines.join('\n')}`;
  };

  const blocks = [
    '# NachUI\n\n> Editorial, zero-dependency React components you copy straight into your repository. No npm wrapper, no black boxes — you own the source, the design tokens and the patterns.\n\nEach link below serves the raw markdown of that page. Append `.md` to any docs URL to get its source.',
    section('Getting started', ''),
    section('Concepts', 'concepts/'),
    section('UI elements', 'elements/ui'),
    section('Layout elements', 'elements/layout'),
    `## Optional\n\n- [Sitemap](${baseUrl}/sitemap.xml)\n- [Docs index (JSON)](${baseUrl}/api/docs)`,
  ];

  const body = `${blocks.filter(Boolean).join('\n\n')}\n`;

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}

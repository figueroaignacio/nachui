import { ICON_CATALOG } from '@/features/icons/lib/icons';
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

  const iconsSection = () => {
    const names = ICON_CATALOG.map((icon) => icon.name).join(', ');
    return (
      `## Icons\n\n` +
      `An optional icon set drawn on a 24x24 grid with a 1.5 stroke. Each icon is one self-contained React component; ` +
      `install with \`npx nachui add icons/<name>\` or copy it from ${baseUrl}/en/icons.\n\n` +
      `Available: ${names}.`
    );
  };

  const blocks = [
    '# NachUI\n\n> Editorial, zero-dependency React components you copy straight into your repository. No npm wrapper and no black boxes, so you own the source, the design tokens and the patterns. Written to be read by the developer and by whatever agent is helping them.\n\nEach link below serves the raw markdown of that page. Append `.md` to any docs URL to get its source.',
    section('Getting started', ''),
    section('Concepts', 'concepts/'),
    section('UI elements', 'elements/ui'),
    section('Layout elements', 'elements/layout'),
    section('AI elements', 'elements/ai'),
    section('Hybrid elements', 'elements/hybrids'),
    iconsSection(),
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

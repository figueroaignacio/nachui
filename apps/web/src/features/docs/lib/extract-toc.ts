import GithubSlugger from 'github-slugger';

export type TocEntry = {
  title: string;
  url: string;
  items?: TocEntry[];
};

/** Strips the inline markdown that never survives into a heading's text. */
function cleanHeadingText(raw: string) {
  return raw
    .replace(/`([^`]*)`/g, '$1')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[*_]{1,3}([^*_]+)[*_]{1,3}/g, '$1')
    .replace(/<[^>]+>/g, '')
    .trim();
}

/**
 * Builds the table of contents straight from the markdown source.
 *
 * It used to ride along with the MDX compilation as a rehype plugin, but
 * `compileMDX` is cached: on a cache hit the plugins never run, the callback
 * never fires, and every document ends up with an empty toc, which is why it
 * only ever appeared on a cold build.
 */
export function extractToc(content: string): TocEntry[] {
  const slugger = new GithubSlugger();
  const headings: { depth: number; id: string; text: string }[] = [];
  let inFence = false;

  for (const line of content.split('\n')) {
    if (/^\s*(```|~~~)/.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;

    const match = line.match(/^(#{2,3})\s+(.*\S)\s*$/);
    if (!match) continue;

    const text = cleanHeadingText(match[2] ?? '');
    if (!text) continue;

    // rehype-slug uses the same slugger, so these ids match the rendered ones.
    headings.push({ depth: match[1]?.length ?? 2, id: slugger.slug(text), text });
  }

  const toc: TocEntry[] = [];
  let currentH2: TocEntry | null = null;

  for (const heading of headings) {
    const entry: TocEntry = { title: heading.text, url: `#${heading.id}` };

    if (heading.depth === 2) {
      currentH2 = entry;
      toc.push(entry);
    } else if (heading.depth === 3 && currentH2) {
      currentH2.items ??= [];
      currentH2.items.push(entry);
    } else {
      toc.push(entry);
    }
  }

  return toc;
}

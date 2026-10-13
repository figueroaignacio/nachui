export interface Chunk {
  content: string;
  index: number;
  section?: string;
}

/** Bump when the splitting strategy changes so the ingest re-embeds every doc. */
export const CHUNKER_VERSION = 1;
export const DEFAULT_MAX_CHUNK_SIZE = 1500;

/**
 * Split MDX content into semantic chunks.
 * Strategy: Split on headings (## / ###), then split long sections by paragraphs.
 */
export function chunkDocument(raw: string, maxChunkSize = DEFAULT_MAX_CHUNK_SIZE): Chunk[] {
  const sections = raw.split(/(?=^#{2,3}\s)/m);
  const chunks: Chunk[] = [];
  let index = 0;

  for (const section of sections) {
    const trimmed = section.trim();
    if (!trimmed) continue;

    const headingMatch = trimmed.match(/^#{2,3}\s+(.+)/);
    const sectionTitle = headingMatch?.[1]?.trim();

    if (trimmed.length <= maxChunkSize) {
      chunks.push({ content: trimmed, index: index++, section: sectionTitle });
    } else {
      const paragraphs = trimmed.split(/\n\n+/);
      let buffer = '';

      for (const para of paragraphs) {
        if (buffer.length + para.length > maxChunkSize && buffer) {
          chunks.push({ content: buffer.trim(), index: index++, section: sectionTitle });
          buffer = '';
        }
        buffer += para + '\n\n';
      }
      if (buffer.trim()) {
        chunks.push({ content: buffer.trim(), index: index++, section: sectionTitle });
      }
    }
  }

  return chunks;
}

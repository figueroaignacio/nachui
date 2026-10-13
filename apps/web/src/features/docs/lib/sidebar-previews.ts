/** The fields of a content-collections doc this module reads. */
export interface PreviewSourceDoc {
  locale: string;
  published: boolean;
  raw: string;
  slugAsParams: string;
  title: string;
  description?: string;
}

export interface SidebarPreview {
  title: string;
  description?: string;
  component: string;
  demo: string;
}

const PREVIEW_TAG = /<ComponentPreview\b[^>]*>/;
const attribute = (tag: string, name: string) => tag.match(new RegExp(`\\b${name}="([^"]+)"`))?.[1];

/**
 * The first live demo of every doc page in a locale, keyed by its nav href.
 * The sidebar uses it to preview a component before opening its page; pages
 * without a demo (concepts, guides) are left out.
 */
export function getSidebarPreviews(
  docs: readonly PreviewSourceDoc[],
  locale: string,
): Record<string, SidebarPreview> {
  const previews: Record<string, SidebarPreview> = {};

  for (const doc of docs) {
    if (doc.locale !== locale || !doc.published) continue;
    const tag = doc.raw.match(PREVIEW_TAG)?.[0];
    if (!tag) continue;
    const component = attribute(tag, 'component');
    const demo = attribute(tag, 'demo');
    if (!component || !demo) continue;

    previews[`/docs/${doc.slugAsParams}`] = {
      title: doc.title,
      description: doc.description,
      component,
      demo,
    };
  }

  return previews;
}

export type DocBadge = 'new' | 'updated';

export interface DocItem {
  title: string;
  href: string;
  description?: string;
  target?: string;
  badge?: DocBadge;
}

/**
 * A group in `docs.navigation`. `id` is stable across locales, so code finds
 * sections by id and leaves the translated `title` for display.
 */
export interface DocSection {
  id: string;
  title: string;
  items: DocItem[];
}

export type Navigation = DocItem;

export interface SearchResultItem {
  title: string;
  href: string;
  category: string;
  badge?: DocBadge;
}

export interface Message {
  id?: string;
  role: 'system' | 'user' | 'assistant';
  content: string;
  quote?: string;
  timestamp?: string | number;
}

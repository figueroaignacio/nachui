export type DocBadge = 'new' | 'updated';

export interface DocItem {
  title: string;
  href: string;
  target?: string;
  badge?: DocBadge;
}

export interface DocSection {
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

export interface NavigationSection {
  title: string;
  items: { title: string; href: string; badge?: DocBadge }[];
}

export interface Message {
  id?: string;
  role: 'system' | 'user' | 'assistant';
  content: string;
  timestamp?: string | number;
}

import type { Locale } from '@/lib/constants';
import { permanentRedirect } from 'next/navigation';

type PageProps = {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

/** Icons moved into the docs; old links keep their search and category. */
export default async function IconsPage({ params, searchParams }: PageProps) {
  const { locale } = await params;
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(await searchParams)) {
    if (typeof value === 'string') query.set(key, value);
  }
  const suffix = query.size > 0 ? `?${query.toString()}` : '';
  permanentRedirect(`/${locale}/docs/elements/icons${suffix}`);
}

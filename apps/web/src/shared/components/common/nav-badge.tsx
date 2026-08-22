import type { DocBadge } from '@/lib/definitions';
import { Badge } from '@repo/ui/components/badge';
import { cn } from '@repo/ui/lib/cn';
import { useTranslations } from 'next-intl';

const variantByBadge = {
  new: 'success',
  updated: 'info',
} as const;

/**
 * Small status chip next to a navigation link ("New" / "Updated"). Items opt in
 * through the optional `badge` field in locales/{en,es}/docs.json; the labels
 * live under `docs.badges` so both locales share the same enum value.
 */
export function NavBadge({ badge, className }: { badge?: DocBadge; className?: string }) {
  const t = useTranslations('docs.badges');

  if (!badge || !(badge in variantByBadge)) return null;

  return (
    <Badge variant={variantByBadge[badge]} className={cn('px-1.5 py-px text-[10px]', className)}>
      {t(badge)}
    </Badge>
  );
}

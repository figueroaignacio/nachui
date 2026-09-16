import { useDocsNavigation } from '@/features/docs/hooks/use-docs-navigation';
import { Link } from '@/i18n/navigation';
import { ChevronLeftIcon } from '@repo/ui/icons/chevron-left';
import { ChevronRightIcon } from '@repo/ui/icons/chevron-right';
import { Flex } from '@repo/ui/layout/flex';
import { Stack } from '@repo/ui/layout/stack';
import { useTranslations } from 'next-intl';

type DocsPaginationProps = {
  currentPath: string;
};

type NavItem = {
  title: string;
  href: string;
};

function PaginationLink({
  item,
  direction,
  label,
}: {
  item: NavItem | null;
  direction: 'prev' | 'next';
  label: string;
}) {
  const Icon = direction === 'prev' ? ChevronLeftIcon : ChevronRightIcon;
  const isNext = direction === 'next';

  if (!item) {
    return <div className="flex-1" />;
  }

  return (
    <Link
      href={item.href}
      className={`border-border hover:bg-secondary group flex-1 rounded-lg border p-4 transition-colors ${isNext ? 'text-right' : ''}`}
    >
      <Stack gap="2">
        <span
          className={`text-muted-foreground flex items-center gap-2 text-sm ${isNext ? 'justify-end' : ''}`}
        >
          {!isNext && <Icon className="h-4 w-4" />}
          {label}
          {isNext && <Icon className="h-4 w-4" />}
        </span>
        <span className="font-medium group-hover:underline">{item.title}</span>
      </Stack>
    </Link>
  );
}

export function DocsPagination({ currentPath }: DocsPaginationProps) {
  const t = useTranslations('components.docsPagination');
  const { prev, next } = useDocsNavigation(currentPath);

  if (!prev && !next) {
    return null;
  }

  return (
    <Flex direction="column" justify="between" gap="4" className="mt-12 py-2 lg:flex-row">
      <PaginationLink item={prev} direction="prev" label={t('previous')} />
      <PaginationLink item={next} direction="next" label={t('next')} />
    </Flex>
  );
}

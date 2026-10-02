import { ArrowUpRightIcon } from '@repo/ui/icons/arrow-up-right';
import { BookIcon } from '@repo/ui/icons/book';
import { cn } from '@repo/ui/lib/cn';
import { useTranslations } from 'next-intl';

interface ChatExplanationRequestProps {
  componentName: string;
  /** Path of the page the request was made from, when the prompt carries it. */
  href?: string;
}

export function ChatExplanationRequest({ componentName, href }: ChatExplanationRequestProps) {
  const t = useTranslations('components.chat.messages');

  const content = (
    <>
      <span className="bg-surface-muted text-muted-foreground flex size-8 shrink-0 items-center justify-center rounded-lg">
        <BookIcon size={15} aria-hidden="true" />
      </span>
      <span className="flex min-w-0 flex-col text-left">
        <span className="text-muted-foreground text-xs">{t('explainLabel')}</span>
        <span className="text-foreground truncate text-sm font-medium">{componentName}</span>
      </span>
      {href && (
        <ArrowUpRightIcon
          size={14}
          aria-hidden="true"
          className="text-muted-foreground group-hover:text-foreground ml-2 shrink-0 transition-colors"
        />
      )}
    </>
  );

  const cardClass =
    'border-rule bg-card flex max-w-[85%] items-center gap-3 rounded-2xl rounded-br-md border py-2.5 pr-3.5 pl-2.5';

  if (!href) return <div className={cardClass}>{content}</div>;

  return (
    <a
      href={href}
      className={cn(
        cardClass,
        'group hover:border-border-interactive focus-visible:ring-ring ring-offset-background transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
      )}
    >
      {content}
    </a>
  );
}

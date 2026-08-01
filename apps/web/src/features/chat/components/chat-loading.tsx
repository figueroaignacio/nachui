import { useTranslations } from 'next-intl';

export function ChatLoading() {
  const t = useTranslations('components.chat.messages');

  return (
    <div className="flex flex-col items-start space-y-2">
      <div className="flex animate-pulse items-center gap-1 rounded-xl text-sm backdrop-blur-sm">
        <span className="text-muted-foreground">{t('thinking')}</span>
        <span className="flex gap-0.5">
          <span className="bg-muted-foreground h-1 w-1 animate-pulse rounded-full" />
          <span className="bg-muted-foreground h-1 w-1 animate-pulse rounded-full delay-100" />
          <span className="bg-muted-foreground h-1 w-1 animate-pulse rounded-full delay-200" />
        </span>
      </div>
    </div>
  );
}

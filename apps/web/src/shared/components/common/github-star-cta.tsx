import { GitHubIcon } from '@/components/common/tech-icons';
import { StarIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { Card } from '@repo/ui/components/card';
import { useTranslations } from 'next-intl';

const GITHUB_URL = 'https://github.com/figueroaignacio/ui';

export function GitHubStarHeroCta() {
  const t = useTranslations('components.githubStar');

  return (
    <a
      href={GITHUB_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="group bg-card hover:border-primary/30 hover:bg-accent/50 relative inline-flex items-center gap-3 overflow-hidden rounded-full border px-2 py-1 transition-colors duration-300"
      aria-label={t('ariaLabel')}
    >
      <div
        className="via-primary/[0.07] pointer-events-none absolute inset-0 -skew-x-12 bg-linear-to-r from-transparent to-transparent"
        style={{ width: '200%' }}
      />

      <span className="relative flex items-center gap-2.5">
        <span className="text-muted-foreground group-hover:text-foreground transition-colors duration-200">
          <GitHubIcon />
        </span>
        <span className="text-foreground/80 group-hover:text-foreground text-sm font-medium transition-colors duration-200">
          {t('heroLabel')}
        </span>
      </span>

      <span className="bg-primary/10 text-primary group-hover:bg-primary/20 relative hidden items-center gap-1.5 rounded-full px-2.5 py-1 transition-colors duration-200 sm:flex">
        <span className="flex items-center">
          <HugeiconsIcon
            icon={StarIcon}
            size={14}
            className="-rotate-12 fill-amber-500 text-amber-500 transition-all duration-300 group-hover:scale-125"
          />
        </span>
        <span className="text-xs font-semibold">{t('starAction')}</span>
      </span>
    </a>
  );
}

export function GitHubStarTocCta() {
  const t = useTranslations('components.githubStar');
  return (
    <div className="border-border/40 mt-6 border-t pt-5">
      <a
        href={GITHUB_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="group block no-underline"
        aria-label={t('ariaLabel')}
      >
        <Card
          variant="ghost"
          className="border-border/50 bg-card/50 group-hover:border-border/80 group-hover:bg-card flex items-center gap-2.5 rounded-lg border p-2.5 transition-all duration-200"
        >
          <span className="bg-background border-border/50 group-hover:border-border/80 flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-md border transition-colors duration-200">
            <span className="text-muted-foreground group-hover:text-foreground transition-colors duration-200">
              <GitHubIcon />
            </span>
          </span>

          <span className="flex min-w-0 flex-1 flex-col gap-0.5 text-center">
            <span className="text-foreground/80 group-hover:text-foreground truncate text-[11.5px] leading-tight font-semibold">
              {t('tocTitle')}
            </span>
            <span className="text-muted-foreground/60 text-[10px] leading-tight">
              {t('tocSubtitle')}
            </span>
          </span>

          <span className="bg-background border-border/50 group-hover:border-border flex shrink-0 items-center gap-1 rounded-md border px-2 py-1 transition-colors duration-200">
            <HugeiconsIcon
              icon={StarIcon}
              size={11}
              className="-rotate-12 fill-amber-500 text-amber-500 transition-all duration-300 group-hover:scale-125"
            />
            <span className="text-muted-foreground group-hover:text-foreground text-[10px] font-medium transition-colors duration-200">
              Star
            </span>
          </span>
        </Card>
      </a>
    </div>
  );
}

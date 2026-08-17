import { GitHubIcon } from '@/components/common/github-icon';
import { GITHUB_REPO_URL } from '@/lib/domains';
import { StarIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { Card } from '@repo/ui/components/card';
import { useTranslations } from 'next-intl';

export function GitHubStarTocCta() {
  const t = useTranslations('components.githubStar');
  return (
    <div className="border-border/40 mt-6 border-t pt-5">
      <a
        href={GITHUB_REPO_URL}
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

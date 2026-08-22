'use client';

import { AiPerch } from '@/features/chat/ui/ai-perch';
import { GitHubIcon } from '@/components/common/github-icon';
import { GITHUB_ISSUES_URL } from '@/lib/domains';
import { buttonVariants } from '@repo/ui/components/button';
import { Card } from '@repo/ui/components/card';
import { Typography } from '@repo/ui/components/typography';
import { Stack } from '@repo/ui/layout/stack';
import { cn } from '@repo/ui/lib/cn';
import { useTranslations } from 'next-intl';

type IssueCtaProps = {
  pageTitle: string;
  pageUrl: string;
};

export function IssueCta({ pageTitle, pageUrl }: IssueCtaProps) {
  const t = useTranslations('components.issueCta');

  const githubIssueUrl = `${GITHUB_ISSUES_URL}?title=${encodeURIComponent(
    `Docs: Feedback on "${pageTitle}"`,
  )}&body=${encodeURIComponent(
    `Feedback for page: [${pageTitle}](${pageUrl})\n\n### Describe the issue or suggestion\n\n`,
  )}`;

  return (
    <Card className="border-border/40 bg-card/10 relative mt-12 mb-6 p-5">
      <AiPerch className="ai-edge-perch" />
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Stack gap="2">
          <Typography
            variant="h6"
            className="text-foreground text-md m-0 font-medium tracking-tight"
          >
            {t('question')}
          </Typography>
          <Typography variant="muted" className="m-0 max-w-xl text-xs">
            {t('description')}
          </Typography>
        </Stack>
        <a
          href={githubIssueUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            buttonVariants({ variant: 'outline', size: 'sm' }),
            'border-border/50 hover:bg-accent/40 text-foreground shrink-0 gap-2 rounded-lg text-xs font-medium transition-colors',
          )}
        >
          <GitHubIcon />
          <span>{t('button')}</span>
        </a>
      </div>
    </Card>
  );
}

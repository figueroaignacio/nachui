'use client';

import { GitHubIcon } from '@/components/common/github-icon';
import { GITHUB_REPO_URL } from '@/lib/domains';
import { buttonVariants } from '@repo/ui/components/button';
import { cn } from '@repo/ui/lib/cn';

export function GitHubLink() {
  return (
    <a
      href={GITHUB_REPO_URL}
      target="_blank"
      rel="noreferrer"
      title="GitHub"
      aria-label="NachUI on GitHub"
      className={cn(
        buttonVariants({ variant: 'ghost', size: 'icon' }),
        'text-muted-foreground hover:text-foreground size-8',
      )}
    >
      <GitHubIcon size={16} />
    </a>
  );
}

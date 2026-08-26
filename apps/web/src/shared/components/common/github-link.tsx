import { GitHubIcon } from '@/components/common/github-icon';
import { GITHUB_REPO_URL } from '@/lib/domains';

export function GitHubLink() {
  return (
    <a
      href={GITHUB_REPO_URL}
      target="_blank"
      rel="noreferrer"
      title="GitHub"
      aria-label="NachUI on GitHub"
      className="text-muted-foreground hover:text-foreground focus-visible:ring-ring flex items-center justify-center rounded-md p-2 transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
    >
      <GitHubIcon size={16} />
    </a>
  );
}

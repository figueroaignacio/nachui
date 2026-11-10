import Link from 'next/link';
import type { ProjectSummary } from '@/lib/types';

export function relativeTime(iso: string, now = Date.now()): string {
  const seconds = Math.round((now - new Date(iso).getTime()) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
  const days = Math.round(hours / 24);
  if (days === 1) return 'yesterday';
  if (days < 7) return `${days} days ago`;
  return new Date(iso).toLocaleDateString([], { month: 'short', day: 'numeric' });
}

export function ProjectCard({ project }: { project: ProjectSummary }) {
  return (
    <Link
      href={`/p/${project.id}`}
      className="border-border bg-card hover:border-border-interactive focus-visible:ring-ring group flex flex-col overflow-hidden rounded-2xl border transition-colors focus-visible:ring-2 focus-visible:outline-none"
    >
      <div
        aria-hidden="true"
        className="bg-surface-muted border-border flex h-32 flex-col gap-2 border-b p-4"
      >
        <span className="bg-input h-2.5 w-2/5 rounded" />
        <span className="grid grid-cols-3 gap-1.5">
          <span className="bg-card border-border h-9 rounded-lg border" />
          <span className="bg-card border-border h-9 rounded-lg border" />
          <span className="bg-card border-border h-9 rounded-lg border" />
        </span>
        <span className="bg-card border-border flex-1 rounded-lg border" />
      </div>
      <div className="flex items-center gap-2 px-3.5 py-3">
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="truncate text-sm font-medium">{project.name}</span>
          <span className="text-muted-foreground text-xs">
            {project.version > 0 ? `v${project.version} · ` : ''}
            {relativeTime(project.updatedAt)}
          </span>
        </div>
        {project.lastError ? (
          <span className="text-destructive-text font-mono text-[11px]" title={project.lastError}>
            error
          </span>
        ) : project.pullRequestUrl ? (
          <span className="text-success-text font-mono text-[11px]" title="Pull request opened">
            PR
          </span>
        ) : null}
      </div>
    </Link>
  );
}

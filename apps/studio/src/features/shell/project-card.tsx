import Link from 'next/link';
import { TemplateThumb } from '@/features/home/templates';
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

const THUMBS = ['dashboard', 'pricing', 'settings', 'auth'] as const;

function thumbFor(id: string) {
  let hash = 0;
  for (const char of id) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return THUMBS[hash % THUMBS.length] ?? 'dashboard';
}

function pullNumber(url: string): string | null {
  return url.match(/\/pull\/(\d+)/)?.[1] ?? null;
}

export function ProjectCard({ project }: { project: ProjectSummary }) {
  const pr = project.pullRequestUrl ? pullNumber(project.pullRequestUrl) : null;
  return (
    <Link
      href={`/p/${project.id}`}
      className="group border-border bg-card hover:border-border-interactive focus-visible:ring-ring flex h-full flex-col overflow-hidden rounded-xl border transition-[border-color,translate] duration-300 ease-[cubic-bezier(.34,1.56,.64,1)] hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:outline-none motion-reduce:transition-none motion-reduce:hover:translate-y-0"
    >
      <span aria-hidden="true" className="bg-surface-muted block aspect-[16/10] px-4 pt-4">
        <span className="border-border bg-background block size-full origin-bottom overflow-hidden rounded-t-lg border border-b-0 transition-transform duration-500 ease-[cubic-bezier(.34,1.3,.64,1)] group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100">
          <TemplateThumb kind={thumbFor(project.id)} />
        </span>
      </span>
      <span className="border-border flex flex-col gap-1.5 border-t px-4 py-3">
        <span className="flex items-center gap-2">
          <span className="min-w-0 flex-1 truncate text-sm font-medium">{project.name}</span>
          {project.version > 0 ? (
            <span className="text-muted-foreground font-mono text-xs">v{project.version}</span>
          ) : null}
        </span>
        <span className="text-muted-foreground flex items-center gap-2 text-xs">
          {project.lastError ? (
            <span
              className="border-destructive-border text-destructive-text rounded-full border px-2 py-0.5"
              title={project.lastError}
            >
              Preview error
            </span>
          ) : pr ? (
            <span className="border-success-border text-success-text rounded-full border px-2 py-0.5">
              PR #{pr}
            </span>
          ) : null}
          Edited {relativeTime(project.updatedAt)}
        </span>
      </span>
    </Link>
  );
}

import type { ProjectSummary } from '@/lib/types';

export type ProjectGroup = { label: string; projects: ProjectSummary[] };

const DAY = 24 * 60 * 60 * 1000;

function startOfDay(time: number): number {
  const date = new Date(time);
  date.setHours(0, 0, 0, 0);
  return date.getTime();
}

/** Splits projects, newest first, into the date buckets the sidebar shows. */
export function groupProjects(projects: ProjectSummary[], now = Date.now()): ProjectGroup[] {
  const today = startOfDay(now);
  const buckets: ProjectGroup[] = [
    { label: 'Today', projects: [] },
    { label: 'Yesterday', projects: [] },
    { label: 'Previous 7 days', projects: [] },
    { label: 'Older', projects: [] },
  ];
  const sorted = [...projects].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  );
  for (const project of sorted) {
    const time = new Date(project.updatedAt).getTime();
    const index = time >= today ? 0 : time >= today - DAY ? 1 : time >= today - 7 * DAY ? 2 : 3;
    buckets[index]?.projects.push(project);
  }
  return buckets.filter((bucket) => bucket.projects.length > 0);
}

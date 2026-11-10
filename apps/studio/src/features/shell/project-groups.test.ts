import { describe, expect, it } from 'vitest';
import type { ProjectSummary } from '@/lib/types';
import { groupProjects } from './project-groups';

const NOW = new Date('2026-11-10T15:00:00').getTime();

function project(id: string, updatedAt: string): ProjectSummary {
  return { id, name: id, version: 1, lastError: null, pullRequestUrl: null, updatedAt };
}

describe('groupProjects', () => {
  it('buckets by day, newest first, and drops empty groups', () => {
    const groups = groupProjects(
      [
        project('old', '2026-10-01T10:00:00'),
        project('morning', '2026-11-10T08:00:00'),
        project('noon', '2026-11-10T12:00:00'),
        project('yesterday', '2026-11-09T23:30:00'),
      ],
      NOW,
    );

    expect(groups.map((group) => group.label)).toEqual(['Today', 'Yesterday', 'Older']);
    expect(groups[0]?.projects.map((p) => p.id)).toEqual(['noon', 'morning']);
  });

  it('puts the last week in its own group', () => {
    const groups = groupProjects([project('week', '2026-11-05T09:00:00')], NOW);
    expect(groups).toEqual([{ label: 'Previous 7 days', projects: [expect.any(Object)] }]);
  });
});

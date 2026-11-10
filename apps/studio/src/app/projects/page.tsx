'use client';

import { Button } from '@repo/ui/components/button';
import { Empty } from '@repo/ui/components/empty';
import { Input } from '@repo/ui/components/input';
import { Skeleton } from '@repo/ui/components/skeleton';
import { FolderIcon } from '@repo/ui/icons/folder';
import { PlusIcon } from '@repo/ui/icons/plus';
import { SearchIcon } from '@repo/ui/icons/search';
import { useRouter } from 'next/navigation';
import * as React from 'react';
import { AppHeader } from '@/features/shell/app-header';
import { PageSkeleton } from '@/features/shell/page-skeleton';
import { ProjectCard } from '@/features/shell/project-card';
import { SessionProvider } from '@/features/shell/session';
import { studioApi } from '@/lib/api';
import type { ProjectSummary } from '@/lib/types';

function Projects() {
  const router = useRouter();
  const [projects, setProjects] = React.useState<ProjectSummary[] | null>(null);
  const [failed, setFailed] = React.useState(false);
  const [query, setQuery] = React.useState('');

  React.useEffect(() => {
    studioApi.projects().then(setProjects, () => setFailed(true));
  }, []);

  const visible = React.useMemo(() => {
    const value = query.trim().toLowerCase();
    return (projects ?? []).filter((project) => project.name.toLowerCase().includes(value));
  }, [projects, query]);

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-10 sm:px-8">
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="font-heading flex-1 text-3xl font-bold tracking-tight">Projects</h1>
        <Input
          type="search"
          aria-label="Search projects"
          placeholder="Search projects"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          leftIcon={<SearchIcon size={14} />}
          className="w-full sm:w-64"
        />
        <Button onClick={() => router.push('/')} leftIcon={<PlusIcon size={14} />}>
          New project
        </Button>
      </div>

      {failed ? (
        <p role="alert" className="text-destructive-text text-sm">
          Could not load your projects. Refresh to try again.
        </p>
      ) : projects === null ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-busy="true">
          {Array.from({ length: 4 }, (_, index) => (
            <Skeleton key={index} className="h-48 rounded-2xl" />
          ))}
        </div>
      ) : projects.length === 0 ? (
        <Empty className="mx-auto mt-10 max-w-md">
          <Empty.Header>
            <Empty.Media variant="icon">
              <FolderIcon size={24} />
            </Empty.Media>
            <Empty.Title>No projects yet</Empty.Title>
            <Empty.Description>
              Describe a screen and it lands here, with every version.
            </Empty.Description>
          </Empty.Header>
          <Empty.Content>
            <Button size="sm" onClick={() => router.push('/')}>
              Start one
            </Button>
          </Empty.Content>
        </Empty>
      ) : visible.length === 0 ? (
        <p className="text-muted-foreground text-sm">Nothing matches “{query}”.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {visible.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </main>
  );
}

export default function ProjectsPage() {
  return (
    <SessionProvider fallback={<PageSkeleton />}>
      <div className="flex min-h-dvh flex-col">
        <AppHeader />
        <Projects />
      </div>
    </SessionProvider>
  );
}

'use client';

import { Button, buttonVariants } from '@repo/ui/components/button';
import { Empty } from '@repo/ui/components/empty';
import { Input } from '@repo/ui/components/input';
import { Skeleton } from '@repo/ui/components/skeleton';
import { ToggleGroup } from '@repo/ui/components/toggle-group';
import { FolderIcon } from '@repo/ui/icons/folder';
import { PlusIcon } from '@repo/ui/icons/plus';
import { SearchIcon } from '@repo/ui/icons/search';
import { motion } from 'motion/react';
import Link from 'next/link';
import * as React from 'react';
import { AppShell, MobileBar } from '@/features/shell/app-shell';
import { useEntrance } from '@/features/shell/motion';
import { ProjectCard } from '@/features/shell/project-card';
import { useProjects } from '@/features/shell/projects-store';
import type { ProjectSummary } from '@/lib/types';

type Filter = 'all' | 'pr' | 'broken';

const FILTERS: Record<Filter, (project: ProjectSummary) => boolean> = {
  all: () => true,
  pr: (project) => project.pullRequestUrl !== null,
  broken: (project) => project.lastError !== null,
};

function summary(projects: ProjectSummary[]): string {
  const screens = `${projects.length} ${projects.length === 1 ? 'screen' : 'screens'}`;
  const prs = projects.filter(FILTERS.pr).length;
  if (prs === 0) return `${screens} built with NachUI.`;
  return `${screens} built with NachUI. ${prs} sent as ${prs === 1 ? 'a pull request' : 'pull requests'}.`;
}

function Projects() {
  const { projects, failed } = useProjects();
  const entrance = useEntrance();
  const [query, setQuery] = React.useState('');
  const [filter, setFilter] = React.useState<Filter>('all');
  const searchRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (new URLSearchParams(window.location.search).has('search')) searchRef.current?.focus();
  }, []);

  const visible = React.useMemo(() => {
    const value = query.trim().toLowerCase();
    return (projects ?? [])
      .filter(FILTERS[filter])
      .filter((project) => project.name.toLowerCase().includes(value));
  }, [filter, projects, query]);

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-7 px-4 py-8 sm:px-8 sm:py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-1.5">
          <h1 className="font-heading text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-strong text-sm">
            {projects && projects.length > 0
              ? summary(projects)
              : 'Every screen you build lands here.'}
          </p>
        </div>
        <Link href="/" className={buttonVariants({ size: 'sm' })}>
          <PlusIcon size={14} />
          New project
        </Link>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Input
          ref={searchRef}
          type="search"
          aria-label="Search projects"
          placeholder="Search projects"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          leftIcon={<SearchIcon size={14} />}
          className="w-full sm:w-72"
        />
        <ToggleGroup
          type="single"
          required
          size="sm"
          value={filter}
          onValueChange={(value) => setFilter((value || 'all') as Filter)}
          aria-label="Show"
        >
          <ToggleGroup.Item value="all">All</ToggleGroup.Item>
          <ToggleGroup.Item value="pr">Pull requests</ToggleGroup.Item>
          <ToggleGroup.Item value="broken">Needs a fix</ToggleGroup.Item>
        </ToggleGroup>
      </div>

      {failed ? (
        <p role="alert" className="text-destructive-text text-sm">
          Could not load your projects. Refresh to try again.
        </p>
      ) : projects === null ? (
        <div
          className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-5"
          aria-busy="true"
          aria-label="Loading projects"
        >
          {Array.from({ length: 4 }, (_, index) => (
            <Skeleton key={index} className="h-60 rounded-xl" />
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
            <Link href="/" className={buttonVariants({ size: 'sm' })}>
              Start one
            </Link>
          </Empty.Content>
        </Empty>
      ) : visible.length === 0 ? (
        <div className="text-muted-foreground flex flex-col items-start gap-3 text-sm">
          <p>Nothing matches{query.trim() ? ` “${query.trim()}”` : ' this filter'}.</p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setQuery('');
              setFilter('all');
            }}
          >
            Show everything
          </Button>
        </div>
      ) : (
        <motion.ul
          key={filter}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-5"
        >
          {visible.map((project, index) => (
            <motion.li key={project.id} variants={entrance} custom={index}>
              <ProjectCard project={project} />
            </motion.li>
          ))}
          <motion.li variants={entrance} custom={visible.length}>
            <Link
              href="/"
              className="border-border text-muted-strong hover:border-border-interactive hover:text-foreground focus-visible:ring-ring flex h-full min-h-56 flex-col items-center justify-center gap-3 rounded-xl border border-dashed text-sm transition-colors focus-visible:ring-2 focus-visible:outline-none"
            >
              <span className="border-border grid size-11 place-items-center rounded-full border">
                <PlusIcon size={18} />
              </span>
              Describe a new screen
            </Link>
          </motion.li>
        </motion.ul>
      )}
    </main>
  );
}

export default function ProjectsPage() {
  return (
    <AppShell>
      <MobileBar title="Projects" />
      <Projects />
    </AppShell>
  );
}

'use client';

import { use } from 'react';
import { AppShell } from '@/features/shell/app-shell';
import { ProjectWorkspace } from '@/features/workspace/project-workspace';

export default function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return (
    <AppShell sidebarOpen={false} fixed>
      <ProjectWorkspace id={id} />
    </AppShell>
  );
}

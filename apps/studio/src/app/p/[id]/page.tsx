'use client';

import { use } from 'react';
import { PageSkeleton } from '@/features/shell/page-skeleton';
import { SessionProvider } from '@/features/shell/session';
import { ProjectWorkspace } from '@/features/workspace/project-workspace';

export default function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return (
    <SessionProvider fallback={<PageSkeleton />}>
      <ProjectWorkspace id={id} />
    </SessionProvider>
  );
}

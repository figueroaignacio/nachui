'use client';

import * as React from 'react';
import { studioApi } from '@/lib/api';
import type { ProjectSummary } from '@/lib/types';

type ProjectsValue = {
  projects: ProjectSummary[] | null;
  failed: boolean;
  refresh: () => void;
  liveId: string | null;
  setLiveId: (id: string | null) => void;
};

const ProjectsContext = React.createContext<ProjectsValue | null>(null);

export function useProjects(): ProjectsValue {
  const value = React.use(ProjectsContext);
  if (!value) throw new Error('useProjects must be used within ProjectsProvider');
  return value;
}

/** The signed in user's projects, shared by the sidebar, the home page and the projects page. */
export function ProjectsProvider({ children }: { children: React.ReactNode }) {
  const [projects, setProjects] = React.useState<ProjectSummary[] | null>(null);
  const [failed, setFailed] = React.useState(false);
  const [liveId, setLiveId] = React.useState<string | null>(null);

  const refresh = React.useCallback(() => {
    studioApi.projects().then(
      (list) => {
        setProjects(list);
        setFailed(false);
      },
      () => setFailed(true),
    );
  }, []);

  React.useEffect(() => {
    refresh();
  }, [refresh]);

  const value = React.useMemo(
    () => ({ projects, failed, refresh, liveId, setLiveId }),
    [projects, failed, refresh, liveId],
  );

  return <ProjectsContext value={value}>{children}</ProjectsContext>;
}

'use client';

import * as React from 'react';
import { ApiError, studioApi } from '@/lib/api';
import type { Project } from '@/lib/types';

export function useProject(id: string) {
  const [project, setProject] = React.useState<Project | null>(null);
  const [error, setError] = React.useState<'not-found' | 'failed' | null>(null);

  const reload = React.useCallback(async () => {
    try {
      const next = await studioApi.project(id);
      setProject(next);
      setError(null);
      return next;
    } catch (reason) {
      setError(reason instanceof ApiError && reason.status === 404 ? 'not-found' : 'failed');
      return null;
    }
  }, [id]);

  React.useEffect(() => {
    let active = true;
    studioApi.project(id).then(
      (next) => {
        if (!active) return;
        setProject(next);
        setError(null);
      },
      (reason: unknown) => {
        if (!active) return;
        setError(reason instanceof ApiError && reason.status === 404 ? 'not-found' : 'failed');
      },
    );
    return () => {
      active = false;
    };
  }, [id]);

  return { project, setProject, error, reload };
}

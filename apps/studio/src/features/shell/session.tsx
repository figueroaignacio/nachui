'use client';

import { usePathname, useRouter } from 'next/navigation';
import * as React from 'react';
import { ApiError, studioApi } from '@/lib/api';
import type { StudioUser, Usage } from '@/lib/types';

type SessionValue = {
  user: StudioUser;
  usage: Usage | null;
  refreshUsage: () => void;
  refreshUser: () => void;
  signOut: () => Promise<void>;
};

const SessionContext = React.createContext<SessionValue | null>(null);

export function useSession(): SessionValue {
  const value = React.use(SessionContext);
  if (!value) throw new Error('useSession must be used within SessionProvider');
  return value;
}

export function useOptionalSession(): SessionValue | null {
  return React.use(SessionContext);
}

type State =
  | { status: 'loading' }
  | { status: 'ready'; user: StudioUser }
  | { status: 'error'; message: string };

/** Loads the signed in user, or sends the browser to /login and back here after. */
export function SessionProvider({
  children,
  fallback,
}: {
  children: React.ReactNode;
  fallback: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [state, setState] = React.useState<State>({ status: 'loading' });
  const [usage, setUsage] = React.useState<Usage | null>(null);

  const loadUser = React.useCallback(() => {
    studioApi.me().then(
      (user) => setState({ status: 'ready', user }),
      (error: unknown) => {
        if (error instanceof ApiError && error.status === 401) {
          router.replace(`/login?next=${encodeURIComponent(pathname)}`);
          return;
        }
        setState({
          status: 'error',
          message:
            error instanceof ApiError && error.status === 503
              ? 'The Studio is not set up on this server yet.'
              : 'Could not reach the Studio API. Check that it is running.',
        });
      },
    );
  }, [pathname, router]);

  const refreshUsage = React.useCallback(() => {
    studioApi.usage().then(setUsage, () => undefined);
  }, []);

  React.useEffect(() => {
    loadUser();
    refreshUsage();
  }, [loadUser, refreshUsage]);

  const signOut = React.useCallback(async () => {
    await studioApi.logout().catch(() => undefined);
    router.replace('/login');
  }, [router]);

  if (state.status === 'loading') return <>{fallback}</>;
  if (state.status === 'error') {
    return (
      <div className="flex min-h-dvh items-center justify-center p-6">
        <p role="alert" className="text-muted-foreground max-w-sm text-center text-sm">
          {state.message}
        </p>
      </div>
    );
  }

  return (
    <SessionContext
      value={{ user: state.user, usage, refreshUsage, refreshUser: loadUser, signOut }}
    >
      {children}
    </SessionContext>
  );
}

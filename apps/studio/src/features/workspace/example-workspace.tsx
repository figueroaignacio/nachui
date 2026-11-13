'use client';

import * as React from 'react';
import { GithubMark } from '@/features/shell/github-mark';
import { pill } from '@/features/shell/pill';
import { signInUrl } from '@/lib/api';
import { ChatThread } from './chat-thread';
import { EXAMPLE_PROJECT } from './example-data';
import { ExportDialog } from './export-dialog';
import { ExportButton, WorkspaceHeader } from './workspace-header';
import { WorkspaceLayout } from './workspace-layout';

/** A finished project anyone can open without signing in, to see what the Studio makes. */
export function ExampleWorkspace() {
  const [exportOpen, setExportOpen] = React.useState(false);
  const project = EXAMPLE_PROJECT;

  return (
    <div className="h-dvh">
      <WorkspaceLayout
        files={project.files}
        busy={false}
        actions={<ExportButton onClick={() => setExportOpen(true)} />}
        header={(end) => (
          <WorkspaceHeader
            name={project.name}
            version={project.version}
            versions={project.versions}
            sidebar={false}
            end={
              end ?? (
                <a href={signInUrl('/')} className={pill({ variant: 'outline', size: 'sm' })}>
                  <GithubMark size={14} />
                  Sign in
                </a>
              )
            }
          />
        )}
        chat={
          <>
            <ChatThread
              messages={project.messages}
              versions={project.versions}
              currentVersion={project.version}
              running={false}
              waiting={false}
            />
            <div className="border-border bg-surface-muted m-3 mt-0 flex flex-col gap-3 rounded-xl border p-4">
              <p className="text-muted-strong text-sm">
                This is an example project. Sign in with GitHub to describe your own screens.
              </p>
              <a href={signInUrl('/')} className={pill({ size: 'sm' })}>
                <GithubMark size={14} />
                Continue with GitHub
              </a>
            </div>
          </>
        }
      />
      <ExportDialog
        projectId={project.id}
        projectName={project.name}
        version={project.version}
        files={project.files}
        hasRepoAccess={false}
        signedIn={false}
        broken={null}
        open={exportOpen}
        onOpenChange={setExportOpen}
      />
    </div>
  );
}

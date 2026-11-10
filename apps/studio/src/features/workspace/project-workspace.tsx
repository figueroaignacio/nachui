'use client';

import { useChat } from '@ai-sdk/react';
import { buttonVariants } from '@repo/ui/components/button';
import { Callout } from '@repo/ui/components/callout';
import { Skeleton } from '@repo/ui/components/skeleton';
import { DefaultChatTransport, type UIMessage } from 'ai';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import * as React from 'react';
import { AccountMenu } from '@/features/shell/app-header';
import { clearPendingPrompt, readPendingPrompt } from '@/features/shell/pending-prompt';
import { useSession } from '@/features/shell/session';
import { chatUrl, studioApi } from '@/lib/api';
import type { Project, StudioModel } from '@/lib/types';
import { readChatError } from './chat-error';
import { ChatThread } from './chat-thread';
import { Composer } from './composer';
import { ExportDialog } from './export-dialog';
import { liveFiles } from './live-files';
import { useProject } from './use-project';
import { WorkspaceHeader } from './workspace-header';
import { WorkspaceLayout } from './workspace-layout';

function Loaded({ project, reload }: { project: Project; reload: () => Promise<Project | null> }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, usage, refreshUsage } = useSession();
  const [pending] = React.useState(() =>
    project.messages.length === 0 ? readPendingPrompt(project.id) : null,
  );
  const [model, setModel] = React.useState<StudioModel>(pending?.model ?? 'flash');
  const [name, setName] = React.useState(project.name);
  const [exportOpen, setExportOpen] = React.useState(searchParams.get('export') === 'pr');
  const started = React.useRef(false);

  const transport = React.useMemo(
    () =>
      new DefaultChatTransport({
        api: chatUrl(project.id),
        credentials: 'include',
        prepareSendMessagesRequest: ({ messages, body }) => ({
          body: {
            message: messages.at(-1),
            model: (body as { model?: StudioModel } | undefined)?.model,
          },
        }),
      }),
    [project.id],
  );

  const { messages, sendMessage, status, stop, error, clearError } = useChat<UIMessage>({
    id: project.id,
    messages: project.messages,
    transport,
    onFinish: () => {
      void reload();
      refreshUsage();
    },
    onError: () => {
      void reload();
      refreshUsage();
    },
  });

  const send = React.useCallback(
    (text: string, chosen: StudioModel = model) => {
      clearError();
      void sendMessage({ text }, { body: { model: chosen } });
    },
    [clearError, model, sendMessage],
  );

  React.useEffect(() => {
    if (started.current || !pending) return;
    started.current = true;
    clearPendingPrompt(project.id);
    send(pending.text, pending.model);
  }, [pending, project.id, send]);

  const failure = readChatError(error);
  React.useEffect(() => {
    if (failure?.kind === 'auth') router.replace(`/login?next=/p/${project.id}`);
  }, [failure?.kind, project.id, router]);

  const running = status === 'submitted' || status === 'streaming';
  const files = React.useMemo(
    () => (running ? liveFiles(project.files, messages.at(-1)) : project.files),
    [messages, project.files, running],
  );
  const outOfGenerations = usage !== null && usage.used >= usage.limit;

  const restore = async (version: number) => {
    await studioApi.restore(project.id, version);
    await reload();
  };

  return (
    <>
      <WorkspaceLayout
        files={files}
        busy={running}
        onFix={
          running || outOfGenerations
            ? undefined
            : (report) => send(`The preview fails with this error. Fix it.\n\n${report}`)
        }
        header={
          <WorkspaceHeader
            name={name}
            version={project.version}
            versions={project.versions}
            onRename={async (next) => {
              setName(next);
              await studioApi.rename(project.id, next).catch(() => setName(project.name));
            }}
            onRestore={running ? undefined : (version) => void restore(version)}
            onExport={() => setExportOpen(true)}
            exportDisabled={project.version === 0}
            end={<AccountMenu />}
          />
        }
        chat={
          <>
            <ChatThread
              messages={messages}
              versions={project.versions}
              currentVersion={project.version}
              running={running}
              waiting={status === 'submitted'}
              onRestore={(version) => void restore(version)}
              footer={
                failure && failure.kind !== 'auth' ? (
                  <Callout variant={failure.kind === 'limit' ? 'warning' : 'danger'} role="alert">
                    <Callout.Content>{failure.message}</Callout.Content>
                  </Callout>
                ) : project.lastError && !running ? (
                  <Callout variant="warning">
                    <Callout.Title>This version has an error</Callout.Title>
                    <Callout.Content>
                      <span className="font-mono text-xs">{project.lastError}</span>
                    </Callout.Content>
                  </Callout>
                ) : null
              }
            />
            <div className="p-3 pt-0">
              <Composer
                status={status === 'error' ? 'error' : status}
                model={model}
                onModelChange={setModel}
                onSend={(text) => send(text)}
                onStop={() => void stop()}
                disabled={outOfGenerations}
                placeholder={
                  project.version === 0 && messages.length === 0
                    ? 'Describe the screen'
                    : 'Ask for a change'
                }
              />
            </div>
          </>
        }
      />
      <ExportDialog
        projectId={project.id}
        projectName={name}
        version={project.version}
        files={project.files}
        hasRepoAccess={user.hasRepoAccess}
        broken={project.lastError}
        open={exportOpen}
        onOpenChange={setExportOpen}
        defaultTab={searchParams.get('export') === 'pr' ? 'pr' : 'cli'}
      />
    </>
  );
}

export function ProjectWorkspace({ id }: { id: string }) {
  const { project, error, reload } = useProject(id);

  if (error === 'not-found') {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-4 p-6 text-center">
        <p className="text-muted-strong text-sm">This project does not exist or is not yours.</p>
        <Link href="/projects" className={buttonVariants({ variant: 'outline', size: 'sm' })}>
          Back to projects
        </Link>
      </div>
    );
  }

  if (error === 'failed' && !project) {
    return (
      <div className="flex min-h-dvh items-center justify-center p-6">
        <p role="alert" className="text-muted-foreground text-sm">
          Could not load the project. Refresh to try again.
        </p>
      </div>
    );
  }

  if (!project) {
    return (
      <div aria-busy="true" aria-label="Loading project" className="flex h-dvh flex-col">
        <div className="border-border flex h-13 items-center gap-3 border-b px-4">
          <Skeleton className="size-6.5 rounded-md" />
          <Skeleton className="h-4 w-40" />
        </div>
        <div className="grid flex-1 lg:grid-cols-[440px_1fr]">
          <div className="border-border flex flex-col gap-3 border-e p-4">
            <Skeleton className="ms-auto h-10 w-3/4 rounded-2xl" />
            <Skeleton className="h-28 rounded-lg" />
          </div>
          <Skeleton className="m-5 hidden rounded-xl lg:block" />
        </div>
      </div>
    );
  }

  return <Loaded project={project} reload={reload} />;
}

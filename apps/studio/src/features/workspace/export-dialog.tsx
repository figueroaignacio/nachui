'use client';

import { CodeBlock } from '@repo/ui/ai/code-block';
import { Button, buttonVariants } from '@repo/ui/components/button';
import { Dialog } from '@repo/ui/components/dialog';
import { Input } from '@repo/ui/components/input';
import { Label } from '@repo/ui/components/label';
import { Select } from '@repo/ui/components/select';
import { Tabs } from '@repo/ui/components/tabs';
import { DownloadIcon } from '@repo/ui/icons/download';
import * as React from 'react';
import { GithubMark } from '@/features/shell/github-mark';
import { ApiError, connectReposUrl, studioApi } from '@/lib/api';
import type { ProjectFiles, Repo } from '@/lib/types';
import { installCommand } from './install-command';

type PullRequestState =
  | { status: 'idle' }
  | { status: 'sending' }
  | { status: 'done'; url: string; skipped: string[] }
  | { status: 'error'; message: string };

function PullRequestTab({
  projectId,
  hasRepoAccess,
  broken,
}: {
  projectId: string;
  hasRepoAccess: boolean;
  broken: string | null;
}) {
  const [repos, setRepos] = React.useState<Repo[] | null>(null);
  const [needsAccess, setNeedsAccess] = React.useState(!hasRepoAccess);
  const [repo, setRepo] = React.useState('');
  const [base, setBase] = React.useState('');
  const [baseDir, setBaseDir] = React.useState('src');
  const [state, setState] = React.useState<PullRequestState>({ status: 'idle' });

  React.useEffect(() => {
    if (!hasRepoAccess) return;
    studioApi.repos().then(
      (list) => {
        setRepos(list);
        const first = list[0];
        if (first) {
          setRepo(first.fullName);
          setBase(first.defaultBranch);
        }
      },
      (error: unknown) => {
        if (error instanceof ApiError && error.code === 'repo_access') setNeedsAccess(true);
        else setRepos([]);
      },
    );
  }, [hasRepoAccess]);

  if (needsAccess) {
    return (
      <div className="flex flex-col items-start gap-3 py-2">
        <p className="text-muted-strong text-sm leading-relaxed">
          To open a pull request, the Studio needs access to your repositories. GitHub asks once,
          and you can revoke it from Settings.
        </p>
        <a
          href={connectReposUrl(`/p/${projectId}?export=pr`)}
          className={buttonVariants({ variant: 'outline' })}
        >
          <GithubMark size={16} />
          Connect GitHub
        </a>
      </div>
    );
  }

  if (state.status === 'done') {
    return (
      <div className="flex flex-col gap-3 py-2">
        <p className="text-sm">The pull request is open.</p>
        <a href={state.url} target="_blank" rel="noreferrer" className={buttonVariants()}>
          Open on GitHub
        </a>
        {state.skipped.length > 0 ? (
          <p className="text-muted-foreground text-xs leading-relaxed">
            Left as they are, because the repo already has them: {state.skipped.join(', ')}.
          </p>
        ) : null}
      </div>
    );
  }

  const selectedRepo = repos?.find((item) => item.fullName === repo);

  return (
    <form
      className="flex flex-col gap-4 py-1"
      onSubmit={async (event) => {
        event.preventDefault();
        setState({ status: 'sending' });
        try {
          const result = await studioApi.pullRequest(projectId, { repo, base, baseDir });
          setState({ status: 'done', url: result.url, skipped: result.skipped });
        } catch (error) {
          if (error instanceof ApiError && error.code === 'repo_access') setNeedsAccess(true);
          setState({
            status: 'error',
            message: error instanceof Error ? error.message : 'The export failed.',
          });
        }
      }}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="export-repo">Repository</Label>
          <Select
            value={repo}
            onValueChange={(value) => {
              setRepo(value);
              const match = repos?.find((item) => item.fullName === value);
              if (match) setBase(match.defaultBranch);
            }}
            disabled={!repos || repos.length === 0}
          >
            <Select.Trigger id="export-repo" placeholder={repos ? 'No repositories' : 'Loading…'} />
            <Select.Content>
              {(repos ?? []).map((item) => (
                <Select.Item key={item.fullName} value={item.fullName}>
                  {item.fullName}
                </Select.Item>
              ))}
            </Select.Content>
          </Select>
        </div>
        <Input
          id="export-base"
          label="Into branch"
          value={base}
          onChange={(event) => setBase(event.target.value)}
          placeholder={selectedRepo?.defaultBranch ?? 'main'}
          className="font-mono"
        />
      </div>
      <Input
        id="export-dir"
        label="Source folder"
        description="Where components/, lib/ and screens/ go. Use the same folder the NachUI CLI uses."
        value={baseDir}
        onChange={(event) => setBaseDir(event.target.value)}
        className="font-mono"
      />
      {broken ? (
        <p role="alert" className="text-destructive-text text-sm">
          This version has an error, so it cannot be exported yet: {broken}
        </p>
      ) : null}
      {state.status === 'error' ? (
        <p role="alert" className="text-destructive-text text-sm">
          {state.message}
        </p>
      ) : null}
      <div className="flex justify-end">
        <Button
          type="submit"
          loading={state.status === 'sending'}
          disabled={!repo || !base || Boolean(broken)}
        >
          <GithubMark size={15} />
          Open pull request
        </Button>
      </div>
    </form>
  );
}

function downloadFile(path: string, content: string) {
  const url = URL.createObjectURL(new Blob([content], { type: 'text/plain' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = path.split('/').pop() ?? 'screen.tsx';
  link.click();
  URL.revokeObjectURL(url);
}

export function ExportDialog({
  projectId,
  projectName,
  version,
  files,
  hasRepoAccess,
  broken,
  open,
  onOpenChange,
  defaultTab = 'cli',
  signedIn = true,
}: {
  projectId: string;
  projectName: string;
  version: number;
  files: ProjectFiles;
  hasRepoAccess: boolean;
  broken: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultTab?: 'cli' | 'files' | 'pr';
  signedIn?: boolean;
}) {
  const command = installCommand(files);
  const paths = Object.keys(files).sort();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <Dialog.Content className="max-w-xl">
        <Dialog.Header>
          <Dialog.Title>Export {projectName}</Dialog.Title>
          <Dialog.Description>
            Version {version} · {paths.length} {paths.length === 1 ? 'file' : 'files'} of yours
          </Dialog.Description>
        </Dialog.Header>
        <Tabs defaultValue={defaultTab} size="sm" className="min-w-0">
          <Tabs.List className="w-full">
            <Tabs.Trigger value="cli">CLI</Tabs.Trigger>
            <Tabs.Trigger value="files">Files</Tabs.Trigger>
            <Tabs.Trigger value="pr">Pull request</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="cli" className="flex flex-col gap-3 pt-3">
            <p className="text-muted-strong text-sm">
              1. Add the NachUI components it uses to your project.
            </p>
            {command ? (
              <CodeBlock code={command} language="bash">
                <CodeBlock.CopyButton copyLabel="Copy command" />
                <CodeBlock.Content label="Install command" className="pe-12" />
              </CodeBlock>
            ) : (
              <p className="text-muted-foreground text-sm">
                It does not use any NachUI component yet.
              </p>
            )}
            <p className="text-muted-strong text-sm">
              2. Copy the screen into{' '}
              <code className="bg-muted rounded px-1 font-mono text-xs">src/screens/</code>, from
              the Files tab.
            </p>
          </Tabs.Content>
          <Tabs.Content value="files" className="flex flex-col gap-2 pt-3">
            {paths.map((path) => (
              <div
                key={path}
                className="border-border flex items-center gap-2 rounded-lg border px-3 py-2"
              >
                <span className="min-w-0 flex-1 truncate font-mono text-xs">{path}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8"
                  aria-label={`Download ${path}`}
                  onClick={() => downloadFile(path, files[path] ?? '')}
                >
                  <DownloadIcon size={15} />
                </Button>
              </div>
            ))}
          </Tabs.Content>
          <Tabs.Content value="pr" className="pt-3">
            {signedIn ? (
              <PullRequestTab projectId={projectId} hasRepoAccess={hasRepoAccess} broken={broken} />
            ) : (
              <p className="text-muted-strong py-2 text-sm leading-relaxed">
                Sign in with GitHub to send your own screens to a repository as a pull request.
              </p>
            )}
          </Tabs.Content>
        </Tabs>
      </Dialog.Content>
    </Dialog>
  );
}

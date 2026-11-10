'use client';

import { PromptInput } from '@repo/ui/ai/prompt-input';
import { Suggestion } from '@repo/ui/ai/suggestion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import * as React from 'react';
import { AppHeader } from '@/features/shell/app-header';
import { ModelPicker } from '@/features/shell/model-picker';
import { PageSkeleton } from '@/features/shell/page-skeleton';
import { savePendingPrompt } from '@/features/shell/pending-prompt';
import { ProjectCard } from '@/features/shell/project-card';
import { SessionProvider, useSession } from '@/features/shell/session';
import { studioApi } from '@/lib/api';
import type { ProjectSummary, StudioModel } from '@/lib/types';

const IDEAS = [
  'A billing page with the current plan, seats and invoices',
  'An onboarding checklist for a new workspace',
  'A team members table with roles and invites',
  'A pricing page with three plans and a FAQ',
  'A dashboard for an agent run with steps and logs',
];

function Home() {
  const router = useRouter();
  const { usage } = useSession();
  const [text, setText] = React.useState('');
  const [model, setModel] = React.useState<StudioModel>('flash');
  const [creating, setCreating] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [recent, setRecent] = React.useState<ProjectSummary[] | null>(null);
  const outOfGenerations = usage !== null && usage.used >= usage.limit;

  React.useEffect(() => {
    studioApi.projects().then(
      (projects) => setRecent(projects.slice(0, 3)),
      () => setRecent([]),
    );
  }, []);

  const start = async (prompt: string) => {
    const value = prompt.trim();
    if (!value || creating) return false;
    setCreating(true);
    setError(null);
    try {
      const project = await studioApi.createProject(value);
      savePendingPrompt(project.id, { text: value, model });
      router.push(`/p/${project.id}`);
      return true;
    } catch {
      setError('Could not create the project. Try again.');
      setCreating(false);
      return false;
    }
  };

  return (
    <main className="flex flex-1 flex-col items-center gap-14 px-4 pt-20 pb-16 sm:pt-28">
      <div className="flex w-full max-w-2xl flex-col gap-5">
        <h1 className="font-heading text-center text-3xl font-bold tracking-tight text-balance sm:text-4xl">
          What do you want to build?
        </h1>
        <PromptInput
          value={text}
          onValueChange={setText}
          onSubmit={(message) => start(message.text)}
          status={creating ? 'submitted' : 'ready'}
          disabled={outOfGenerations}
          className="shadow-md"
        >
          <PromptInput.Body>
            <PromptInput.Textarea
              aria-label="Describe the screen"
              placeholder="A billing page with the current plan, usage this month and a table of invoices"
              className="min-h-20 text-base"
            />
          </PromptInput.Body>
          <PromptInput.Footer>
            <PromptInput.Tools>
              <ModelPicker value={model} onValueChange={setModel} />
            </PromptInput.Tools>
            <PromptInput.Submit />
          </PromptInput.Footer>
        </PromptInput>
        {outOfGenerations ? (
          <p role="status" className="text-muted-foreground text-center text-sm">
            You used all {usage?.limit} generations for today. They reset at midnight UTC.
          </p>
        ) : null}
        {error ? (
          <p role="alert" className="text-destructive-text text-center text-sm">
            {error}
          </p>
        ) : null}
        <Suggestion.Group className="justify-center">
          {IDEAS.map((idea) => (
            <Suggestion key={idea} suggestion={idea} onClick={(value) => setText(value)} />
          ))}
        </Suggestion.Group>
      </div>

      {recent && recent.length > 0 ? (
        <section aria-labelledby="recent" className="flex w-full max-w-4xl flex-col gap-3.5">
          <div className="flex items-center justify-between">
            <h2
              id="recent"
              className="text-muted-foreground font-mono text-xs font-medium tracking-wider uppercase"
            >
              Recent
            </h2>
            <Link href="/projects" className="text-muted-strong hover:text-foreground text-sm">
              All projects
            </Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {recent.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}

export default function HomePage() {
  return (
    <SessionProvider fallback={<PageSkeleton />}>
      <div className="flex min-h-dvh flex-col">
        <AppHeader />
        <Home />
      </div>
    </SessionProvider>
  );
}

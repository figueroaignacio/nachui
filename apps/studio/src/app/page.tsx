'use client';

import { PromptInput } from '@repo/ui/ai/prompt-input';
import { Suggestion } from '@repo/ui/ai/suggestion';
import { ArrowUpRightIcon } from '@repo/ui/icons/arrow-up-right';
import { motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import * as React from 'react';
import { TEMPLATES, TemplateThumb } from '@/features/home/templates';
import { useTypedPlaceholder } from '@/features/home/use-typed-placeholder';
import { AppShell, MobileBar } from '@/features/shell/app-shell';
import { ModelPicker } from '@/features/shell/model-picker';
import { useEntrance } from '@/features/shell/motion';
import { savePendingPrompt } from '@/features/shell/pending-prompt';
import { useSession } from '@/features/shell/session';
import { studioApi } from '@/lib/api';
import type { StudioModel } from '@/lib/types';

const IDEAS = [
  'A billing page with the current plan, seats and invoices',
  'An inbox with filters and a reading pane',
  'An onboarding checklist for a new workspace',
  'A team members table with roles and invites',
] as const;

const SUGGESTIONS = ['Billing page', 'Kanban board', 'Chat with sources', 'Team members'] as const;

function Home() {
  const router = useRouter();
  const { usage } = useSession();
  const entrance = useEntrance();
  const [text, setText] = React.useState('');
  const [model, setModel] = React.useState<StudioModel>('flash');
  const [creating, setCreating] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const outOfGenerations = usage !== null && usage.used >= usage.limit;
  const left = usage ? Math.max(usage.limit - usage.used, 0) : null;
  const placeholder = useTypedPlaceholder(IDEAS, text.length > 0);
  const composerRef = React.useRef<HTMLDivElement>(null);

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

  const fill = (prompt: string) => {
    setText(prompt);
    const composer = composerRef.current;
    composer?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    composer?.querySelector('textarea')?.focus({ preventScroll: true });
  };

  return (
    <>
      <MobileBar title="New project" />
      <main className="flex flex-1 flex-col items-center [background-image:radial-gradient(ellipse_60%_40%_at_50%_0%,var(--color-surface-muted),transparent_70%)] px-4 pt-[12vh] pb-20">
        <motion.div
          initial="hidden"
          animate="visible"
          className="flex w-full max-w-2xl flex-col items-center gap-6"
        >
          <motion.a
            variants={entrance}
            custom={0}
            href="https://nachui.tech/docs"
            className="border-border bg-card text-muted-strong hover:text-foreground focus-visible:ring-ring inline-flex h-7 items-center gap-2 rounded-full border ps-1 pe-3 text-xs transition-colors focus-visible:ring-2 focus-visible:outline-none"
          >
            <span className="bg-primary text-primary-foreground rounded-full px-2 py-0.5 font-medium">
              New
            </span>
            Plan, Terminal and Stack Trace are in NachUI
          </motion.a>
          <motion.h1
            variants={entrance}
            custom={1}
            className="font-heading text-center text-4xl leading-[1.05] font-bold tracking-tight text-balance sm:text-5xl"
          >
            What should we build?
          </motion.h1>
          <motion.p
            variants={entrance}
            custom={2}
            className="text-muted-strong -mt-2 max-w-md text-center text-base leading-relaxed"
          >
            Describe a screen. Studio builds it with NachUI, checks every import and hands you code
            you own.
          </motion.p>

          <motion.div
            ref={composerRef}
            variants={entrance}
            custom={3}
            className="relative w-full rounded-xl"
          >
            <span aria-hidden="true" className="studio-orbit" />
            <PromptInput
              value={text}
              onValueChange={setText}
              onSubmit={(message) => start(message.text)}
              status={creating ? 'submitted' : 'ready'}
              disabled={outOfGenerations}
              className="bg-card relative shadow-lg"
            >
              <PromptInput.Body>
                <PromptInput.Textarea
                  aria-label="Describe the screen"
                  placeholder={placeholder}
                  className="min-h-24 text-base"
                />
              </PromptInput.Body>
              <PromptInput.Footer>
                <PromptInput.Tools>
                  <ModelPicker value={model} onValueChange={setModel} />
                </PromptInput.Tools>
                <span className="flex items-center gap-3">
                  {left !== null ? (
                    <span className="text-muted-foreground hidden font-mono text-xs sm:inline">
                      {left} left today
                    </span>
                  ) : null}
                  <PromptInput.Submit />
                </span>
              </PromptInput.Footer>
            </PromptInput>
          </motion.div>

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

          <motion.div variants={entrance} custom={4} className="w-full">
            <Suggestion.Group className="justify-center">
              {SUGGESTIONS.map((label, index) => (
                <Suggestion
                  key={label}
                  suggestion={label}
                  onClick={() => fill(IDEAS[index] ?? label)}
                />
              ))}
            </Suggestion.Group>
          </motion.div>
        </motion.div>

        <section aria-labelledby="templates" className="mt-[12vh] w-full max-w-5xl">
          <div className="mb-4 flex items-baseline justify-between">
            <h2 id="templates" className="font-heading text-lg font-semibold">
              Start from a screen
            </h2>
            <span className="text-muted-foreground text-xs">
              Fills the prompt, nothing runs yet
            </span>
          </div>
          <motion.ul
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            className="grid grid-cols-[repeat(auto-fill,minmax(210px,1fr))] gap-5"
          >
            {TEMPLATES.map((template, index) => (
              <motion.li key={template.title} variants={entrance} custom={index}>
                <button
                  type="button"
                  onClick={() => fill(template.prompt)}
                  className="group focus-visible:ring-ring flex w-full flex-col gap-2.5 rounded-xl text-start focus-visible:ring-2 focus-visible:ring-offset-4 focus-visible:outline-none"
                >
                  <span
                    aria-hidden="true"
                    className="border-border bg-card group-hover:border-border-interactive block aspect-[16/10] overflow-hidden rounded-xl border transition-[border-color,translate,scale] duration-300 ease-[cubic-bezier(.34,1.56,.64,1)] group-hover:-translate-y-1 group-hover:scale-[1.015] motion-reduce:transition-none motion-reduce:group-hover:translate-y-0 motion-reduce:group-hover:scale-100"
                  >
                    <TemplateThumb kind={template.kind} />
                  </span>
                  <span className="flex items-center gap-1.5 text-sm font-medium">
                    {template.title}
                    <ArrowUpRightIcon
                      size={14}
                      className="text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
                    />
                  </span>
                </button>
              </motion.li>
            ))}
          </motion.ul>
        </section>
      </main>
    </>
  );
}

export default function HomePage() {
  return (
    <AppShell>
      <Home />
    </AppShell>
  );
}

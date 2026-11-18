'use client';

import { ThemeToggle } from '@/components/common/theme-toggle';
import { useChatStore } from '@/features/chat/store/chat-store';
import { CheckIcon } from '@repo/ui/icons/check';
import { CodeIcon } from '@repo/ui/icons/code';
import { ChevronDownIcon } from '@repo/ui/icons/chevron-down';
import { RefreshIcon } from '@repo/ui/icons/refresh';
import { SparklesIcon } from '@repo/ui/icons/sparkles';
import { cn } from '@repo/ui/lib/cn';
import { useTranslations } from 'next-intl';
import * as React from 'react';
import { createPortal } from 'react-dom';

type StageMode = 'code' | 'stage';

interface StageContextValue {
  activeKey: string;
  defaultKey: string;
  mode: StageMode;
  activate: (key: string) => void;
  demoOutlet: HTMLElement | null;
  codeOutlet: HTMLElement | null;
}

const StageContext = React.createContext<StageContextValue | null>(null);

/** Null outside a component page, where previews keep drawing inline. */
export function useDemoStage() {
  return React.useContext(StageContext);
}

const toolButton =
  'text-muted-foreground hover:text-foreground hover:bg-muted aria-pressed:bg-secondary aria-pressed:text-foreground focus-visible:ring-ring inline-flex h-8 min-w-8 items-center justify-center gap-1.5 rounded-full px-2 text-[13px] font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none';

interface DemoStageProps {
  title: string;
  /** Absolute URL of the page, handed to the assistant when asked to explain it. */
  url: string;
  /** `component/demo` of the demo the server already drew on the stage. */
  defaultKey: string;
  defaultDemo: React.ReactNode;
  /** Anchor of the installation section in the doc, when the page has one. */
  installHref?: string;
  /** The documentation column: the page header and its MDX body. */
  children: React.ReactNode;
}

/**
 * A component page as a workbench. One demo runs on a stage that takes the whole
 * of the first screen, with the doc under it; every other demo is a row in
 * the doc that sends itself to the stage. The toolbar opens the code of
 * whatever is on the stage next to it and jumps down to the doc.
 */
export function DemoStage({
  title,
  url,
  defaultKey,
  defaultDemo,
  installHref,
  children,
}: DemoStageProps) {
  const t = useTranslations('docs.stage');
  const tActions = useTranslations('components.explainButton');
  const triggerExplanation = useChatStore((state) => state.triggerExplanation);
  const [activeKey, setActiveKey] = React.useState(defaultKey);
  const [mode, setMode] = React.useState<StageMode>('stage');
  const [run, setRun] = React.useState(0);
  const [demoOutlet, setDemoOutlet] = React.useState<HTMLElement | null>(null);
  const [codeOutlet, setCodeOutlet] = React.useState<HTMLElement | null>(null);
  const stageRef = React.useRef<HTMLElement>(null);

  const activate = React.useCallback(
    (key: string) => {
      setActiveKey((current) => (current === key ? defaultKey : key));
      setRun((current) => current + 1);
      const stage = stageRef.current;
      if (!stage) return;
      const { top, bottom } = stage.getBoundingClientRect();
      if (top < 0 || bottom > window.innerHeight) {
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        stage.scrollIntoView({ behavior: reduce ? 'instant' : 'smooth', block: 'start' });
      }
    },
    [defaultKey],
  );

  const value = React.useMemo(
    () => ({ activeKey, defaultKey, mode, activate, demoOutlet, codeOutlet }),
    [activeKey, defaultKey, mode, activate, demoOutlet, codeOutlet],
  );
  const onDefault = activeKey === defaultKey;

  return (
    <StageContext value={value}>
      <div
        data-stage-shell
        data-stage-mode={mode}
        className={cn('grid min-w-0 gap-2.5', mode === 'code' && 'xl:grid-cols-2')}
      >
        <section
          ref={stageRef}
          aria-label={t('label', { title })}
          className="bg-island relative flex h-[min(34rem,72svh)] scroll-mt-(--site-header-height) flex-col rounded-lg lg:h-[calc(100svh-1.25rem)]"
        >
          <div className="flex justify-end p-3">
            <div
              role="toolbar"
              aria-label={t('toolbar')}
              className="bg-popover border-border flex shrink-0 items-center gap-0.5 rounded-full border p-1 shadow-md"
            >
              {installHref && (
                <a href={installHref} className={cn(toolButton, 'text-foreground px-3')}>
                  {t('install')}
                </a>
              )}
              <button
                type="button"
                onClick={() => triggerExplanation(title, tActions('prompt', { page: title, url }))}
                className={cn(toolButton, 'px-3')}
              >
                <SparklesIcon size={14} aria-hidden="true" />
                <span className="max-sm:sr-only">{tActions('label')}</span>
              </button>
              <a href="#stage-doc" aria-label={t('doc')} title={t('doc')} className={toolButton}>
                <ChevronDownIcon size={15} aria-hidden="true" />
              </a>
              <button
                type="button"
                aria-label={t('code')}
                title={t('code')}
                aria-pressed={mode === 'code'}
                onClick={() => setMode((current) => (current === 'code' ? 'stage' : 'code'))}
                className={toolButton}
              >
                <CodeIcon size={15} aria-hidden="true" />
              </button>
              <ThemeToggle />
            </div>
          </div>

          <div
            data-no-select
            className="flex min-h-0 flex-1 items-center justify-center overflow-auto p-6 *:min-w-0 sm:p-10"
          >
            <div key={run} className="contents">
              <div className={cn('contents', !onDefault && 'hidden')}>{defaultDemo}</div>
              <div ref={setDemoOutlet} className="contents" />
            </div>
          </div>
          <div className="bg-popover border-border absolute start-1/2 bottom-4 -translate-x-1/2 rounded-full border p-1 shadow-md rtl:translate-x-1/2">
            <button
              type="button"
              onClick={() => setRun((current) => current + 1)}
              className={cn(toolButton, 'bg-secondary text-foreground gap-2 px-3.5')}
            >
              <RefreshIcon size={15} aria-hidden="true" />
              {t('replay')}
            </button>
          </div>
        </section>

        <section
          aria-label={t('code')}
          className={cn(
            'bg-code min-w-0 overflow-hidden rounded-lg xl:h-[calc(100svh-1.25rem)] xl:overflow-auto',
            mode !== 'code' && 'hidden',
          )}
        >
          <div ref={setCodeOutlet} className="**:max-h-none" />
        </section>

        <div
          id="stage-doc"
          className="mx-auto w-full max-w-3xl min-w-0 scroll-mt-(--site-header-height) pt-6 xl:col-span-full xl:pt-10"
        >
          {children}
        </div>
      </div>
    </StageContext>
  );
}

interface StageRowProps {
  /** `component/demo`, unique on the page. */
  demoKey: string;
  label: string;
  description?: string;
  demo: React.ReactNode;
  /** The highlighted source, collapsed, shown under the row. */
  code: React.ReactNode;
  /** The same source in full, for the code panel. */
  fullCode: React.ReactNode;
}

/**
 * One demo of the page, as the doc lists it: a button that puts it on the
 * stage, and its source. The demo itself is drawn on the stage, not here.
 * Pressing the row that is on stage hands the stage back to the main demo,
 * which the page opens with and so has no row of its own.
 */
export function StageRow({ demoKey, label, description, demo, code, fullCode }: StageRowProps) {
  const t = useTranslations('docs.stage');
  const stage = useDemoStage();
  if (!stage) return null;

  const active = stage.activeKey === demoKey;
  const drawnByServer = demoKey === stage.defaultKey;
  const inCodePanel = active && stage.mode === 'code';
  const codeInPanel =
    inCodePanel && stage.codeOutlet ? createPortal(fullCode, stage.codeOutlet) : null;

  if (drawnByServer) return codeInPanel;

  return (
    <div className="bg-island rounded-lg p-1.5">
      <button
        type="button"
        aria-pressed={active}
        onClick={() => stage.activate(demoKey)}
        className={cn(
          'focus-visible:ring-ring flex min-h-11 w-full items-center gap-3 rounded-md px-3 py-2 text-start text-sm transition-colors focus-visible:ring-2 focus-visible:outline-none',
          active ? 'bg-brand-soft text-brand-text' : 'hover:bg-muted text-foreground',
        )}
      >
        <span className="min-w-0 flex-1">
          <span className="block truncate font-medium">{label}</span>
          {description && (
            <span
              className={cn(
                'mt-0.5 block text-[13px] leading-snug',
                active ? 'text-brand-text' : 'text-muted-foreground',
              )}
            >
              {description}
            </span>
          )}
        </span>
        <span className="flex shrink-0 items-center gap-1.5 font-mono text-xs">
          {active && <CheckIcon size={13} aria-hidden="true" />}
          {active ? t('showing') : t('show')}
        </span>
      </button>
      <div className="bg-code mt-1.5 overflow-hidden rounded-md">
        {code}
        {codeInPanel}
      </div>
      {active && !drawnByServer && stage.demoOutlet && createPortal(demo, stage.demoOutlet)}
    </div>
  );
}

interface StagePreviewProps extends StageRowProps {
  /** What a page without a stage draws instead: the demo inline with its code. */
  fallback: React.ReactNode;
}

/** A doc preview that becomes a stage row on component pages. */
export function StagePreview({ fallback, ...row }: StagePreviewProps) {
  return useDemoStage() ? <StageRow {...row} /> : fallback;
}

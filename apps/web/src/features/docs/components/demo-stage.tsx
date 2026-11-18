'use client';

import { ThemeToggle } from '@/components/common/theme-toggle';
import { useChatStore } from '@/features/chat/store/chat-store';
import { CodeIcon } from '@repo/ui/icons/code';
import { ChevronDownIcon } from '@repo/ui/icons/chevron-down';
import { SparklesIcon } from '@repo/ui/icons/sparkles';
import { cn } from '@repo/ui/lib/cn';
import { useTranslations } from 'next-intl';
import * as React from 'react';
import { createPortal } from 'react-dom';

type StageMode = 'code' | 'stage';

interface StageContextValue {
  defaultKey: string;
  mode: StageMode;
  /** The row that hands the stage demo's source to the code panel. */
  codeOwner: string | null;
  claimCode: (id: string) => () => void;
  codeOutlet: HTMLElement | null;
}

const StageContext = React.createContext<StageContextValue | null>(null);

/** Null outside a component page, where previews keep drawing inline. */
export function useDemoStage() {
  return React.useContext(StageContext);
}

const toolButton =
  'text-muted-foreground hover:text-foreground hover:bg-muted aria-pressed:bg-secondary aria-pressed:text-foreground focus-visible:ring-ring inline-flex h-8 min-w-8 items-center justify-center gap-1.5 rounded-full px-2 text-[13px] font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none';

const PLAYBACK_EVENT = 'playback:play';

interface PlayButtonProps {
  /** Where to look for a demo that can play itself through its states. */
  container: HTMLElement | null;
  className?: string;
}

/**
 * Plays a demo from the start. It only shows up when the demo inside
 * `container` marks itself with `data-playback`, which the animated demos do
 * through `usePlayback`; everything else has nothing to play.
 */
function PlayButton({ container, className }: PlayButtonProps) {
  const t = useTranslations('docs.stage');
  const [target, setTarget] = React.useState<Element | null>(null);
  const [playing, setPlaying] = React.useState(false);

  React.useEffect(() => {
    if (!container) return;
    const sync = () => {
      const element = container.querySelector('[data-playback]');
      setTarget(element);
      setPlaying(element?.getAttribute('data-playback') === 'playing');
    };
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(container, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ['data-playback'],
    });
    return () => observer.disconnect();
  }, [container]);

  if (!target) return null;

  return (
    <div className={cn('bg-popover absolute z-10 rounded-full p-1 shadow-md', className)}>
      <button
        type="button"
        disabled={playing}
        onClick={() => target.dispatchEvent(new CustomEvent(PLAYBACK_EVENT))}
        className={cn(
          toolButton,
          'bg-secondary text-foreground cursor-pointer gap-2 px-3.5 transition-[color,background-color,transform] duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] active:scale-[0.94] disabled:cursor-default disabled:opacity-60',
        )}
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M7 4.5v15a1 1 0 0 0 1.5.86l12.5-7.5a1 1 0 0 0 0-1.72L8.5 3.64A1 1 0 0 0 7 4.5Z" />
        </svg>
        {playing ? t('playing') : t('play')}
      </button>
    </div>
  );
}

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
 * of the first screen, with the doc under it; every other demo is drawn in
 * the doc with its own code. The toolbar opens the code of the stage demo
 * next to it and jumps down to the doc.
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
  const [mode, setMode] = React.useState<StageMode>('stage');
  const [codeOutlet, setCodeOutlet] = React.useState<HTMLElement | null>(null);
  const [demoBox, setDemoBox] = React.useState<HTMLElement | null>(null);

  const [codeOwner, setCodeOwner] = React.useState<string | null>(null);

  const claimCode = React.useCallback((id: string) => {
    setCodeOwner((current) => current ?? id);
    return () => setCodeOwner((current) => (current === id ? null : current));
  }, []);

  const value = React.useMemo(
    () => ({ defaultKey, mode, codeOwner, claimCode, codeOutlet }),
    [defaultKey, mode, codeOwner, claimCode, codeOutlet],
  );

  return (
    <StageContext value={value}>
      <div
        data-stage-shell
        data-stage-mode={mode}
        className="grid min-w-0 gap-2.5 transition-[grid-template-columns] duration-300 ease-out motion-reduce:transition-none lg:grid-cols-[minmax(0,1fr)_0rem] lg:gap-x-0 lg:data-[stage-mode=code]:grid-cols-[minmax(0,1fr)_minmax(0,44%)] lg:data-[stage-mode=code]:gap-x-2.5"
      >
        <section
          aria-label={t('label', { title })}
          className="bg-island relative flex h-[min(34rem,72svh)] scroll-mt-(--site-header-height) flex-col rounded-lg lg:h-[calc(100svh-1.25rem)]"
        >
          <div className="relative z-20 flex justify-end p-3">
            <div
              role="toolbar"
              aria-label={t('toolbar')}
              className="bg-popover flex shrink-0 items-center gap-0.5 rounded-full p-1 shadow-md"
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
            ref={setDemoBox}
            data-no-select
            className="flex min-h-0 flex-1 items-center justify-center overflow-auto p-6 *:min-w-0 sm:p-10"
          >
            {defaultDemo}
          </div>
          <PlayButton
            container={demoBox}
            className="start-1/2 bottom-4 -translate-x-1/2 rtl:translate-x-1/2"
          />
        </section>

        <aside
          aria-label={t('code')}
          inert={mode !== 'code'}
          className={cn(
            'bg-code min-w-0 overflow-hidden rounded-lg lg:h-[calc(100svh-1.25rem)]',
            mode === 'code' ? 'max-lg:max-h-[70svh]' : 'max-lg:hidden lg:invisible',
          )}
        >
          <div ref={setCodeOutlet} className="h-full overflow-auto **:max-h-none" />
        </aside>

        <div
          id="stage-doc"
          className="mx-auto w-full max-w-3xl min-w-0 scroll-mt-(--site-header-height) pt-6 lg:col-span-full xl:pt-10"
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
  demo: React.ReactNode;
  /** The highlighted source, collapsed, shown under the demo. */
  code: React.ReactNode;
  /** The same source in full, for the code panel of the stage demo. */
  fullCode: React.ReactNode;
}

/**
 * One demo of the page, as the doc lists it: the demo, live, and its source
 * under it. The first row of the demo the stage opens with draws nothing: it
 * only hands its source to the code panel. A page that lists that demo again
 * further down gets it as a normal row.
 */
export function StageRow({ demoKey, demo, code, fullCode }: StageRowProps) {
  const stage = useDemoStage();
  const [demoBox, setDemoBox] = React.useState<HTMLElement | null>(null);
  const id = React.useId();
  const isDefault = stage ? demoKey === stage.defaultKey : false;
  const claimCode = stage?.claimCode;

  React.useEffect(() => {
    if (!isDefault || !claimCode) return;
    return claimCode(id);
  }, [isDefault, claimCode, id]);

  if (!stage) return null;

  if (isDefault && (stage.codeOwner === null || stage.codeOwner === id)) {
    return stage.mode === 'code' && stage.codeOutlet
      ? createPortal(fullCode, stage.codeOutlet)
      : null;
  }

  return (
    <div className="bg-island relative rounded-lg p-1.5">
      <div
        ref={setDemoBox}
        data-no-select
        className="flex min-h-44 items-center justify-center overflow-x-auto px-4 py-10 *:min-w-0 sm:px-8"
      >
        {demo}
      </div>
      <PlayButton container={demoBox} className="end-3 top-3" />
      {code ? <div className="bg-code overflow-hidden rounded-md">{code}</div> : null}
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

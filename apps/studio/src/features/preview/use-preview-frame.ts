'use client';

import * as React from 'react';
import { BundleError, bundleProject, pickEntry, type SourceFiles } from './bundle';
import { loadCatalogFile, loadPreviewCss } from './catalog-client';
import { previewDocument } from './runtime';

export type PreviewError = { name: string; message: string; stack?: string };

export type PreviewStatus = 'loading' | 'empty' | 'building' | 'rendered' | 'error';

function useDarkMode(): boolean {
  const [dark, setDark] = React.useState(false);
  React.useEffect(() => {
    const root = document.documentElement;
    const update = () => setDark(root.classList.contains('dark'));
    update();
    const observer = new MutationObserver(update);
    observer.observe(root, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);
  return dark;
}

/**
 * Drives the sandboxed preview: builds the document once, waits for the frame
 * to say it is ready, then sends a fresh bundle whenever the files change.
 */
export function usePreviewFrame(files: SourceFiles) {
  const frameRef = React.useRef<HTMLIFrameElement>(null);
  const dark = useDarkMode();
  const [srcDoc, setSrcDoc] = React.useState<string | null>(null);
  const [frameKey, setFrameKey] = React.useState(0);
  const [ready, setReady] = React.useState(false);
  const [status, setStatus] = React.useState<PreviewStatus>('loading');
  const [error, setError] = React.useState<PreviewError | null>(null);
  const initialDark = React.useRef(dark);

  React.useEffect(() => {
    let cancelled = false;
    void loadPreviewCss().then((css) => {
      if (!cancelled) setSrcDoc(previewDocument(css, initialDark.current));
    });
    return () => {
      cancelled = true;
    };
  }, []);

  React.useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.source !== frameRef.current?.contentWindow) return;
      const data = event.data as { type?: string } & Partial<PreviewError>;
      if (data.type === 'ready') setReady(true);
      if (data.type === 'rendered') setStatus('rendered');
      if (data.type === 'error') {
        setStatus('error');
        setError({ name: data.name ?? 'Error', message: data.message ?? '', stack: data.stack });
      }
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, []);

  React.useEffect(() => {
    if (ready) frameRef.current?.contentWindow?.postMessage({ type: 'theme', dark }, '*');
  }, [dark, ready]);

  const entry = React.useMemo(() => pickEntry(files), [files]);

  React.useEffect(() => {
    if (!ready || !entry) return;
    let cancelled = false;
    const timer = window.setTimeout(() => {
      setStatus('building');
      bundleProject(files, entry, loadCatalogFile).then(
        (bundle) => {
          if (cancelled) return;
          setError(null);
          frameRef.current?.contentWindow?.postMessage(
            { type: 'render', modules: bundle.modules, entry: bundle.entry, key: Date.now() },
            '*',
          );
        },
        (reason: unknown) => {
          if (cancelled) return;
          setStatus('error');
          if (reason instanceof BundleError) {
            setError({
              name: 'Build error',
              message: reason.message,
              stack: `Build error: ${reason.message}\n    at ${reason.path}:${reason.line ?? 1}:1`,
            });
          } else {
            setError({
              name: 'Error',
              message: reason instanceof Error ? reason.message : String(reason),
            });
          }
        },
      );
    }, 200);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [entry, files, ready, frameKey]);

  const reload = React.useCallback(() => {
    setReady(false);
    setError(null);
    setStatus('loading');
    setFrameKey((key) => key + 1);
  }, []);

  const dismissError = React.useCallback(() => setError(null), []);

  return {
    frameRef,
    srcDoc,
    frameKey,
    status: entry ? status : ('empty' as const),
    error,
    reload,
    dismissError,
  };
}

'use client';

import { useCallback, useState } from 'react';

/**
 * Writes text to the clipboard. Pass a promise when the text still has to be
 * fetched: Safari drops the click's user activation across an `await`, so a
 * pending value goes through a `ClipboardItem`, which accepts a promise.
 */
async function writeToClipboard(value: string | Promise<string>) {
  if (typeof value !== 'string' && typeof ClipboardItem !== 'undefined') {
    const blob = value.then((text) => new Blob([text], { type: 'text/plain' }));
    await navigator.clipboard.write([new ClipboardItem({ 'text/plain': blob })]);
    return;
  }
  await navigator.clipboard.writeText(await value);
}

export function useCopyToClipboard(timeout = 2000) {
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = useCallback(
    async (value: string | Promise<string>) => {
      try {
        await writeToClipboard(value);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), timeout);
      } catch (error) {
        console.error('Failed to copy text:', error);
      }
    },
    [timeout],
  );

  return { isCopied, copyToClipboard };
}

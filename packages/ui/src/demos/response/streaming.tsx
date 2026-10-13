'use client';

import { useEffect, useState } from 'react';
import { Response } from '../../ai/response';

const TEXT =
  'The caret sits after the last character and blinks until the stream closes. Before the first token arrives, the skeleton takes its place so the column never sits empty.';

export function Streaming() {
  const [count, setCount] = useState(0);
  const streaming = count < TEXT.length;

  useEffect(() => {
    if (!streaming) return;
    const timer = setTimeout(() => setCount((value) => value + 2), 30);
    return () => clearTimeout(timer);
  }, [count, streaming]);

  return (
    <div className="flex w-full max-w-lg flex-col gap-4">
      <button
        type="button"
        onClick={() => setCount(0)}
        className="border-border hover:bg-muted w-fit rounded-full border px-3 py-1.5 text-xs transition-colors"
      >
        Stream again
      </button>
      {count === 0 ? (
        <Response.Skeleton />
      ) : (
        <Response isStreaming={streaming}>
          <p>{TEXT.slice(0, count)}</p>
        </Response>
      )}
    </div>
  );
}

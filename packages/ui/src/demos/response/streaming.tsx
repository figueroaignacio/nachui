'use client';

import { useEffect, useState } from 'react';
import { Response } from '../../ai/response';

const TEXT =
  'The caret sits after the last character and blinks until the stream closes. Before the first token arrives, the skeleton takes its place so the column never sits empty.';

export function Streaming() {
  const [count, setCount] = useState(0);
  const [running, setRunning] = useState(true);

  useEffect(() => {
    if (!running) return;
    if (count >= TEXT.length) {
      setRunning(false);
      return;
    }
    const timer = setTimeout(() => setCount((value) => value + 2), 30);
    return () => clearTimeout(timer);
  }, [count, running]);

  const restart = () => {
    setCount(0);
    setRunning(true);
  };

  return (
    <div className="flex w-full max-w-lg flex-col gap-4">
      <button
        type="button"
        onClick={restart}
        className="border-border hover:bg-muted w-fit rounded-full border px-3 py-1.5 text-xs transition-colors"
      >
        Stream again
      </button>
      {count === 0 ? (
        <Response.Skeleton />
      ) : (
        <Response isStreaming={running}>
          <p>{TEXT.slice(0, count)}</p>
        </Response>
      )}
    </div>
  );
}

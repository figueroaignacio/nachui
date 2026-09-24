'use client';

import { useEffect, useRef, useState } from 'react';
import { Composer, type ComposerStatus } from '../../hybrids/composer';

export function Streaming() {
  const [status, setStatus] = useState<ComposerStatus>('ready');
  const [last, setLast] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  const stop = () => {
    if (timer.current) clearTimeout(timer.current);
    setStatus('ready');
  };

  return (
    <div className="flex w-full max-w-lg flex-col gap-3">
      <Composer
        status={status}
        onSend={(message) => {
          setLast(message.text);
          setStatus('streaming');
          timer.current = setTimeout(() => setStatus('ready'), 3000);
        }}
        onStop={stop}
        placeholder="Send something and watch the button…"
      />
      <p className="text-muted-foreground text-xs">
        {status === 'streaming'
          ? `Streaming an answer to “${last}”. Stop cuts it short.`
          : 'Ready. The send button turns into stop for three seconds after you send.'}
      </p>
    </div>
  );
}

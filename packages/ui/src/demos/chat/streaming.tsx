'use client';

import { useEffect, useRef, useState } from 'react';
import { Chat, type ChatMessage, type ChatStatus } from '../../hybrids/chat';

const REPLY =
  'Every element in this thread is one you can install on its own. The chat only decides the order they sit in, and hands each one the part of the message it knows how to draw.';

export function Streaming() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [status, setStatus] = useState<ChatStatus>('ready');
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const stop = () => {
    if (timer.current) clearInterval(timer.current);
    timer.current = null;
    setStatus('ready');
  };

  useEffect(() => stop, []);

  const send = ({ text }: { text: string }) => {
    const id = String(Date.now());
    setMessages((previous) => [
      ...previous,
      { id: `u-${id}`, role: 'user', parts: [{ type: 'text', text }] },
    ]);
    setStatus('submitted');

    const words = REPLY.split(' ');
    let count = 0;

    setTimeout(() => {
      setStatus('streaming');
      setMessages((previous) => [
        ...previous,
        { id: `a-${id}`, role: 'assistant', parts: [{ type: 'text', text: '' }] },
      ]);
      timer.current = setInterval(() => {
        count += 1;
        const text = words.slice(0, count).join(' ');
        setMessages((previous) =>
          previous.map((message) =>
            message.id === `a-${id}` ? { ...message, parts: [{ type: 'text', text }] } : message,
          ),
        );
        if (count >= words.length) stop();
      }, 60);
    }, 700);
  };

  return (
    <div className="border-border h-[26rem] w-full max-w-2xl overflow-hidden rounded-xl border">
      <Chat
        messages={messages}
        status={status}
        onSend={send}
        onStop={stop}
        suggestions={['What makes this a hybrid?', 'Send anything to see it stream']}
      />
    </div>
  );
}

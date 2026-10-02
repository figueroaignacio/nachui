'use client';

import { Suspense, useCallback, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { AnimatePresence } from 'motion/react';

import { useKbdShortcut } from '@/hooks/use-kbd-shortcut';

import { useTextSelection } from '../hooks/use-text-selection';
import { hasStoredChat } from '../lib/chat-storage';
import { ChatUrlSync } from '../store/chat-url-sync';
import { useChatStore } from '../store/chat-store';
import { SelectionPrompt } from '../ui/selection-prompt';

// The engine (AI SDK) and the window (markdown, syntax highlighting) are
// heavy, so they load on first use instead of with every page.
const ChatEngine = dynamic(() => import('../store/chat-engine').then((m) => m.ChatEngine), {
  ssr: false,
});
const ChatPanel = dynamic(() => import('./chat-panel').then((m) => m.ChatPanel), {
  ssr: false,
});

export function AiChat() {
  const isOpen = useChatStore((s) => s.isOpen);
  const isActivated = useChatStore((s) => s.isActivated);
  const activate = useChatStore((s) => s.activate);
  const setIsOpen = useChatStore((s) => s.setIsOpen);
  const attachSelection = useChatStore((s) => s.attachSelection);
  const [hasOpened, setHasOpened] = useState(false);

  if (isOpen && !hasOpened) setHasOpened(true);

  useEffect(() => {
    if (hasStoredChat()) activate();
  }, [activate]);

  const { selection, clear: clearSelection } = useTextSelection('[data-doc-prose]');

  const handleAddSelection = useCallback(() => {
    if (!selection) return;
    attachSelection(selection.text);
    clearSelection();
    window.getSelection()?.removeAllRanges();
  }, [selection, attachSelection, clearSelection]);

  useKbdShortcut(['mod', 'i'], () => {
    if (isOpen) return false;
    setIsOpen(true);
  });

  return (
    <div data-chat-open={isOpen ? 'true' : 'false'}>
      <Suspense fallback={null}>
        <ChatUrlSync />
      </Suspense>
      <AnimatePresence>
        {selection && <SelectionPrompt selection={selection} onAdd={handleAddSelection} />}
      </AnimatePresence>
      {isActivated && <ChatEngine />}
      {hasOpened && <ChatPanel />}
    </div>
  );
}

/*
  isLoading:   (-.-)  "thinking..."
  isStreaming: (°ロ°) "I AM BECOM—"
  isDone:      (¬‿¬) "as I was saying,"

  isError:     (._.)
               // TODO: handle gracefully
               // current handling: ¯\_(ツ)_/¯
*/

'use client';

import { Suspense, useEffect } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useChat } from '../hooks/use-chat';
import { useChatStore } from './chat-store';

function ChatUrlSync() {
  const searchParams = useSearchParams();
  const isOpen = useChatStore((s) => s.isOpen);
  const setIsOpen = useChatStore((s) => s.setIsOpen);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!searchParams) return;
    const chatParam = searchParams.get('chat');
    if (chatParam === 'open' && !isOpen) {
      setIsOpen(true);
    } else if (chatParam === 'closed' && isOpen) {
      setIsOpen(false);
    }
  }, [searchParams, isOpen, setIsOpen]);

  useEffect(() => {
    if (!searchParams) return;
    const chatParam = searchParams.get('chat');
    if (isOpen && chatParam === 'closed') {
      const params = new URLSearchParams(searchParams.toString());
      params.delete('chat');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      router.replace(`${pathname}?${params.toString()}` as any, { scroll: false });
    } else if (!isOpen && chatParam === 'open') {
      const params = new URLSearchParams(searchParams.toString());
      params.delete('chat');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      router.replace(`${pathname}?${params.toString()}` as any, { scroll: false });
    }
  }, [isOpen, searchParams, pathname, router]);

  return null;
}

export function ChatEngine() {
  const chatState = useChat();
  const sync = useChatStore((s) => s._sync);

  useEffect(() => {
    sync({
      messages: chatState.messages,
      isLoading: chatState.isLoading,
      isStreaming: chatState.isStreaming,
      activeTool: chatState.activeTool,
      errorCode: chatState.errorCode,
      messagesEndRef: chatState.messagesEndRef,
      sendMessage: chatState.sendMessage,
      handleSuggestionClick: chatState.handleSuggestionClick,
      stop: chatState.stop,
      retry: chatState.retry,
      resetChat: chatState.resetChat,
    });
  }, [
    chatState.messages,
    chatState.isLoading,
    chatState.isStreaming,
    chatState.activeTool,
    chatState.errorCode,
    chatState.messagesEndRef,
    chatState.sendMessage,
    chatState.handleSuggestionClick,
    chatState.stop,
    chatState.retry,
    chatState.resetChat,
    sync,
  ]);

  return (
    <Suspense fallback={null}>
      <ChatUrlSync />
    </Suspense>
  );
}

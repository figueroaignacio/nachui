'use client';

import { useEffect } from 'react';

import { useChat } from '../hooks/use-chat';
import { useChatStore } from './chat-store';

export function ChatEngine() {
  const chatState = useChat();
  const sync = useChatStore((s) => s._sync);
  const pendingMessage = useChatStore((s) => s.pendingMessage);
  const takePendingMessage = useChatStore((s) => s.takePendingMessage);
  const { isHydrated, sendMessage } = chatState;

  useEffect(() => {
    // Until persisted history is restored the store keeps its placeholder
    // actions, so anything sent meanwhile is queued instead of overwritten.
    if (!isHydrated) return;
    sync({
      messages: chatState.messages,
      isLoading: chatState.isLoading,
      isStreaming: chatState.isStreaming,
      activeTool: chatState.activeTool,
      errorCode: chatState.errorCode,
      sendMessage: chatState.sendMessage,
      handleSuggestionClick: chatState.handleSuggestionClick,
      stop: chatState.stop,
      retry: chatState.retry,
      resetChat: chatState.resetChat,
    });
  }, [
    isHydrated,
    chatState.messages,
    chatState.isLoading,
    chatState.isStreaming,
    chatState.activeTool,
    chatState.errorCode,
    chatState.sendMessage,
    chatState.handleSuggestionClick,
    chatState.stop,
    chatState.retry,
    chatState.resetChat,
    sync,
  ]);

  useEffect(() => {
    if (!isHydrated || !pendingMessage) return;
    const message = takePendingMessage();
    if (message) void sendMessage(message.content, message.quote);
  }, [isHydrated, pendingMessage, takePendingMessage, sendMessage]);

  return null;
}

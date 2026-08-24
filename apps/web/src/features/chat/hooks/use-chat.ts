'use client';

import type { Message } from '@/lib/definitions';
import { useChat as useAIChat } from '@ai-sdk/react';
import { useLocalStorage } from '@repo/ui/hooks/use-local-storage';
import type { UIMessage as AIMessage } from 'ai';
import { DefaultChatTransport, getToolName, isToolUIPart } from 'ai';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { classifyChatError } from '../lib/chat-error';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const transport = new DefaultChatTransport({
  api: `${API_URL}/api/v1/chat`,
});

export type ToolName = 'searchKnowledgeBase' | 'getComponentCode';

export function useChat() {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [storedMessages, setStoredMessages, resetStoredMessages, isMounted] = useLocalStorage<
    AIMessage[]
  >('nachui-chat-messages', []);
  const loadedRef = useRef(false);

  const {
    messages: uiMessages,
    setMessages,
    status,
    sendMessage: sendAIMessage,
    stop,
    error,
    regenerate,
    clearError,
  } = useAIChat({ transport });

  useEffect(() => {
    if (isMounted && !loadedRef.current) {
      loadedRef.current = true;
      if (storedMessages && storedMessages.length > 0) {
        setMessages(storedMessages);
      }
    }
  }, [isMounted, storedMessages, setMessages]);

  useEffect(() => {
    if (loadedRef.current) {
      setStoredMessages(uiMessages);
    }
  }, [uiMessages, setStoredMessages]);

  const resetChat = useCallback(() => {
    clearError();
    setMessages([]);
    resetStoredMessages();
  }, [clearError, setMessages, resetStoredMessages]);

  const retry = useCallback(() => {
    if (uiMessages.length === 0) return;
    clearError();
    void regenerate();
  }, [uiMessages.length, clearError, regenerate]);

  const messages: Message[] = useMemo(() => {
    return uiMessages
      .map((m) => {
        const meta = m.metadata as { quote?: string; question?: string } | undefined;

        const text = m.parts
          .filter((p) => p.type === 'text')
          .map((p) => p.text ?? '')
          .join('');

        return {
          id: m.id,
          role: m.role as Message['role'],
          content: meta?.question ?? text,
          quote: meta?.quote,
        };
      })
      .filter((m) => m.role !== 'assistant' || m.content.length > 0);
  }, [uiMessages]);

  const activeTool: ToolName | null = useMemo(() => {
    const last = uiMessages[uiMessages.length - 1];
    if (!last || last.role !== 'assistant') return null;

    for (const part of last.parts) {
      if (
        isToolUIPart(part) &&
        part.state !== 'output-available' &&
        part.state !== 'output-error'
      ) {
        return getToolName(part) as ToolName;
      }
    }
    return null;
  }, [uiMessages]);

  const isLoading = status === 'submitted' || status === 'streaming';
  const isStreaming = status === 'streaming';

  const errorCode = useMemo(() => classifyChatError(error), [error]);

  const sendMessage = useCallback(
    async (content: string, quote?: string) => {
      const question = content.trim();
      if (!question || isLoading) return;

      const excerpt = quote?.trim();
      if (!excerpt) {
        await sendAIMessage({ text: question });
        return;
      }

      await sendAIMessage({
        text: `<selection>\n${excerpt}\n</selection>\n\n${question}`,
        metadata: { quote: excerpt, question },
      });
    },
    [isLoading, sendAIMessage],
  );

  const handleSuggestionClick = useCallback(
    (text: string) => {
      sendMessage(text);
    },
    [sendMessage],
  );

  return {
    messages,
    isLoading,
    isStreaming,
    activeTool,
    messagesEndRef,
    sendMessage,
    handleSuggestionClick,
    stop,
    error,
    errorCode,
    retry,
    resetChat,
  };
}

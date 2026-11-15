'use client';

import type { Message } from '@/lib/definitions';
import { useChat as useAIChat } from '@ai-sdk/react';
import type { UIMessage as AIMessage } from 'ai';
import { DefaultChatTransport, getToolName, isToolUIPart } from 'ai';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { classifyChatError } from '../lib/chat-error';
import { collectSources, toChatSteps } from '../lib/chat-steps';
import { CHAT_STORAGE_KEY } from '../lib/chat-storage';
import { useLocalStorage } from './use-local-storage';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const transport = new DefaultChatTransport({
  api: `${API_URL}/api/v1/chat`,
});

export type ToolName = 'searchKnowledgeBase' | 'getComponentCode';

export function useChat() {
  const [storedMessages, setStoredMessages, resetStoredMessages, isMounted] = useLocalStorage<
    AIMessage[]
  >(CHAT_STORAGE_KEY, []);
  const loadedRef = useRef(false);
  const turnStartRef = useRef<number | null>(null);
  const [thoughtSeconds, setThoughtSeconds] = useState<Record<string, number>>({});
  const [wasStopped, setWasStopped] = useState(false);

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

  useEffect(() => {
    const startedAt = turnStartRef.current;
    const last = uiMessages[uiMessages.length - 1];
    if (startedAt === null || !last || last.role !== 'assistant') return;
    if (!last.parts.some((part) => part.type === 'text' && part.text.length > 0)) return;
    turnStartRef.current = null;
    const seconds = Math.max(1, Math.round((Date.now() - startedAt) / 1000));
    setThoughtSeconds((current) => ({ ...current, [last.id]: seconds }));
  }, [uiMessages]);

  const startTurn = useCallback(() => {
    turnStartRef.current = Date.now();
    setWasStopped(false);
  }, []);

  const resetChat = useCallback(() => {
    clearError();
    setMessages([]);
    resetStoredMessages();
    setThoughtSeconds({});
    setWasStopped(false);
  }, [clearError, setMessages, resetStoredMessages]);

  const retry = useCallback(() => {
    if (uiMessages.length === 0) return;
    clearError();
    startTurn();
    void regenerate();
  }, [uiMessages.length, clearError, regenerate, startTurn]);

  const stopTurn = useCallback(() => {
    setWasStopped(true);
    void stop();
  }, [stop]);

  const messages: Message[] = useMemo(() => {
    return uiMessages
      .map((m) => {
        const meta = m.metadata as { quote?: string; question?: string } | undefined;

        const text = m.parts
          .filter((p) => p.type === 'text')
          .map((p) => p.text ?? '')
          .join('');

        const steps = m.role === 'assistant' ? toChatSteps(m.parts) : [];

        return {
          id: m.id,
          role: m.role as Message['role'],
          content: meta?.question ?? text,
          quote: meta?.quote,
          steps,
          sources: collectSources(steps),
          thoughtSeconds: thoughtSeconds[m.id],
        };
      })
      .filter((m) => m.role !== 'assistant' || m.content.length > 0 || m.steps.length > 0);
  }, [uiMessages, thoughtSeconds]);

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

      startTurn();
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
    [isLoading, sendAIMessage, startTurn],
  );

  const handleSuggestionClick = useCallback(
    (text: string) => {
      sendMessage(text);
    },
    [sendMessage],
  );

  return {
    isHydrated: isMounted,
    messages,
    isLoading,
    isStreaming,
    activeTool,
    sendMessage,
    handleSuggestionClick,
    stop: stopTurn,
    wasStopped,
    error,
    errorCode,
    retry,
    resetChat,
  };
}

'use client';

import type { Message } from '@/lib/definitions';
import { useChat as useAIChat } from '@ai-sdk/react';
import { useLocalStorage } from '@repo/ui/hooks/use-local-storage';
import type { UIMessage as AIMessage } from 'ai';
import { DefaultChatTransport, getToolName, isToolUIPart } from 'ai';
import { useCallback, useEffect, useMemo, useRef } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const transport = new DefaultChatTransport({
  api: `${API_URL}/api/v1/chat`,
});

/** Tool names come from the agent definition in @repo/ai. */
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
    setMessages([]);
    resetStoredMessages();
  }, [setMessages, resetStoredMessages]);

  const messages: Message[] = useMemo(() => {
    return (
      uiMessages
        .map((m) => {
          const content = m.parts
            .filter((p) => p.type === 'text')
            .map((p) => p.text ?? '')
            .join('');

          return {
            id: m.id,
            role: m.role as Message['role'],
            content,
          };
        })
        // An assistant message with no text yet is the tool-execution phase of a
        // turn. Rendering it would show an empty bubble; the loading UI covers
        // that window instead.
        .filter((m) => m.role !== 'assistant' || m.content.length > 0)
    );
  }, [uiMessages]);

  /**
   * The tool currently running, if any. The UI stream delivers tool parts with
   * a lifecycle state; anything before `output-*` means the agent is still
   * executing it. Used to name the wait instead of a generic "Thinking...".
   */
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

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || isLoading) return;
      await sendAIMessage({ text: content.trim() });
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
    resetChat,
  };
}

'use client';

import { useCallback, useRef } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { useLockBodyScroll } from '@/hooks/use-lock-body-scroll';
import { useMediaQuery } from '@/hooks/use-media-query';

import { useChatStore } from '../store/chat-store';
import { ChatWindow } from '../widgets/chat-window';

export function ChatPanel() {
  const {
    isOpen,
    setIsOpen,
    messages,
    isLoading,
    isStreaming,
    activeTool,
    errorCode,
    sendMessage,
    handleSuggestionClick,
    retry,
    resetChat,
    stop,
    attachment,
    setAttachment,
  } = useChatStore(
    useShallow((s) => ({
      isOpen: s.isOpen,
      setIsOpen: s.setIsOpen,
      messages: s.messages,
      isLoading: s.isLoading,
      isStreaming: s.isStreaming,
      activeTool: s.activeTool,
      errorCode: s.errorCode,
      sendMessage: s.sendMessage,
      handleSuggestionClick: s.handleSuggestionClick,
      retry: s.retry,
      resetChat: s.resetChat,
      stop: s.stop,
      attachment: s.attachment,
      setAttachment: s.setAttachment,
    })),
  );

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const submit = useCallback(
    (text: string) => {
      const quote = attachment ?? undefined;
      setAttachment(null);
      if (!isOpen) setIsOpen(true);
      void sendMessage(text, quote);
    },
    [attachment, setAttachment, isOpen, setIsOpen, sendMessage],
  );

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);

  const isMobile = useMediaQuery('(max-width: 47.99rem)');
  useLockBodyScroll(isOpen && isMobile);

  return (
    <ChatWindow
      isOpen={isOpen}
      messages={messages}
      isLoading={isLoading}
      isStreaming={isStreaming}
      activeTool={activeTool}
      errorCode={errorCode}
      messagesEndRef={messagesEndRef}
      onSubmit={submit}
      onStop={stop}
      onClose={handleClose}
      onReset={resetChat}
      attachment={attachment}
      onRemoveAttachment={() => setAttachment(null)}
      onSuggestionClick={handleSuggestionClick}
      onRetry={retry}
      isModal={isMobile}
    />
  );
}

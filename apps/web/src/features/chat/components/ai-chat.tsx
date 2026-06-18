'use client';

import { useChatInput } from '@/features/chat/hooks/use-chat-input';
import { useLockBodyScroll } from '@/hooks/use-lock-body-scroll';
import { AnimatePresence } from 'motion/react';
import { useCallback, type RefObject } from 'react';
import { useChatStore } from '../store/chat-store';
import { ChatToggleButton } from './chat-toggle-button';
import { ChatWindow } from './chat-window';

export function AiChat() {
  const {
    isOpen,
    setIsOpen,
    isExpanded,
    toggleExpanded,
    messages,
    isLoading,
    isStreaming,
    error,
    messagesEndRef,
    sendMessage,
    handleSuggestionClick,
    resetChat,
  } = useChatStore();
  const { message, setMessage, handleSubmit, handleKeyPress } = useChatInput(sendMessage);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    if (isExpanded) toggleExpanded();
  }, [setIsOpen, isExpanded, toggleExpanded]);

  useLockBodyScroll(isOpen);

  const handleSuggestionClickWrapper = useCallback(
    (text: string) => {
      handleSuggestionClick(text);
      setMessage('');
    },
    [handleSuggestionClick, setMessage],
  );

  return (
    <>
      <div className="fixed right-6 bottom-6 z-500">
        <AnimatePresence>
          {!isOpen && !isExpanded && (
            <ChatToggleButton isOpen={isOpen} onClick={() => setIsOpen(true)} />
          )}
        </AnimatePresence>
      </div>
      <ChatWindow
        isOpen={isOpen}
        isExpanded={isExpanded}
        messages={messages}
        isLoading={isLoading}
        isStreaming={isStreaming}
        error={error}
        messagesEndRef={messagesEndRef as RefObject<HTMLDivElement>}
        message={message}
        onMessageChange={setMessage}
        onSubmit={handleSubmit}
        onKeyDown={handleKeyPress}
        onClose={handleClose}
        onReset={resetChat}
        onSuggestionClick={handleSuggestionClickWrapper}
        onToggleExpand={toggleExpanded}
      />
    </>
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

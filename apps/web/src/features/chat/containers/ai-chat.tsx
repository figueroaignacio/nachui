'use client';

import { useChatInput } from '@/features/chat/hooks/use-chat-input';
import { useLockBodyScroll } from '@/hooks/use-lock-body-scroll';
import { useMediaQuery } from '@/hooks/use-media-query';
import { AnimatePresence } from 'motion/react';
import { useCallback, type RefObject } from 'react';
import { useChatStore } from '../store/chat-store';
import { ChatToggleButton } from '../ui/chat-toggle-button';
import { ChatWindow } from '../widgets/chat-window';

export function AiChat() {
  const {
    isOpen,
    setIsOpen,
    isExpanded,
    toggleExpanded,
    messages,
    isLoading,
    isStreaming,
    activeTool,
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

  // Only the mobile panel covers the page; on desktop it docks beside the
  // content, which has to stay scrollable.
  const isMobile = useMediaQuery('(max-width: 47.99rem)');
  useLockBodyScroll(isOpen && isMobile);

  const handleSuggestionClickWrapper = useCallback(
    (text: string) => {
      handleSuggestionClick(text);
      setMessage('');
    },
    [handleSuggestionClick, setMessage],
  );

  return (
    <div data-chat-open={isOpen ? 'true' : 'false'}>
      {/* Sits on the frame gutter so it lines up with the content rails
          instead of floating at an arbitrary offset. */}
      <div className="fixed right-(--frame-bleed) bottom-6 z-500">
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
        activeTool={activeTool}
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

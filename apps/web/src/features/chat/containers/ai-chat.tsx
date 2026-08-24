'use client';

import { useChatInput } from '@/features/chat/hooks/use-chat-input';
import { useKbdShortcut } from '@/hooks/use-kbd-shortcut';
import { useLockBodyScroll } from '@/hooks/use-lock-body-scroll';
import { useMediaQuery } from '@/hooks/use-media-query';
import { AnimatePresence } from 'motion/react';
import { useCallback, useRef, type RefObject } from 'react';
import { useFooterInView } from '../hooks/use-footer-in-view';
import { useTextSelection } from '../hooks/use-text-selection';
import { useChatStore } from '../store/chat-store';
import { ChatLauncher } from '../ui/chat-launcher';
import { SelectionPrompt } from '../ui/selection-prompt';
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
    errorCode,
    messagesEndRef,
    sendMessage,
    handleSuggestionClick,
    retry,
    resetChat,
    attachment,
    setAttachment,
    attachSelection,
  } = useChatStore();

  const launcherRef = useRef<HTMLTextAreaElement>(null);

  const isFooterInView = useFooterInView();

  const hasConversation = messages.length > 0;

  const { selection, clear: clearSelection } = useTextSelection('[data-doc-prose]');

  const submit = useCallback(
    (text: string) => {
      const quote = attachment ?? undefined;
      setAttachment(null);
      if (!isOpen) setIsOpen(true);
      void sendMessage(text, quote);
    },
    [attachment, setAttachment, isOpen, setIsOpen, sendMessage],
  );

  const { message, setMessage, handleSubmit, handleKeyPress } = useChatInput(submit);

  const handleAddSelection = useCallback(() => {
    if (!selection) return;
    attachSelection(selection.text);
    clearSelection();
    window.getSelection()?.removeAllRanges();
  }, [selection, attachSelection, clearSelection]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    if (isExpanded) toggleExpanded();
  }, [setIsOpen, isExpanded, toggleExpanded]);

  useKbdShortcut(
    ['ctrl', 'i'],
    useCallback(() => {
      if (isOpen) return;
      if (hasConversation || isFooterInView) {
        setIsOpen(true);
        return;
      }
      launcherRef.current?.focus();
    }, [isOpen, hasConversation, isFooterInView, setIsOpen]),
  );

  useKbdShortcut(
    ['cmd', 'j'],
    useCallback(() => setIsOpen(!isOpen), [isOpen, setIsOpen]),
  );

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
      <div className="fixed bottom-6 left-1/2 z-500 -translate-x-1/2">
        <AnimatePresence>
          {!isOpen && !isExpanded && !isFooterInView && (
            <ChatLauncher
              message={message}
              inputRef={launcherRef}
              hasConversation={hasConversation}
              onMessageChange={setMessage}
              onSubmit={handleSubmit}
              onKeyDown={handleKeyPress}
              onOpen={() => setIsOpen(true)}
            />
          )}
        </AnimatePresence>
      </div>
      <AnimatePresence>
        {selection && <SelectionPrompt selection={selection} onAdd={handleAddSelection} />}
      </AnimatePresence>
      <ChatWindow
        isOpen={isOpen}
        isExpanded={isExpanded}
        messages={messages}
        isLoading={isLoading}
        isStreaming={isStreaming}
        activeTool={activeTool}
        errorCode={errorCode}
        messagesEndRef={messagesEndRef as RefObject<HTMLDivElement>}
        message={message}
        onMessageChange={setMessage}
        onSubmit={handleSubmit}
        onKeyDown={handleKeyPress}
        onClose={handleClose}
        onReset={resetChat}
        attachment={attachment}
        onRemoveAttachment={() => setAttachment(null)}
        onSuggestionClick={handleSuggestionClickWrapper}
        onRetry={retry}
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

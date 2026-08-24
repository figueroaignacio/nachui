import type { Message } from '@/lib/definitions';
import { Container } from '@repo/ui/layout/container';
import { AnimatePresence, motion, useReducedMotion, type Transition } from 'motion/react';
import type { ToolName } from '../hooks/use-chat';
import type { ChatErrorCode } from '../lib/chat-error';
import { ChatHeader } from '../ui/chat-header';
import { ChatInput } from '../ui/chat-input';
import { ChatMessages } from './chat-messages';

interface ChatWindowProps {
  isOpen: boolean;
  isExpanded: boolean;
  messages: Message[];
  isLoading: boolean;
  isStreaming: boolean;
  activeTool: ToolName | null;
  errorCode: ChatErrorCode | null;
  messagesEndRef: React.RefObject<HTMLDivElement>;
  message: string;
  attachment: string | null;
  onRemoveAttachment: () => void;
  onMessageChange: (value: string) => void;
  onSubmit: (e?: React.FormEvent) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  onClose: () => void;
  onReset: () => void;
  onSuggestionClick: (text: string) => void;
  onRetry: () => void;
  onToggleExpand: () => void;
}

const PANEL_DURATION = 0.3;
const PANEL_EASE = [0.4, 0, 0.2, 1] as const;

const backdropTransition: Transition = { duration: PANEL_DURATION, ease: PANEL_EASE };

const panelEnterTransition: Transition = {
  duration: PANEL_DURATION,
  ease: PANEL_EASE,
};

const panelHidden = { opacity: 0, x: '100%' };
const panelVisible = { opacity: 1, x: 0 };

const layoutTransition = {
  type: 'spring' as const,
  stiffness: 350,
  damping: 32,
  mass: 0.6,
};

const backdropStyle = { willChange: 'opacity' } as const;
const panelStyle = { willChange: 'transform, opacity' } as const;

export function ChatWindow(props: ChatWindowProps) {
  const {
    isOpen,
    isExpanded,
    messages,
    isLoading,
    isStreaming,
    activeTool,
    errorCode,
    messagesEndRef,
    message,
    attachment,
    onRemoveAttachment,
    onMessageChange,
    onSubmit,
    onKeyDown,
    onClose,
    onReset,
    onSuggestionClick,
    onRetry,
    onToggleExpand,
  } = props;

  const reduceMotion = useReducedMotion();

  const body = (
    <div className="bg-background relative z-10 flex h-full flex-col">
      <ChatHeader
        onClose={onClose}
        onReset={onReset}
        isExpanded={isExpanded}
        onToggleExpand={onToggleExpand}
      />
      <div className="flex-1 overflow-y-auto">
        <ChatMessages
          messages={messages}
          isLoading={isLoading}
          isStreaming={isStreaming}
          activeTool={activeTool}
          errorCode={errorCode}
          endRef={messagesEndRef}
          onSuggestionClick={onSuggestionClick}
          onRetry={onRetry}
        />
      </div>
      <ChatInput
        message={message}
        isLoading={isLoading || isStreaming}
        attachment={attachment}
        onRemoveAttachment={onRemoveAttachment}
        onMessageChange={onMessageChange}
        onSubmit={onSubmit}
        onKeyDown={onKeyDown}
      />
    </div>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="chat-backdrop"
            style={backdropStyle}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={reduceMotion ? { duration: 0 } : backdropTransition}
            className="bg-background/50 fixed inset-0 z-9999 backdrop-blur-[2px] md:hidden"
            onClick={onClose}
          />
          <motion.div
            key="chat-panel"
            layout
            style={panelStyle}
            initial={reduceMotion ? false : panelHidden}
            animate={panelVisible}
            exit={reduceMotion ? { opacity: 0 } : panelHidden}
            transition={
              reduceMotion ? { duration: 0 } : { layout: layoutTransition, ...panelEnterTransition }
            }
            className={
              isExpanded
                ? 'bg-background fixed inset-0 z-9999 flex'
                : 'bg-background border-rule fixed inset-y-0 right-0 z-9999 flex h-full w-full flex-col overflow-hidden border-l md:w-(--chat-width)'
            }
          >
            {isExpanded ? <Container size="lg">{body}</Container> : body}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

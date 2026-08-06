import type { Message } from '@/lib/definitions';
import { Container } from '@repo/ui/layout/container';
import { AnimatePresence, motion, type Transition } from 'motion/react';
import type { ToolName } from '../hooks/use-chat';
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
  error: Error | undefined;
  messagesEndRef: React.RefObject<HTMLDivElement>;
  message: string;
  onMessageChange: (value: string) => void;
  onSubmit: (e?: React.FormEvent) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onClose: () => void;
  onReset: () => void;
  onSuggestionClick: (text: string) => void;
  onToggleExpand: () => void;
}

const backdropTransition: Transition = { duration: 0.25, ease: [0.22, 1, 0.36, 1] };

const panelEnterTransition = {
  type: 'spring' as const,
  stiffness: 380,
  damping: 34,
  mass: 0.8,
};

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
    error,
    messagesEndRef,
    message,
    onMessageChange,
    onSubmit,
    onKeyDown,
    onClose,
    onReset,
    onSuggestionClick,
    onToggleExpand,
  } = props;

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
          error={error}
          endRef={messagesEndRef}
          onSuggestionClick={onSuggestionClick}
        />
      </div>
      <ChatInput
        message={message}
        isLoading={isLoading || isStreaming}
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
            transition={backdropTransition}
            className="bg-background/50 fixed inset-0 z-9999 backdrop-blur-[2px]"
            onClick={onClose}
          />
          <motion.div
            key="chat-panel"
            layout
            style={panelStyle}
            initial={{ opacity: 0, x: 80, scale: 0.97 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 60, scale: 0.97 }}
            transition={{
              layout: layoutTransition,
              ...panelEnterTransition,
            }}
            className={
              isExpanded
                ? 'bg-background fixed inset-0 z-9999 flex'
                : 'bg-background border-border fixed inset-y-0 right-0 z-9999 flex h-full w-full flex-col overflow-hidden border-l md:w-112.5 lg:w-175'
            }
          >
            {isExpanded ? <Container size="lg">{body}</Container> : body}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

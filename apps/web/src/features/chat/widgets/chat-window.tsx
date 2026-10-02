import { useDialogBehavior } from '@/hooks/use-dialog-behavior';
import type { Message } from '@/lib/definitions';
import { AnimatePresence, motion, useReducedMotion, type Transition } from 'motion/react';
import { useTranslations } from 'next-intl';
import { Resizable } from '@repo/ui/components/resizable';
import { useRef } from 'react';
import type { ToolName } from '../hooks/use-chat';
import { useChatResize } from '../hooks/use-chat-resize';
import type { ChatErrorCode } from '../lib/chat-error';
import { ChatHeader } from '../ui/chat-header';
import { ChatInput } from '../ui/chat-input';
import { ChatMessages } from './chat-messages';

interface ChatWindowProps {
  isOpen: boolean;
  messages: Message[];
  isLoading: boolean;
  isStreaming: boolean;
  activeTool: ToolName | null;
  errorCode: ChatErrorCode | null;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
  attachment: string | null;
  onRemoveAttachment: () => void;
  onSubmit: (text: string) => void;
  onStop: () => void;
  onClose: () => void;
  onReset: () => void;
  onSuggestionClick: (text: string) => void;
  onRetry: () => void;
  isModal: boolean;
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

const backdropStyle = { willChange: 'opacity' } as const;
const panelStyle = { willChange: 'transform, opacity' } as const;

export function ChatWindow(props: ChatWindowProps) {
  const {
    isOpen,
    messages,
    isLoading,
    isStreaming,
    activeTool,
    errorCode,
    messagesEndRef,
    attachment,
    onRemoveAttachment,
    onSubmit,
    onStop,
    onClose,
    onReset,
    onSuggestionClick,
    onRetry,
    isModal,
  } = props;

  const reduceMotion = useReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);
  const t = useTranslations('components.chat');
  const resize = useChatResize();

  useDialogBehavior({ open: isOpen, onClose, ref: panelRef, trap: isModal });

  const body = (
    <div className="bg-background relative z-10 flex h-full flex-col">
      <ChatHeader
        onClose={onClose}
        onReset={onReset}
        isLoading={isLoading}
        isStreaming={isStreaming}
        activeTool={activeTool}
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
        isLoading={isLoading}
        isStreaming={isStreaming}
        attachment={attachment}
        onRemoveAttachment={onRemoveAttachment}
        onSubmit={onSubmit}
        onStop={onStop}
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
          {isModal ? (
            <motion.div
              key="chat-panel"
              ref={panelRef}
              role="dialog"
              aria-modal
              aria-label={t('label')}
              tabIndex={-1}
              style={panelStyle}
              initial={reduceMotion ? false : panelHidden}
              animate={panelVisible}
              exit={reduceMotion ? { opacity: 0 } : panelHidden}
              transition={reduceMotion ? { duration: 0 } : panelEnterTransition}
              className="bg-background fixed inset-0 z-9999 flex flex-col"
            >
              {body}
            </motion.div>
          ) : (
            <div key="chat-dock" className="pointer-events-none fixed inset-0 z-9999">
              <Resizable key={resize.groupKey} data-chat-resizer onLayout={resize.onLayout}>
                <Resizable.Panel {...resize.page} />
                <Resizable.Handle
                  aria-label={t('resize')}
                  onDoubleClick={resize.reset}
                  className="hover:bg-border-interactive focus-visible:bg-ring [[data-dragging]_&]:bg-border-interactive pointer-events-auto z-10 bg-transparent transition-colors duration-150"
                />
                <Resizable.Panel {...resize.chat} className="pointer-events-auto min-w-0">
                  <motion.div
                    ref={panelRef}
                    role="dialog"
                    aria-modal={false}
                    aria-label={t('label')}
                    tabIndex={-1}
                    style={panelStyle}
                    initial={reduceMotion ? false : panelHidden}
                    animate={panelVisible}
                    exit={reduceMotion ? { opacity: 0 } : panelHidden}
                    transition={reduceMotion ? { duration: 0 } : panelEnterTransition}
                    className="bg-background border-rule flex h-full flex-col border-l"
                  >
                    {body}
                  </motion.div>
                </Resizable.Panel>
              </Resizable>
            </div>
          )}
        </>
      )}
    </AnimatePresence>
  );
}

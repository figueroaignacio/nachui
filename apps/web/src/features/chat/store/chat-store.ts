import type { Message } from '@/lib/definitions';
import type { ToolName } from '../hooks/use-chat';
import type { ChatErrorCode } from '../lib/chat-error';
import { create } from 'zustand';

interface PendingMessage {
  content: string;
  quote?: string;
}

interface ChatStore {
  /** The engine (useChat) is lazy: it mounts once this flips to true. */
  isActivated: boolean;
  activate: () => void;
  /** A message sent before the engine was ready, flushed once it hydrates. */
  pendingMessage: PendingMessage | null;
  takePendingMessage: () => PendingMessage | null;

  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  openChat: () => void;
  closeChat: () => void;

  messages: Message[];
  isLoading: boolean;
  isStreaming: boolean;
  activeTool: ToolName | null;
  errorCode: ChatErrorCode | null;

  attachment: string | null;
  setAttachment: (text: string | null) => void;
  attachSelection: (text: string) => void;

  sendMessage: (content: string, quote?: string) => Promise<void>;
  handleSuggestionClick: (text: string) => void;
  stop: () => void;
  retry: () => void;
  resetChat: () => void;

  triggerExplanation: (componentName: string, promptTemplate: string) => void;

  _sync: (state: Partial<ChatStore>) => void;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  isActivated: false,
  activate: () => set({ isActivated: true }),
  pendingMessage: null,
  takePendingMessage: () => {
    const { pendingMessage } = get();
    if (pendingMessage) set({ pendingMessage: null });
    return pendingMessage;
  },

  isOpen: false,
  setIsOpen: (isOpen) => set(isOpen ? { isOpen, isActivated: true } : { isOpen }),
  openChat: () => set({ isOpen: true, isActivated: true }),
  closeChat: () => set({ isOpen: false }),

  messages: [],
  isLoading: false,
  isStreaming: false,
  activeTool: null,
  errorCode: null,

  attachment: null,
  setAttachment: (attachment) => set({ attachment }),
  attachSelection: (text) => set({ attachment: text, isOpen: true, isActivated: true }),

  // Placeholders until the engine mounts and syncs the real actions.
  sendMessage: async (content, quote) => {
    set({ pendingMessage: { content, quote }, isActivated: true });
  },
  handleSuggestionClick: (text) => {
    void get().sendMessage(text);
  },
  stop: () => {},
  retry: () => {},
  resetChat: () => {},

  triggerExplanation: (componentName, promptTemplate) => {
    const { isOpen, setIsOpen, sendMessage } = get();
    if (!isOpen) setIsOpen(true);
    void sendMessage(promptTemplate.replace('{component}', componentName));
  },

  _sync: (state) => set(state),
}));

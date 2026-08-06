import type { Message } from '@/lib/definitions';
import type { ToolName } from '../hooks/use-chat';
import { create } from 'zustand';

interface ChatStore {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  openChat: () => void;
  closeChat: () => void;

  isExpanded: boolean;
  setIsExpanded: (isExpanded: boolean) => void;
  toggleExpanded: () => void;

  messages: Message[];
  isLoading: boolean;
  isStreaming: boolean;
  activeTool: ToolName | null;
  error: Error | undefined;
  messagesEndRef: React.RefObject<HTMLDivElement | null> | null;

  sendMessage: (content: string) => Promise<void>;
  handleSuggestionClick: (text: string) => void;
  stop: () => void;
  resetChat: () => void;

  triggerExplanation: (componentName: string, promptTemplate: string) => void;

  _sync: (state: Partial<ChatStore>) => void;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  isOpen: false,
  setIsOpen: (isOpen) => set({ isOpen }),
  openChat: () => set({ isOpen: true }),
  closeChat: () => set({ isOpen: false }),

  isExpanded: false,
  setIsExpanded: (isExpanded) => set({ isExpanded }),
  toggleExpanded: () => set((state) => ({ isExpanded: !state.isExpanded })),

  messages: [],
  isLoading: false,
  isStreaming: false,
  activeTool: null,
  error: undefined,
  messagesEndRef: null,

  sendMessage: async () => {},
  handleSuggestionClick: () => {},
  stop: () => {},
  resetChat: () => {},

  triggerExplanation: (componentName, promptTemplate) => {
    const { isOpen, setIsOpen, sendMessage } = get();
    if (!isOpen) setIsOpen(true);
    void sendMessage(promptTemplate.replace('{component}', componentName));
  },

  _sync: (state) => set(state),
}));

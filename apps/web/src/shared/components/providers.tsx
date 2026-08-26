'use client';

import { MotionConfig } from 'motion/react';
import { ThemeProvider } from 'nach-themes';
import { ChatEngine } from '@/features/chat/store/chat-engine';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <MotionConfig reducedMotion="user">
        {children}
        <ChatEngine />
      </MotionConfig>
    </ThemeProvider>
  );
}

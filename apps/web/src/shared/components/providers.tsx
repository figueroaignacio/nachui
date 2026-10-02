'use client';

import { MotionConfig } from 'motion/react';
import { ThemeProvider } from 'nach-themes';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </ThemeProvider>
  );
}

'use client';

import { cloneElement } from 'react';

interface CodeBlockProps {
  collapsible?: boolean;
}

interface CodeBlockWrapperProps {
  children: React.ReactElement<CodeBlockProps>;
}

export function CodeBlockWrapper({ children }: CodeBlockWrapperProps) {
  return cloneElement(children, { collapsible: true });
}

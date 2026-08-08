'use client';

import { cloneElement } from 'react';

interface CodeBlockProps {
  collapsible?: boolean;
}

interface CodeBlockWrapperProps {
  children: React.ReactElement<CodeBlockProps>;
}

/**
 * Marks a CodeBlock as collapsible. The clip/expand state lives in CodeBlock
 * itself so the button sits inside the scroll container it controls.
 */
export function CodeBlockWrapper({ children }: CodeBlockWrapperProps) {
  return cloneElement(children, { collapsible: true });
}

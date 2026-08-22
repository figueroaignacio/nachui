'use client';

import { useRef } from 'react';
import { useGaze } from '@/shared/hooks/use-gaze';

import { AiFace } from './ai-face';

const SIZES = {
  sm: 16,
  md: 24,
  lg: 32,
  xl: 48,
} as const;

export type AiExpression = 'awake' | 'reading' | 'asleep' | 'startled';

type AiAvatarProps = {
  size?: keyof typeof SIZES;
  expression?: AiExpression;
  follow?: boolean;
};

export function AiAvatar({ size = 'md', expression = 'awake', follow = false }: AiAvatarProps) {
  const SIZE = SIZES[size];
  const ref = useRef<SVGSVGElement>(null);
  useGaze(ref, follow);

  return (
    <svg
      ref={ref}
      height={SIZE}
      viewBox="0 0 24 24"
      width={SIZE}
      xmlns="http://www.w3.org/2000/svg"
      data-expression={expression}
      className="ai-avatar"
    >
      <title>Mate Agent</title>
      <AiFace />
    </svg>
  );
}

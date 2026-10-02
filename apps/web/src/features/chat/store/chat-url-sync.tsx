'use client';

import { useEffect } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { useChatStore } from './chat-store';

/** Mirrors `?chat=open|closed` into the store. Needs a Suspense boundary. */
export function ChatUrlSync() {
  const searchParams = useSearchParams();
  const isOpen = useChatStore((s) => s.isOpen);
  const setIsOpen = useChatStore((s) => s.setIsOpen);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!searchParams) return;
    const chatParam = searchParams.get('chat');
    if (chatParam === 'open' && !isOpen) {
      setIsOpen(true);
    } else if (chatParam === 'closed' && isOpen) {
      setIsOpen(false);
    }
  }, [searchParams, isOpen, setIsOpen]);

  useEffect(() => {
    if (!searchParams) return;
    const chatParam = searchParams.get('chat');
    if (isOpen && chatParam === 'closed') {
      const params = new URLSearchParams(searchParams.toString());
      params.delete('chat');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      router.replace(`${pathname}?${params.toString()}` as any, { scroll: false });
    } else if (!isOpen && chatParam === 'open') {
      const params = new URLSearchParams(searchParams.toString());
      params.delete('chat');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      router.replace(`${pathname}?${params.toString()}` as any, { scroll: false });
    }
  }, [isOpen, searchParams, pathname, router]);

  return null;
}

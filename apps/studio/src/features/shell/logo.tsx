import { cn } from '@repo/ui/lib/cn';
import Link from 'next/link';

export function LogoMark({ size = 24, className }: { size?: number; className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      aria-hidden="true"
      focusable="false"
      className={cn('text-foreground shrink-0 overflow-visible', className)}
    >
      <path
        d="M47 25H23A16 16 0 0 0 7 41V77A16 16 0 0 0 23 93H59A16 16 0 0 0 75 77V53H47Z"
        className="fill-current"
      />
      <path
        d="M65 7H77A16 16 0 0 1 93 23V35H65Z"
        className="fill-primary transition-[translate] duration-500 ease-[cubic-bezier(.3,1.45,.55,1)] motion-reduce:transition-none [a:focus-visible_&]:translate-x-[5px] [a:focus-visible_&]:-translate-y-[5px] [a:hover_&]:translate-x-[5px] [a:hover_&]:-translate-y-[5px]"
      />
    </svg>
  );
}

export function Logo({ label = 'Studio' }: { label?: string }) {
  return (
    <Link
      href="/"
      className="focus-visible:ring-ring flex items-center gap-2.5 rounded-sm focus-visible:ring-2 focus-visible:outline-none"
    >
      <LogoMark size={24} />
      <span className="text-sm font-semibold">{label}</span>
    </Link>
  );
}

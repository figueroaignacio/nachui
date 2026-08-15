import { cn } from '@repo/ui/lib/cn';
import Image from 'next/image';

interface LogoProps {
  withText?: boolean;
  size?: number;
  className?: string;
  imageClassName?: string;
  priority?: boolean;
}

export function Logo({
  withText = false,
  size = 28,
  className,
  imageClassName,
  priority,
}: LogoProps) {
  return (
    <span className={cn('flex items-center gap-2.5', className)}>
      <Image
        src="/icon-192.png"
        alt=""
        width={size}
        height={size}
        priority={priority}
        className={cn('rounded-md', imageClassName)}
      />
      {withText && <span className="text-foreground font-mono text-sm font-medium">NachUI</span>}
    </span>
  );
}

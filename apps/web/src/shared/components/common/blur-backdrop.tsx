import { cn } from '@repo/ui/lib/cn';

type BlurBackdropProps = {
  className?: string;
};

export function BlurBackdrop({ className }: BlurBackdropProps) {
  return (
    <div
      aria-hidden="true"
      className={cn('pointer-events-none absolute inset-0 -z-10 overflow-hidden', className)}
    >
      <div className="bg-primary/8 absolute -top-24 right-[12%] h-72 w-72 rounded-full blur-3xl" />
      <div className="bg-primary/4 absolute top-1/4 left-1/2 h-96 w-md -translate-x-1/2 rounded-full blur-3xl" />
    </div>
  );
}

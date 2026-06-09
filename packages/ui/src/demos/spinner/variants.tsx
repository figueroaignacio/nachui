import { Spinner } from '@repo/ui/components/spinner';

const variants = [
  'default',
  'primary',
  'muted',
  'success',
  'destructive',
  'warning',
  'info',
] as const;

export default function SpinnerVariants() {
  return (
    <div className="flex flex-wrap justify-center gap-4 py-8">
      {variants.map((variant) => (
        <Spinner key={variant} variant={variant} />
      ))}
    </div>
  );
}

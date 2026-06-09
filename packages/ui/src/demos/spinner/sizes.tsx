import { Spinner } from '@repo/ui/components/spinner';

const sizes = ['sm', 'md', 'lg', 'xl'] as const;

export default function SpinnerSizes() {
  return (
    <div className="flex items-end justify-center gap-6 py-8">
      {sizes.map((size) => (
        <Spinner key={size} size={size} />
      ))}
    </div>
  );
}

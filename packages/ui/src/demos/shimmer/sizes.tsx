import { Shimmer } from '../../ai/shimmer';

export function Sizes() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-3">
      <Shimmer as="h3" className="text-lg font-medium" duration={2.4}>
        Drafting the answer
      </Shimmer>
      <Shimmer className="text-sm">Searching the docs for prompt input</Shimmer>
      <Shimmer as="span" className="text-xs" spread={3}>
        Almost there
      </Shimmer>
    </div>
  );
}

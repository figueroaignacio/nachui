import { HeartIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { Rating } from '../../components/rating';

export function CustomIcon() {
  return (
    <Rating
      max={5}
      defaultValue={3}
      aria-label="How much did you like it?"
      icon={<HugeiconsIcon icon={HeartIcon} strokeWidth={1.5} />}
      filledIcon={<HugeiconsIcon icon={HeartIcon} strokeWidth={1.5} fill="currentColor" />}
      className="[&_[data-slot=rating-fill]]:text-destructive"
    />
  );
}

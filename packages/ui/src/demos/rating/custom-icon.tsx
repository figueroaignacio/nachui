import { Rating } from '../../components/rating';
import { HeartIcon } from '../../icons/heart';

export function CustomIcon() {
  return (
    <Rating
      max={5}
      defaultValue={3}
      aria-label="How much did you like it?"
      icon={<HeartIcon strokeWidth={1.5} />}
      filledIcon={<HeartIcon strokeWidth={1.5} fill="currentColor" />}
      className="[&_[data-slot=rating-fill]]:text-destructive"
    />
  );
}

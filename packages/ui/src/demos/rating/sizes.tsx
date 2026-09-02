import { Rating } from '../../components/rating';

export function Sizes() {
  return (
    <div className="flex flex-col items-start gap-4">
      <Rating size="sm" defaultValue={4} aria-label="Small rating" />
      <Rating size="default" defaultValue={4} aria-label="Default rating" />
      <Rating size="lg" defaultValue={4} aria-label="Large rating" />
    </div>
  );
}

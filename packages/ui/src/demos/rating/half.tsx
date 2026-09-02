import { Rating } from '../../components/rating';

export function Half() {
  return (
    <Rating
      defaultValue={3.5}
      precision={0.5}
      allowClear
      aria-label="Rate the onboarding experience"
    />
  );
}

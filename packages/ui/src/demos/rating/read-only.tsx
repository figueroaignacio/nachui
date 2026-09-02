import { Rating } from '../../components/rating';

const reviews = [
  { product: 'Northwind Desk Mat', score: 4.6, count: 1284 },
  { product: 'Mechanical Keyboard, 65%', score: 4.2, count: 312 },
  { product: 'Monitor Arm', score: 3.8, count: 97 },
];

export function ReadOnly() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-3">
      {reviews.map((review) => (
        <div key={review.product} className="flex items-center justify-between gap-4">
          <span className="text-sm">{review.product}</span>
          <Rating readOnly value={review.score} precision={0.5} size="sm">
            <span className="text-muted-foreground text-xs tabular-nums">
              {review.score} ({review.count})
            </span>
          </Rating>
        </div>
      ))}
    </div>
  );
}

import { Card } from '@repo/ui/components/card';
import { Rating } from '@repo/ui/components/rating';
import { Textarea } from '@repo/ui/components/textarea';

export function PreviewRating() {
  return (
    <Card>
      <Card.Header compact>
        <Card.Title className="text-sm font-semibold">Rate this release</Card.Title>
      </Card.Header>
      <Card.Content compact className="space-y-3">
        <Rating value={4} readOnly size="sm" label="Release rating" />
        <Textarea placeholder="Anything to add?" aria-label="Comment" resize="none" rows={3} />
      </Card.Content>
    </Card>
  );
}

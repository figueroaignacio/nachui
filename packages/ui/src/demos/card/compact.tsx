'use client';

import { Button } from '../../components/button';
import { Card } from '../../components/card';

const cards = [
  {
    title: 'Regular Spacing',
    description: 'Default padding',
    content: 'This card uses the default padding for comfortable spacing.',
    compact: false,
  },
  {
    title: 'Compact Spacing',
    description: 'Reduced padding',
    content: 'This card uses compact padding for denser layouts.',
    compact: true,
  },
] as const;

export function Compact() {
  return (
    <div className="grid gap-4">
      {cards.map((card) => (
        <Card key={card.title} className="w-full">
          <Card.Header compact={card.compact}>
            <Card.Title>{card.title}</Card.Title>
            <Card.Description>{card.description}</Card.Description>
          </Card.Header>
          <Card.Content compact={card.compact}>
            <p>{card.content}</p>
          </Card.Content>
          <Card.Footer compact={card.compact}>
            <Button variant="secondary">Action</Button>
          </Card.Footer>
        </Card>
      ))}
    </div>
  );
}

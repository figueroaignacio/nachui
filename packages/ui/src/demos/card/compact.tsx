import { Button } from '../../components/button';
import { Card } from '../../components/card';

const densities = [
  {
    label: 'Default density, billing page',
    compact: false,
  },
  {
    label: 'Compact density, sidebar summary',
    compact: true,
  },
] as const;

export function Compact() {
  return (
    <div className="grid w-full max-w-sm gap-6">
      {densities.map((density) => (
        <div key={density.label}>
          <p className="text-muted-foreground mb-2 text-xs">{density.label}</p>
          <Card>
            <Card.Header compact={density.compact}>
              <Card.Title>Team plan</Card.Title>
              <Card.Description>$49 per month, renews on Mar 14</Card.Description>
            </Card.Header>
            <Card.Content compact={density.compact} className="text-sm">
              <p className="text-muted-foreground">
                12 of 20 seats used. Invoices go to billing@acmestudio.dev.
              </p>
            </Card.Content>
            <Card.Footer compact={density.compact}>
              <Button variant="secondary" size="sm">
                Manage billing
              </Button>
            </Card.Footer>
          </Card>
        </div>
      ))}
    </div>
  );
}

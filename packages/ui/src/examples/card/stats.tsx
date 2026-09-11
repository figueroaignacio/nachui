import { Badge } from '../../components/badge';
import { Card } from '../../components/card';

const stats = [
  { label: 'Revenue', value: '$48,210', delta: '+12.4%', tone: 'success' },
  { label: 'Active users', value: '3,904', delta: '+3.1%', tone: 'success' },
  { label: 'Churn', value: '1.8%', delta: '-0.4%', tone: 'info' },
] as const;

export function Stats() {
  return (
    <div className="grid w-full max-w-lg gap-3 sm:grid-cols-3">
      {stats.map((stat) => (
        <Card key={stat.label}>
          <Card.Header compact>
            <Card.Description>{stat.label}</Card.Description>
          </Card.Header>
          <Card.Content compact className="flex items-end justify-between gap-2">
            <span className="text-2xl font-semibold tracking-tight">{stat.value}</span>
            <Badge variant={stat.tone}>{stat.delta}</Badge>
          </Card.Content>
        </Card>
      ))}
    </div>
  );
}

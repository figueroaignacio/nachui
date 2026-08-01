import { Button } from '@repo/ui/components/button';
import { Card } from '@repo/ui/components/card';
import { Checkbox } from '@repo/ui/components/checkbox';

const preferences = [
  {
    title: 'Transaction alerts',
    description: 'Deposits, withdrawals, and transfers.',
    checked: true,
  },
  {
    title: 'Security alerts',
    description: 'Login attempts and account changes.',
    checked: true,
  },
  {
    title: 'Goal milestones',
    description: 'Updates at 25%, 50%, 75%, and 100%.',
    checked: false,
  },
  {
    title: 'Market updates',
    description: 'Daily portfolio summary and price alerts.',
    checked: false,
  },
];

export function PreviewNotificationPrefs() {
  return (
    <Card>
      <Card.Header compact>
        <Card.Title className="text-sm font-semibold">Notifications</Card.Title>
        <Card.Description className="text-xs">
          Choose which email and push alerts you want to receive.
        </Card.Description>
      </Card.Header>
      <Card.Content compact className="mt-4 space-y-4">
        {preferences.map((pref) => (
          <div key={pref.title} className="flex items-start gap-3">
            <Checkbox defaultChecked={pref.checked} aria-label={pref.title} className="mt-0.5" />
            <div>
              <div className="text-foreground text-xs font-semibold">{pref.title}</div>
              <div className="text-muted-foreground mt-0.5 text-[11px]">{pref.description}</div>
            </div>
          </div>
        ))}
      </Card.Content>
      <Card.Footer compact className="mt-4">
        <Button size="sm" variant="secondary" fullWidth>
          Save Preferences
        </Button>
      </Card.Footer>
    </Card>
  );
}

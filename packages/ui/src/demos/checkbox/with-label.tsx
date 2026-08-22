import { Checkbox } from '../../components/checkbox';
import { Label } from '../../components/label';

const alerts = [
  {
    id: 'deploy-failed',
    label: 'A deploy fails',
    hint: 'Sent to you and to the on call channel.',
    defaultChecked: true,
  },
  {
    id: 'usage-limit',
    label: 'Usage passes 80% of the plan limit',
    hint: 'One email per billing period.',
    defaultChecked: true,
  },
  {
    id: 'weekly-report',
    label: 'The weekly traffic report is ready',
    hint: 'Every Monday at 9:00.',
    defaultChecked: false,
  },
];

export function WithLabel() {
  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      <p className="text-sm font-medium">Email me when</p>
      {alerts.map((alert) => (
        <div key={alert.id} className="flex items-start gap-2.5">
          <Checkbox id={alert.id} defaultChecked={alert.defaultChecked} className="mt-0.5" />
          <div className="flex flex-col gap-1">
            <Label htmlFor={alert.id}>{alert.label}</Label>
            <span className="text-muted-foreground text-xs">{alert.hint}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

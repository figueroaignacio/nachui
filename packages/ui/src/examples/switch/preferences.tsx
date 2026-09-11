import { Switch } from '../../components/switch';

const groups = [
  {
    title: 'Email',
    items: [
      {
        id: 'email-mentions',
        label: 'Mentions',
        hint: 'When someone mentions you in a comment.',
        on: true,
      },
      {
        id: 'email-digest',
        label: 'Weekly digest',
        hint: 'A summary every Monday morning.',
        on: false,
      },
    ],
  },
  {
    title: 'Push',
    items: [
      {
        id: 'push-deploys',
        label: 'Deploys',
        hint: 'Success and failure of every deploy.',
        on: true,
      },
      { id: 'push-alerts', label: 'Alerts', hint: 'Uptime and error rate thresholds.', on: true },
    ],
  },
];

export function Preferences() {
  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      {groups.map((group) => (
        <div key={group.title} className="border-border bg-card rounded-xl border">
          <p className="text-muted-foreground border-border border-b px-4 py-2 text-xs font-medium tracking-wide uppercase">
            {group.title}
          </p>
          {group.items.map((item) => (
            <div
              key={item.id}
              className="border-border flex items-center justify-between gap-4 border-b p-4 last:border-b-0"
            >
              <div>
                <p id={`${item.id}-label`} className="text-sm">
                  {item.label}
                </p>
                <p className="text-muted-foreground text-xs">{item.hint}</p>
              </div>
              <Switch aria-labelledby={`${item.id}-label`} defaultChecked={item.on} />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

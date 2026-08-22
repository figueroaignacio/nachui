import { Radio } from '../../components/radio';

const cycles = [
  {
    value: 'monthly',
    title: 'Monthly',
    detail: '$29 per user, cancel any time',
    defaultChecked: false,
  },
  {
    value: 'yearly',
    title: 'Yearly',
    detail: '$24 per user, two months free',
    defaultChecked: true,
  },
];

export function Default() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-2">
      {cycles.map((cycle) => (
        <label
          key={cycle.value}
          className="border-border bg-card flex cursor-pointer items-center gap-3 rounded-lg border p-3"
        >
          <Radio name="billing-cycle" value={cycle.value} defaultChecked={cycle.defaultChecked} />
          <span className="flex flex-col gap-0.5">
            <span className="text-sm font-medium">{cycle.title}</span>
            <span className="text-muted-foreground text-xs">{cycle.detail}</span>
          </span>
        </label>
      ))}
    </div>
  );
}

import { Card } from '@repo/ui/components/card';

const usage = [
  { hour: '6a', value: 30 },
  { hour: '8a', value: 70 },
  { hour: '10a', value: 85 },
  { hour: '12p', value: 55 },
  { hour: '2p', value: 90 },
  { hour: '4p', value: 65 },
  { hour: '6p', value: 95 },
  { hour: '8p', value: 80 },
];

export function PreviewPowerUsage() {
  return (
    <Card>
      <Card.Header compact>
        <Card.Title className="text-sm font-semibold">Power Usage</Card.Title>
        <Card.Description className="text-xs">Whole Home</Card.Description>
      </Card.Header>
      <Card.Content compact className="mt-4 space-y-4">
        <div
          className="flex h-24 items-end gap-1.5"
          role="img"
          aria-label="Hourly power usage bar chart"
        >
          {usage.map((slot) => (
            <div key={slot.hour} className="flex h-full flex-1 flex-col justify-end gap-1.5">
              <div
                className="bg-muted w-full rounded-sm"
                style={{ height: `${slot.value}%` }}
                aria-hidden="true"
              />
              <span className="text-muted-foreground text-center text-[9px]">{slot.hour}</span>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <div className="text-muted-foreground text-[11px]">Currently Using</div>
            <div className="text-foreground text-xl font-bold tracking-tight">3.4 kW</div>
          </div>
          <div>
            <div className="text-muted-foreground text-[11px]">Solar Generation</div>
            <div className="text-foreground text-xl font-bold tracking-tight">+1.2 kW</div>
          </div>
        </div>
      </Card.Content>
    </Card>
  );
}

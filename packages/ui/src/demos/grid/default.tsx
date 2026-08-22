'use client';

import { Grid } from '../../layout/grid';

const stats = [
  { label: 'Revenue', value: '$12,480', delta: '+8.2%', up: true },
  { label: 'Active users', value: '3,214', delta: '+12%', up: true },
  { label: 'Churn', value: '1.9%', delta: '-0.4%', up: true },
];

const sparkline = [35, 55, 40, 70, 50, 85, 60, 95, 75, 100, 80, 90];

export function Default() {
  return (
    <Grid columns="3" gap="4" className="w-full max-w-lg">
      {stats.map((stat) => (
        <div key={stat.label} className="border-border bg-card rounded-xl border p-4">
          <p className="text-muted-foreground text-xs">{stat.label}</p>
          <p className="mt-1 text-xl font-semibold tracking-tight">{stat.value}</p>
          <p className={`mt-1 text-xs ${stat.up ? 'text-success-text' : 'text-destructive-text'}`}>
            {stat.delta}
          </p>
        </div>
      ))}
      <div className="border-border bg-card col-span-3 rounded-xl border p-4">
        <div className="flex items-baseline justify-between">
          <p className="text-muted-foreground text-xs">Weekly traffic</p>
          <p className="text-muted-foreground text-xs">Last 12 weeks</p>
        </div>
        <div className="mt-3 flex h-16 items-end gap-1.5">
          {sparkline.map((height, index) => (
            <div
              key={index}
              className="bg-primary/70 hover:bg-primary min-w-0 flex-1 rounded-sm transition-colors"
              style={{ height: `${height}%` }}
            />
          ))}
        </div>
      </div>
    </Grid>
  );
}

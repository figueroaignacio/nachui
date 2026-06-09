import { Button } from '../../components/button';

const variants = [
  { variant: 'default' as const, label: 'Default' },
  { variant: 'secondary' as const, label: 'Secondary' },
  { variant: 'outline' as const, label: 'Outline' },
  { variant: 'ghost' as const, label: 'Ghost' },
  { variant: 'link' as const, label: 'Link' },
  { variant: 'destructive' as const, label: 'Destructive' },
];

export function Variants() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      {variants.map((btn) => (
        <Button key={btn.variant} variant={btn.variant}>
          {btn.label}
        </Button>
      ))}
    </div>
  );
}

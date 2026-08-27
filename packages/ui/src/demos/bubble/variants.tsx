import { Bubble } from '../../components/bubble';

const VARIANTS = [
  { variant: 'default', text: 'Default, for the current user.' },
  { variant: 'secondary', text: 'Secondary, for the other side.' },
  { variant: 'muted', text: 'Muted, for supporting content.' },
  { variant: 'tinted', text: 'Tinted, a subtle primary wash.' },
  { variant: 'outline', text: 'Outline, framed but quiet.' },
  { variant: 'ghost', text: 'Ghost, no frame at all.' },
  { variant: 'destructive', text: 'Destructive, something went wrong.' },
] as const;

export function Variants() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-2">
      {VARIANTS.map(({ variant, text }) => (
        <Bubble key={variant} variant={variant}>
          <Bubble.Content>{text}</Bubble.Content>
        </Bubble>
      ))}
    </div>
  );
}

import { Section } from '../../layout/section';

const tones = ['default', 'muted', 'primary', 'inverted'] as const;

export function Backgrounds() {
  return (
    <div className="bg-card flex w-full max-w-md flex-col overflow-hidden rounded-lg shadow-sm">
      {tones.map((tone) => (
        <Section key={tone} size="sm" background={tone} contained={false} className="px-6">
          <p className="text-sm font-medium">background="{tone}"</p>
          <p className="text-xs opacity-70">Text and links inherit the right foreground.</p>
        </Section>
      ))}
    </div>
  );
}

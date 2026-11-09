import { useLocale } from 'next-intl';

import { CheckCircleIcon } from '@repo/ui/icons/check-circle';
import { XCircleIcon } from '@repo/ui/icons/x-circle';
import { cn } from '@repo/ui/lib/cn';

const VERDICTS = {
  en: { do: 'Do', dont: "Don't" },
  es: { do: 'Hacé', dont: 'Evitá' },
} as const;

const TONES = {
  do: {
    icon: CheckCircleIcon,
    rule: 'border-success',
    text: 'text-success-text',
  },
  dont: {
    icon: XCircleIcon,
    rule: 'border-destructive',
    text: 'text-destructive-text',
  },
} as const;

type Tone = keyof typeof TONES;

interface VerdictProps {
  caption: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

function Verdict({ tone, caption, children, className }: VerdictProps & { tone: Tone }) {
  const locale = useLocale();
  const label = VERDICTS[locale === 'es' ? 'es' : 'en'][tone];
  const { icon: Icon, rule, text } = TONES[tone];

  return (
    <figure
      data-verdict={tone}
      className={cn(
        'border-border bg-card flex min-w-0 flex-col overflow-hidden rounded-lg border',
        className,
      )}
    >
      {children ? (
        <div className="bg-surface-muted flex min-h-44 flex-1 items-center justify-center p-5 *:min-w-0 sm:p-6">
          {children}
        </div>
      ) : null}
      <figcaption className={cn('flex flex-col gap-1.5 border-t-2 px-4 py-3.5', rule)}>
        <span className={cn('flex items-center gap-1.5 text-sm font-semibold', text)}>
          <Icon size={16} aria-hidden="true" />
          {label}
        </span>
        <span className="text-muted-strong text-[15px] leading-relaxed">{caption}</span>
      </figcaption>
    </figure>
  );
}

export function Do(props: VerdictProps) {
  return <Verdict tone="do" {...props} />;
}

export function Dont(props: VerdictProps) {
  return <Verdict tone="dont" {...props} />;
}

export function DoDont({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('@container my-8', className)}>
      <div className="grid items-stretch gap-4 @2xl:grid-cols-2">{children}</div>
    </div>
  );
}

export function GuidelineExample({
  caption,
  children,
  className,
}: {
  caption?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <figure
      className={cn('border-border bg-card my-8 overflow-hidden rounded-lg border', className)}
    >
      <div className="bg-surface-muted flex min-h-56 items-center justify-center p-5 *:min-w-0 sm:p-8">
        {children}
      </div>
      {caption ? (
        <figcaption className="border-border text-muted-strong border-t px-4 py-3 text-[15px] leading-relaxed">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

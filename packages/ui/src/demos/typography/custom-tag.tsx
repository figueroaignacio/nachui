import { Typography } from '../../components/typography';

export function CustomTag() {
  return (
    <div className="bg-card flex w-full max-w-md flex-col gap-2 rounded-lg p-5 shadow-sm">
      <Typography as="div" variant="h4">
        Release 2.4.0
      </Typography>
      <Typography as="span" variant="muted">
        Published Mar 14, 214 downloads in the first hour
      </Typography>
      <Typography variant="p" className="[&:not(:first-child)]:mt-3">
        Dialogs now restore focus to the element that opened them. Run{' '}
        <Typography variant="code">pnpm add @acme/ui@2.4.0</Typography> to pick up the fix.
      </Typography>
    </div>
  );
}

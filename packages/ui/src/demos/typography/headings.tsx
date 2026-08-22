import { Typography } from '../../components/typography';

const outline = [
  { variant: 'h1' as const, text: 'Moving 40 packages into one repo' },
  { variant: 'h2' as const, text: 'Why we stopped publishing internal packages' },
  { variant: 'h3' as const, text: 'Versioning without a release train' },
  { variant: 'h4' as const, text: 'What broke in CI on the first day' },
  { variant: 'h5' as const, text: 'Cache keys and lockfile drift' },
  { variant: 'h6' as const, text: 'Appendix: migration checklist' },
];

export function Headings() {
  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      {outline.map((entry) => (
        <Typography key={entry.variant} variant={entry.variant}>
          {entry.text}
        </Typography>
      ))}
    </div>
  );
}

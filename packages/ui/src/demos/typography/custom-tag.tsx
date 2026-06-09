'use client';

import { Typography } from '../../components/typography';

const examples = [
  {
    label: 'Paragraph rendered as Span',
    element: (
      <Typography as="span" variant="p" className="bg-secondary/20 rounded p-2">
        This uses paragraph styling but is rendered as a inline `span` tag in the DOM.
      </Typography>
    ),
  },
  {
    label: 'Heading rendered as Div',
    element: (
      <Typography as="div" variant="h3">
        This looks like an H3, but it&apos;s actually a `div` element.
      </Typography>
    ),
  },
  {
    label: 'Code block rendering',
    element: (
      <Typography variant="code">
        console.log(&quot;This automatically renders as a code tag by variant inference&quot;);
      </Typography>
    ),
  },
];

export function CustomTag() {
  return (
    <div className="flex w-full flex-col gap-6">
      {examples.map(({ label, element }) => (
        <div key={label}>
          <Typography
            variant="small"
            className="text-primary mb-1 block font-bold tracking-wider uppercase"
          >
            {label}
          </Typography>
          {element}
        </div>
      ))}
    </div>
  );
}

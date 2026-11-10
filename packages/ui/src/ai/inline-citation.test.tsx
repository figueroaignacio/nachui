import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { expectNoAxeViolations } from '../../test-utils/axe';
import { InlineCitation } from './inline-citation';

const SOURCES = [
  { url: 'https://www.docs.stripe.com/currencies', title: 'Rounding and currency' },
  {
    url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl',
    title: 'Intl',
    description: 'Language sensitive number formatting.',
  },
];

describe('InlineCitation', () => {
  it('labels the chip with the first host and the rest as a count', async () => {
    const { container } = render(
      <p>
        <InlineCitation sources={SOURCES}>as the provider recommends</InlineCitation>
      </p>,
    );
    const trigger = screen.getByRole('button', { name: 'docs.stripe.com +1, 2 sources' });
    expect(trigger).toHaveTextContent('docs.stripe.com +1');
    expect(screen.getByText('as the provider recommends')).toHaveAttribute(
      'data-slot',
      'inline-citation-text',
    );
    await expectNoAxeViolations(container);
  });

  it('opens the sources on click with a link to each one', async () => {
    render(<InlineCitation sources={SOURCES} />);
    await userEvent.click(screen.getByRole('button'));
    const link = await screen.findByRole('link', { name: /Rounding and currency/ });
    expect(link).toHaveAttribute('href', SOURCES[0]?.url);
    expect(link).toHaveAttribute('target', '_blank');
    expect(screen.getByText('Language sensitive number formatting.')).toBeInTheDocument();
  });

  it('uses a custom label and renders only the text without sources', () => {
    const { rerender } = render(<InlineCitation sources={SOURCES} label="1" />);
    expect(screen.getByRole('button')).toHaveTextContent('1');
    rerender(<InlineCitation sources={[]}>plain text</InlineCitation>);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    expect(screen.getByText('plain text')).toBeInTheDocument();
  });
});

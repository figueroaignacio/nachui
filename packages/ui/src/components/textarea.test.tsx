import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { expectNoAxeViolations } from '../../test-utils/axe';
import { Textarea } from './textarea';

describe('Textarea', () => {
  it('renders a textarea with its label', () => {
    render(<Textarea label="Notes" />);
    expect(screen.getByLabelText('Notes')).toBeInstanceOf(HTMLTextAreaElement);
  });

  it('links description and error through aria-describedby', () => {
    render(<Textarea label="Notes" description="Keep it short" error="Too long" />);
    const textarea = screen.getByLabelText('Notes');
    const describedBy = textarea.getAttribute('aria-describedby') ?? '';
    expect(describedBy).toContain(screen.getByText('Keep it short').id);
    expect(describedBy).toContain(screen.getByText('Too long').id);
    expect(textarea).toHaveAttribute('aria-invalid', 'true');
  });

  it('shows a character count that follows typing', async () => {
    render(<Textarea label="Bio" showCount maxLength={20} />);
    expect(screen.getByText('0 / 20')).toBeInTheDocument();
    await userEvent.type(screen.getByLabelText('Bio'), 'hello');
    expect(screen.getByText('5 / 20')).toBeInTheDocument();
  });

  it('disables resizing when autoResize is on', () => {
    render(<Textarea label="Reply" autoResize />);
    const textarea = screen.getByLabelText('Reply');
    expect(textarea).toHaveClass('resize-none');
    expect(textarea).toHaveAttribute('rows', '1');
  });

  it('exposes compound parts', () => {
    render(
      <Textarea.Wrapper>
        <Textarea.Label htmlFor="custom">Custom</Textarea.Label>
        <textarea id="custom" />
        <Textarea.Error>Broken</Textarea.Error>
      </Textarea.Wrapper>,
    );
    expect(screen.getByLabelText('Custom')).toBeInTheDocument();
    expect(screen.getByText('Broken')).toBeInTheDocument();
  });

  it('keeps the error live region mounted before the error arrives', async () => {
    const { container, rerender } = render(<Textarea id="field" label="Email" />);
    const region = container.querySelector('#field-error');
    expect(region).toHaveAttribute('aria-live', 'polite');
    expect(region).toBeEmptyDOMElement();
    expect(region).toHaveClass('sr-only');
    expect(screen.getByLabelText('Email')).not.toHaveAttribute('aria-describedby');

    rerender(<Textarea id="field" label="Email" error="Enter a valid email" />);
    expect(container.querySelector('#field-error')).toBe(region);
    expect(region).toHaveTextContent('Enter a valid email');
    expect(region).toHaveClass('text-destructive-text');
    expect(screen.getByLabelText('Email')).toHaveAccessibleDescription('Enter a valid email');
    await expectNoAxeViolations(container);
  });

  it('shows a clearly visible focus ring', () => {
    render(<Textarea aria-label="Search" />);
    expect(screen.getByRole('textbox', { name: 'Search' })).toHaveClass(
      'focus-visible:border-ring',
      'focus-visible:ring-ring',
      'aria-invalid:focus-visible:ring-destructive',
    );
  });

  it('does not announce the character count on every keystroke', async () => {
    const user = userEvent.setup();
    render(<Textarea label="Bio" showCount maxLength={20} />);
    const textarea = screen.getByLabelText('Bio');
    await user.type(textarea, 'Hi');
    const count = screen.getByText('2 / 20');
    expect(count).not.toHaveAttribute('aria-live');
    expect(count.closest('[aria-live]')).toBeNull();
    expect(textarea).toHaveAccessibleDescription('2 / 20');
  });
});

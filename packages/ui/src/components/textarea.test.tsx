import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
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
});

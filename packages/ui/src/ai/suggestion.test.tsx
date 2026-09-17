import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Suggestion } from './suggestion';

describe('Suggestion', () => {
  it('renders the suggestion as its label', () => {
    render(<Suggestion suggestion="How do I install it?" />);
    expect(screen.getByRole('button', { name: 'How do I install it?' })).toBeInTheDocument();
  });

  it('passes the suggestion to onClick', async () => {
    const onClick = vi.fn();
    render(<Suggestion suggestion="Show me the dock" onClick={onClick} />);
    await userEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledWith('Show me the dock');
  });

  it('prefers children over the suggestion text', () => {
    render(<Suggestion suggestion="raw">Pretty label</Suggestion>);
    expect(screen.getByRole('button', { name: 'Pretty label' })).toBeInTheDocument();
  });

  it('scrolls its group horizontally', () => {
    render(
      <Suggestion.Group data-testid="group">
        <Suggestion suggestion="One" />
      </Suggestion.Group>,
    );
    expect(screen.getByTestId('group')).toHaveClass('overflow-x-auto');
  });
});

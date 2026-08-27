import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Bubble } from './bubble';

describe('Bubble', () => {
  it('renders content', () => {
    render(
      <Bubble>
        <Bubble.Content>Hello there</Bubble.Content>
      </Bubble>,
    );
    expect(screen.getByText('Hello there')).toBeInTheDocument();
  });

  it('applies default variant classes', () => {
    render(<Bubble data-testid="bubble">Hi</Bubble>);
    expect(screen.getByTestId('bubble')).toHaveClass('bg-primary');
  });

  it('applies secondary variant classes', () => {
    render(
      <Bubble variant="secondary" data-testid="bubble">
        Hi
      </Bubble>,
    );
    expect(screen.getByTestId('bubble')).toHaveClass('bg-secondary');
  });

  it('applies destructive variant classes', () => {
    render(
      <Bubble variant="destructive" data-testid="bubble">
        Hi
      </Bubble>,
    );
    expect(screen.getByTestId('bubble')).toHaveClass('bg-destructive-surface');
  });

  it('aligns to the end', () => {
    render(
      <Bubble align="end" data-testid="bubble">
        Hi
      </Bubble>,
    );
    expect(screen.getByTestId('bubble')).toHaveClass('self-end');
  });

  it('renders reactions anchored to a side', () => {
    render(
      <Bubble>
        <Bubble.Content>Hi</Bubble.Content>
        <Bubble.Reactions data-testid="reactions" side="top" align="start">
          <span>1</span>
        </Bubble.Reactions>
      </Bubble>,
    );
    const reactions = screen.getByTestId('reactions');
    expect(reactions).toHaveClass('-top-3');
    expect(reactions).toHaveClass('left-2');
  });

  it('groups bubbles with alignment', () => {
    render(
      <Bubble.Group align="end" data-testid="group">
        <Bubble>One</Bubble>
        <Bubble>Two</Bubble>
      </Bubble.Group>,
    );
    expect(screen.getByTestId('group')).toHaveClass('items-end');
  });

  it('renders content as child element', () => {
    render(
      <Bubble>
        <Bubble.Content asChild>
          <a href="https://example.com">A link</a>
        </Bubble.Content>
      </Bubble>,
    );
    const link = screen.getByRole('link', { name: 'A link' });
    expect(link).toHaveAttribute('href', 'https://example.com');
    expect(link).toHaveClass('px-3.5');
  });
});

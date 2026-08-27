import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Message } from './message';

describe('Message', () => {
  it('renders its parts', () => {
    render(
      <Message>
        <Message.Avatar data-testid="avatar">A</Message.Avatar>
        <Message.Content>
          <Message.Header>Ana</Message.Header>
          <div>Message body</div>
          <Message.Footer>10:24</Message.Footer>
        </Message.Content>
      </Message>,
    );
    expect(screen.getByText('Ana')).toBeInTheDocument();
    expect(screen.getByText('Message body')).toBeInTheDocument();
    expect(screen.getByText('10:24')).toBeInTheDocument();
  });

  it('aligns to the start by default', () => {
    render(<Message data-testid="message">Hi</Message>);
    const message = screen.getByTestId('message');
    expect(message).toHaveAttribute('data-align', 'start');
    expect(message).not.toHaveClass('flex-row-reverse');
  });

  it('reverses layout when aligned to the end', () => {
    render(
      <Message align="end" data-testid="message">
        Hi
      </Message>,
    );
    const message = screen.getByTestId('message');
    expect(message).toHaveAttribute('data-align', 'end');
    expect(message).toHaveClass('flex-row-reverse');
  });

  it('renders a group wrapper', () => {
    render(
      <Message.Group data-testid="group">
        <Message>One</Message>
        <Message>Two</Message>
      </Message.Group>,
    );
    expect(screen.getByTestId('group')).toHaveClass('flex-col');
  });
});

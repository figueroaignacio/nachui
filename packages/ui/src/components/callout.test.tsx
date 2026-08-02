import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Callout } from './callout';

describe('Callout', () => {
  it('renders the default variant with structured children', () => {
    render(
      <Callout>
        <Callout.Title>Note</Callout.Title>
        <Callout.Content>This is a callout.</Callout.Content>
      </Callout>,
    );

    expect(screen.getByText('Note')).toBeInTheDocument();
    expect(screen.getByText('This is a callout.')).toBeInTheDocument();
    expect(screen.getByRole('note')).toBeInTheDocument();
  });

  it('renders danger variant as a note with default icon', () => {
    const { container } = render(
      <Callout variant="danger">
        <Callout.Title>Error</Callout.Title>
        <Callout.Content>Something went wrong.</Callout.Content>
      </Callout>,
    );

    expect(screen.getByRole('note')).toBeInTheDocument();
    expect(container.querySelector('svg')).not.toBeNull();
  });

  it('allows custom icons through the icon prop', () => {
    render(
      <Callout icon={<span data-testid="custom-icon">Icon</span>}>
        <Callout.Title>Custom</Callout.Title>
        <Callout.Content>Has a custom icon.</Callout.Content>
      </Callout>,
    );

    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
  });
});

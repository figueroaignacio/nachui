import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { expectNoAxeViolations } from '../../test-utils/axe';
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

  it('lets content inherit the tinted variant color at full opacity', () => {
    render(
      <Callout variant="warning">
        <Callout.Content>Heads up.</Callout.Content>
      </Callout>,
    );
    const root = screen.getByRole('note');
    const content = screen.getByText('Heads up.');
    expect(root).toHaveAttribute('data-variant', 'warning');
    expect(root).toHaveClass('text-warning-text');
    expect(content.className).not.toMatch(/\/90/);
    expect(content.className).not.toMatch(/(^|\s)text-muted-foreground/);
  });

  it('only mutes content on the neutral default surface', () => {
    render(
      <Callout>
        <Callout.Content>Neutral.</Callout.Content>
      </Callout>,
    );
    expect(screen.getByRole('note')).toHaveAttribute('data-variant', 'default');
    expect(screen.getByText('Neutral.')).toHaveClass(
      'group-data-[variant=default]/callout:text-muted-foreground',
    );
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <Callout variant="info">
        <Callout.Title>Tip</Callout.Title>
        <Callout.Content>Use the CLI to install.</Callout.Content>
      </Callout>,
    );
    await expectNoAxeViolations(container);
  });
});

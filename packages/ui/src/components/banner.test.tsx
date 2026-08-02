import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Banner } from './banner';

describe('Banner', () => {
  it('renders the default variant with content', () => {
    render(
      <Banner>
        <Banner.Content>
          <Banner.Title>Welcome</Banner.Title>
          <Banner.Description>This is a banner.</Banner.Description>
        </Banner.Content>
      </Banner>,
    );

    expect(screen.getByText('Welcome')).toBeInTheDocument();
    expect(screen.getByText('This is a banner.')).toBeInTheDocument();
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('renders danger variant with alert role', () => {
    render(
      <Banner variant="danger">
        <Banner.Content>
          <Banner.Title>Error</Banner.Title>
        </Banner.Content>
      </Banner>,
    );

    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('renders warning variant with alert role', () => {
    render(
      <Banner variant="warning">
        <Banner.Content>
          <Banner.Title>Warning</Banner.Title>
        </Banner.Content>
      </Banner>,
    );

    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('dismisses when close button is clicked', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    render(
      <Banner onClose={onClose}>
        <Banner.Content>
          <Banner.Title>Dismissible</Banner.Title>
        </Banner.Content>
      </Banner>,
    );

    expect(screen.getByText('Dismissible')).toBeInTheDocument();

    const closeButton = screen.getByRole('button', { name: /dismiss banner/i });
    await user.click(closeButton);

    expect(onClose).toHaveBeenCalledOnce();
  });

  it('renders a custom icon', () => {
    render(
      <Banner icon={<span data-testid="custom-icon">★</span>}>
        <Banner.Content>
          <Banner.Title>Custom</Banner.Title>
        </Banner.Content>
      </Banner>,
    );

    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
  });

  it('renders an action element', () => {
    render(
      <Banner>
        <Banner.Content>
          <Banner.Title>Update</Banner.Title>
        </Banner.Content>
        <Banner.Action href="/changelog">Learn more</Banner.Action>
      </Banner>,
    );

    const action = screen.getByText('Learn more');
    expect(action).toBeInTheDocument();
    expect(action).toHaveAttribute('href', '/changelog');
  });
});

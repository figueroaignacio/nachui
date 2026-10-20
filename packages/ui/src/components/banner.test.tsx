import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as React from 'react';
import { describe, expect, it, vi } from 'vitest';

import { expectNoAxeViolations } from '../../test-utils/axe';
import { Banner } from './banner';

vi.mock('motion/react');

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
    expect(screen.getByRole('region', { name: 'Announcement' })).toBeInTheDocument();
  });

  it('does not use the alert role for static banners, even urgent ones', () => {
    render(
      <Banner variant="danger" label="Billing problem">
        <Banner.Content>
          <Banner.Title>Error</Banner.Title>
        </Banner.Content>
      </Banner>,
    );

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'Billing problem' })).toBeInTheDocument();
  });

  it('opts into the alert role', () => {
    render(
      <Banner variant="warning" role="alert">
        <Banner.Content>
          <Banner.Title>Warning</Banner.Title>
        </Banner.Content>
      </Banner>,
    );

    expect(screen.getByRole('alert')).not.toHaveAttribute('aria-label');
  });

  it('forwards extra props to the root', () => {
    render(
      <Banner data-testid="banner" id="promo" aria-labelledby="promo-title">
        <Banner.Title id="promo-title">Promo</Banner.Title>
      </Banner>,
    );

    const banner = screen.getByTestId('banner');
    expect(banner).toHaveAttribute('id', 'promo');
    expect(screen.getByRole('region', { name: 'Promo' })).toBe(banner);
  });

  it('supports controlled visibility', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();

    function Controlled() {
      const [open, setOpen] = React.useState(true);
      return (
        <>
          <Banner
            open={open}
            onOpenChange={(next) => {
              onOpenChange(next);
              setOpen(next);
            }}
          >
            Controlled
          </Banner>
          <button type="button" onClick={() => setOpen(true)}>
            Show
          </button>
        </>
      );
    }

    render(<Controlled />);
    await user.click(screen.getByRole('button', { name: 'Dismiss banner' }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(screen.queryByText('Controlled')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Show' }));
    expect(screen.getByText('Controlled')).toBeInTheDocument();
  });

  it('starts hidden with defaultOpen false', () => {
    render(<Banner defaultOpen={false}>Hidden</Banner>);
    expect(screen.queryByText('Hidden')).not.toBeInTheDocument();
  });

  it('moves focus to the next control after dismissing', async () => {
    const user = userEvent.setup();
    render(
      <>
        <Banner>Heads up</Banner>
        <button type="button">Next</button>
      </>,
    );

    await user.click(screen.getByRole('button', { name: 'Dismiss banner' }));
    expect(screen.getByRole('button', { name: 'Next' })).toHaveFocus();
  });

  it('falls back to the previous control when nothing follows', async () => {
    const user = userEvent.setup();
    render(
      <>
        <button type="button">Before</button>
        <Banner>Heads up</Banner>
      </>,
    );

    await user.click(screen.getByRole('button', { name: 'Dismiss banner' }));
    expect(screen.getByRole('button', { name: 'Before' })).toHaveFocus();
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

  it('names the dismiss button with dismissLabel', () => {
    render(<Banner dismissLabel="Cerrar aviso">Maintenance tonight</Banner>);
    expect(screen.getByRole('button', { name: 'Cerrar aviso' })).toBeInTheDocument();
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <Banner variant="info">
        <Banner.Content>
          <Banner.Title>Trial ends soon</Banner.Title>
        </Banner.Content>
        <Banner.Action href="/plans">Compare plans</Banner.Action>
      </Banner>,
    );
    await expectNoAxeViolations(container);
  });
});

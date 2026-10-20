import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as React from 'react';
import { describe, expect, it, vi } from 'vitest';

import { expectNoAxeViolations } from '../../test-utils/axe';
import { Breadcrumb } from './breadcrumb';

function RouterLink({
  ref,
  children,
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement> & { ref?: React.Ref<HTMLAnchorElement> }) {
  return (
    <a ref={ref} data-router="" {...props}>
      {children}
    </a>
  );
}

describe('Breadcrumb', () => {
  it('renders complete structure correctly', () => {
    render(
      <Breadcrumb>
        <Breadcrumb.List>
          <Breadcrumb.Item>
            <Breadcrumb.Link href="/">Home</Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Separator />
          <Breadcrumb.Item>
            <Breadcrumb.Page>Components</Breadcrumb.Page>
          </Breadcrumb.Item>
        </Breadcrumb.List>
      </Breadcrumb>,
    );

    const nav = screen.getByRole('navigation', { name: 'breadcrumb' });
    expect(nav).toBeInTheDocument();

    const homeLink = screen.getByRole('link', { name: 'Home' });
    expect(homeLink).toHaveAttribute('href', '/');

    const page = screen.getByText('Components');
    expect(page).toHaveAttribute('aria-current', 'page');
  });

  it('gives the ellipsis a screen reader label', () => {
    render(<Breadcrumb.Ellipsis data-testid="ellipsis" />);
    const ellipsis = screen.getByTestId('ellipsis');
    expect(ellipsis).not.toHaveAttribute('aria-hidden');
    expect(ellipsis).toHaveTextContent('More');
    expect(ellipsis.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
  });

  it('accepts a translated ellipsis label', () => {
    render(<Breadcrumb.Ellipsis label="Más" />);
    expect(screen.getByText('Más')).toHaveClass('sr-only');
  });

  it('merges ref, props and classes into a router link child', async () => {
    const ref = React.createRef<HTMLAnchorElement>();
    const childRef = React.createRef<HTMLAnchorElement>();
    const onClick = vi.fn();
    render(
      <Breadcrumb.Link ref={ref} className="outer" onClick={onClick} aria-label="Go home">
        <RouterLink ref={childRef} href="/" className="inner">
          Home
        </RouterLink>
      </Breadcrumb.Link>,
    );

    const link = screen.getByRole('link', { name: 'Go home' });
    expect(link).toHaveAttribute('data-router');
    expect(link).toHaveClass('outer', 'inner', 'hover:text-foreground');
    expect(link.parentElement?.tagName).not.toBe('SPAN');
    expect(ref.current).toBe(link);
    expect(childRef.current).toBe(link);

    await userEvent.click(link);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('has no axe violations with a collapsed trail', async () => {
    const { container } = render(
      <Breadcrumb>
        <Breadcrumb.List>
          <Breadcrumb.Item>
            <Breadcrumb.Link href="/">Home</Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Separator />
          <Breadcrumb.Item>
            <Breadcrumb.Ellipsis />
          </Breadcrumb.Item>
          <Breadcrumb.Separator />
          <Breadcrumb.Item>
            <Breadcrumb.Page>Components</Breadcrumb.Page>
          </Breadcrumb.Item>
        </Breadcrumb.List>
      </Breadcrumb>,
    );
    await expectNoAxeViolations(container);
  });
});

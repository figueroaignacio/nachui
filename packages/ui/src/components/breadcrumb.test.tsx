import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Breadcrumb } from './breadcrumb';

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

    // Breadcrumb.Page has role="link" but aria-disabled="true"
    const page = screen.getByText('Components');
    expect(page).toHaveAttribute('aria-current', 'page');
  });

  it('renders ellipsis component', () => {
    render(<Breadcrumb.Ellipsis data-testid="ellipsis" />);
    expect(screen.getByTestId('ellipsis')).toBeInTheDocument();
    expect(screen.getByTestId('ellipsis')).toHaveAttribute('aria-hidden', 'true');
  });
});

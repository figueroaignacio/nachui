import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type * as React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { expectNoAxeViolations } from '../../test-utils/axe';
import { NavigationMenu } from './navigation-menu';

vi.mock('motion/react');

function renderMenu() {
  return render(
    <NavigationMenu aria-label="Main">
      <NavigationMenu.Item>
        <NavigationMenu.Trigger>Products</NavigationMenu.Trigger>
        <NavigationMenu.Content>
          <NavigationMenu.Link href="/analytics" title="Analytics" description="Dashboards" />
          <NavigationMenu.Link href="/billing" title="Billing" badge={<span>New</span>} />
        </NavigationMenu.Content>
      </NavigationMenu.Item>
      <a href="/docs">Docs</a>
    </NavigationMenu>,
  );
}

describe('NavigationMenu', () => {
  it('renders a navigation landmark with a collapsed trigger', () => {
    renderMenu();

    expect(screen.getByRole('navigation', { name: 'Main' })).toBeInTheDocument();
    const trigger = screen.getByRole('button', { name: 'Products' });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(trigger).not.toHaveAttribute('aria-controls');
    expect(screen.queryByRole('link', { name: /Analytics/ })).not.toBeInTheDocument();
  });

  it('opens the panel from the trigger and points the trigger at it', async () => {
    const user = userEvent.setup();
    renderMenu();
    const trigger = screen.getByRole('button', { name: 'Products' });

    await user.click(trigger);

    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    const link = screen.getByRole('link', { name: /Analytics/ });
    expect(link).toHaveAttribute('href', '/analytics');
    expect(link).toHaveTextContent('Dashboards');
    expect(document.getElementById(trigger.getAttribute('aria-controls') ?? '')).toContainElement(
      link,
    );

    await user.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('closes on Escape and returns focus to the trigger', async () => {
    const user = userEvent.setup();
    renderMenu();
    const trigger = screen.getByRole('button', { name: 'Products' });

    await user.click(trigger);
    screen.getByRole('link', { name: /Analytics/ }).focus();
    await user.keyboard('{Escape}');

    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(trigger).toHaveFocus();
  });

  it('closes when the pointer goes down outside the item', async () => {
    const user = userEvent.setup();
    renderMenu();

    await user.click(screen.getByRole('button', { name: 'Products' }));
    fireEvent.pointerDown(document.body);

    await waitFor(() =>
      expect(screen.queryByRole('link', { name: /Analytics/ })).not.toBeInTheDocument(),
    );
  });

  it('closes after a link is chosen and still calls its onClick', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn((event: React.MouseEvent) => event.preventDefault());
    render(
      <NavigationMenu>
        <NavigationMenu.Item>
          <NavigationMenu.Trigger>Products</NavigationMenu.Trigger>
          <NavigationMenu.Content>
            <NavigationMenu.Link href="/analytics" title="Analytics" onClick={onClick} />
          </NavigationMenu.Content>
        </NavigationMenu.Item>
      </NavigationMenu>,
    );

    await user.click(screen.getByRole('button', { name: 'Products' }));
    await user.click(screen.getByRole('link', { name: 'Analytics' }));

    expect(onClick).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('button', { name: 'Products' })).toHaveAttribute(
      'aria-expanded',
      'false',
    );
  });

  it('injects the row into a routing link passed with asChild', async () => {
    const user = userEvent.setup();
    const RouterLink = ({ to, children, ...props }: React.ComponentProps<'a'> & { to: string }) => (
      <a data-router="" href={to} {...props}>
        {children}
      </a>
    );
    render(
      <NavigationMenu>
        <NavigationMenu.Item>
          <NavigationMenu.Trigger>Products</NavigationMenu.Trigger>
          <NavigationMenu.Content>
            <NavigationMenu.Link asChild title="Analytics" description="Dashboards">
              <RouterLink to="/analytics" onClick={(event) => event.preventDefault()} />
            </NavigationMenu.Link>
          </NavigationMenu.Content>
        </NavigationMenu.Item>
      </NavigationMenu>,
    );

    await user.click(screen.getByRole('button', { name: 'Products' }));
    const link = screen.getByRole('link', { name: /Analytics/ });

    expect(link).toHaveAttribute('data-router');
    expect(link).toHaveAttribute('href', '/analytics');
    expect(link).toHaveTextContent('Dashboards');

    await user.click(link);
    expect(screen.queryByRole('link', { name: /Analytics/ })).not.toBeInTheDocument();
  });
});

function renderTwoItems() {
  return render(
    <>
      <input aria-label="Search" />
      <NavigationMenu aria-label="Main">
        <NavigationMenu.Item>
          <NavigationMenu.Trigger>Products</NavigationMenu.Trigger>
          <NavigationMenu.Content>
            <NavigationMenu.Link href="/analytics" title="Analytics" />
          </NavigationMenu.Content>
        </NavigationMenu.Item>
        <NavigationMenu.Item>
          <NavigationMenu.Trigger>Resources</NavigationMenu.Trigger>
          <NavigationMenu.Content>
            <NavigationMenu.Link href="/guides" title="Guides" />
          </NavigationMenu.Content>
        </NavigationMenu.Item>
        <a href="/docs">Docs</a>
      </NavigationMenu>
    </>,
  );
}

describe('NavigationMenu shared open state', () => {
  it('keeps only one panel open at a time', async () => {
    const user = userEvent.setup();
    renderTwoItems();
    const products = screen.getByRole('button', { name: 'Products' });
    const resources = screen.getByRole('button', { name: 'Resources' });

    await user.click(products);
    products.focus();
    fireEvent.click(resources);

    expect(resources).toHaveAttribute('aria-expanded', 'true');
    expect(products).toHaveAttribute('aria-expanded', 'false');
    await waitFor(() =>
      expect(screen.queryByRole('link', { name: 'Analytics' })).not.toBeInTheDocument(),
    );
  });

  it('closes when focus tabs out of the item', async () => {
    const user = userEvent.setup();
    renderTwoItems();
    const products = screen.getByRole('button', { name: 'Products' });

    await user.click(products);
    await user.tab();
    expect(screen.getByRole('link', { name: 'Analytics' })).toHaveFocus();
    await user.tab();

    expect(screen.getByRole('button', { name: 'Resources' })).toHaveFocus();
    expect(products).toHaveAttribute('aria-expanded', 'false');
  });

  it('leaves focus alone when Escape is pressed elsewhere', async () => {
    const user = userEvent.setup();
    renderTwoItems();
    const products = screen.getByRole('button', { name: 'Products' });
    const search = screen.getByRole('textbox', { name: 'Search' });

    await user.click(products);
    search.focus();
    await user.keyboard('{Escape}');

    expect(search).toHaveFocus();
  });

  it('ignores Escape already handled by a layer above', async () => {
    const user = userEvent.setup();
    renderTwoItems();
    const products = screen.getByRole('button', { name: 'Products' });
    await user.click(products);

    const event = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true });
    event.preventDefault();
    fireEvent(products, event);

    expect(products).toHaveAttribute('aria-expanded', 'true');
  });

  it('has no axe violations while open', async () => {
    const user = userEvent.setup();
    const { container } = renderTwoItems();
    await user.click(screen.getByRole('button', { name: 'Products' }));
    await expectNoAxeViolations(container);
  });
});

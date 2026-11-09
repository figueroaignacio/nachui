import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { expectNoAxeViolations } from '../../test-utils/axe';
import { Sidebar, useSidebar } from './sidebar';

vi.mock('motion/react');

function HomeGlyph() {
  return <svg aria-hidden="true" />;
}

type ShellProps = Partial<React.ComponentProps<typeof Sidebar.Provider>> & {
  collapsible?: React.ComponentProps<typeof Sidebar>['collapsible'];
};

function Shell({ collapsible, ...props }: ShellProps) {
  return (
    <Sidebar.Provider {...props}>
      <Sidebar collapsible={collapsible} label="Main navigation">
        <Sidebar.Header>Northwind</Sidebar.Header>
        <Sidebar.Content>
          <Sidebar.Group label="Platform">
            <Sidebar.Menu>
              <Sidebar.Item href="/home" icon={<HomeGlyph />}>
                Home
              </Sidebar.Item>
              <Sidebar.Item href="/projects" icon={<HomeGlyph />} active>
                Projects
              </Sidebar.Item>
              <Sidebar.Item icon={<HomeGlyph />} badge={3}>
                Activity
              </Sidebar.Item>
            </Sidebar.Menu>
          </Sidebar.Group>
          <Sidebar.Separator />
          <Sidebar.Group label="Resources" collapsible defaultOpen={false}>
            <Sidebar.Menu>
              <Sidebar.Item href="/docs">Docs</Sidebar.Item>
            </Sidebar.Menu>
          </Sidebar.Group>
        </Sidebar.Content>
        <Sidebar.Footer>Ada Lovelace</Sidebar.Footer>
        <Sidebar.Rail />
      </Sidebar>
      <Sidebar.Inset>
        <Sidebar.Trigger />
        <p>Dashboard</p>
      </Sidebar.Inset>
    </Sidebar.Provider>
  );
}

function mockMatchMedia(matches: boolean) {
  const listeners = new Set<() => void>();
  const original = window.matchMedia;
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    addEventListener: (_: string, listener: () => void) => listeners.add(listener),
    removeEventListener: (_: string, listener: () => void) => listeners.delete(listener),
  }));
  return () => {
    window.matchMedia = original;
  };
}

const sidebarRoot = () => document.querySelector('[data-slot="sidebar"]') as HTMLElement;

describe('Sidebar', () => {
  let restore: (() => void) | undefined;

  afterEach(() => {
    restore?.();
    restore = undefined;
  });

  it('starts expanded and toggles from the trigger', async () => {
    render(<Shell />);
    const trigger = screen.getByRole('button', { name: 'Toggle sidebar' });
    expect(sidebarRoot()).toHaveAttribute('data-state', 'expanded');
    expect(trigger).toHaveAttribute('aria-expanded', 'true');

    await userEvent.click(trigger);
    expect(sidebarRoot()).toHaveAttribute('data-state', 'collapsed');
    expect(sidebarRoot()).toHaveAttribute('data-collapsible', 'offcanvas');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');

    await userEvent.click(trigger);
    expect(sidebarRoot()).toHaveAttribute('data-state', 'expanded');
  });

  it('points aria-controls at the sidebar container', () => {
    render(<Shell />);
    const trigger = screen.getByRole('button', { name: 'Toggle sidebar' });
    const id = trigger.getAttribute('aria-controls');
    expect(id).toBeTruthy();
    expect(document.getElementById(id as string)).toHaveAttribute('data-slot', 'sidebar-container');
  });

  it('makes the offcanvas sidebar inert while collapsed', async () => {
    render(<Shell defaultOpen={false} />);
    const container = document.querySelector('[data-slot="sidebar-container"]');
    expect(container).toHaveAttribute('inert');
    await userEvent.click(screen.getByRole('button', { name: 'Toggle sidebar' }));
    expect(container).not.toHaveAttribute('inert');
  });

  it('supports controlled open state', async () => {
    const onOpenChange = vi.fn();
    function Controlled() {
      const [open, setOpen] = React.useState(true);
      return (
        <Shell
          open={open}
          onOpenChange={(next) => {
            onOpenChange(next);
            setOpen(next);
          }}
        />
      );
    }
    render(<Controlled />);
    await userEvent.click(screen.getByRole('button', { name: 'Toggle sidebar' }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(sidebarRoot()).toHaveAttribute('data-state', 'collapsed');
  });

  it('stays put when controlled and the parent ignores the change', async () => {
    render(<Shell open />);
    await userEvent.click(screen.getByRole('button', { name: 'Toggle sidebar' }));
    expect(sidebarRoot()).toHaveAttribute('data-state', 'expanded');
  });

  it('marks the active item with aria-current', () => {
    render(<Shell />);
    expect(screen.getByRole('link', { name: 'Projects' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('link', { name: 'Home' })).not.toHaveAttribute('aria-current');
    expect(screen.getByRole('button', { name: 'Activity 3' })).toBeInTheDocument();
  });

  it('labels groups and folds collapsible ones', async () => {
    render(<Shell />);
    expect(screen.getByRole('group', { name: 'Platform' })).toBeInTheDocument();
    const resources = screen.getByRole('button', { name: 'Resources' });
    expect(resources).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('link', { name: 'Docs' })).not.toBeInTheDocument();
    await userEvent.click(resources);
    expect(resources).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('link', { name: 'Docs' })).toBeInTheDocument();
  });

  it('keeps labels accessible and shows them in a tooltip when collapsed to icons', async () => {
    render(<Shell collapsible="icon" defaultOpen={false} />);
    expect(sidebarRoot()).toHaveAttribute('data-collapsible', 'icon');
    const projects = screen.getByRole('link', { name: 'Projects' });
    expect(projects).toHaveAttribute('aria-current', 'page');
    expect(screen.queryByText('3')).not.toBeInTheDocument();
    expect(screen.getByText('Platform')).toHaveClass('sr-only');
    expect(screen.getByRole('link', { name: 'Docs' })).toBeInTheDocument();

    act(() => projects.focus());
    const tooltip = await screen.findByRole('tooltip');
    expect(tooltip).toHaveTextContent('Projects');
    expect(projects).toHaveAccessibleDescription('Projects');
  });

  it('does not wrap items in tooltips while expanded', async () => {
    render(<Shell collapsible="icon" />);
    act(() => screen.getByRole('link', { name: 'Projects' }).focus());
    await new Promise((resolve) => setTimeout(resolve, 20));
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('opens a sheet on mobile instead of collapsing', async () => {
    restore = mockMatchMedia(true);
    render(<Shell />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Projects' })).not.toBeInTheDocument();

    const trigger = screen.getByRole('button', { name: 'Toggle sidebar' });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(trigger);

    const dialog = await screen.findByRole('dialog', { name: 'Main navigation' });
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(trigger.getAttribute('aria-controls')).toBe(dialog.id);
    expect(dialog).toHaveAttribute('data-side', 'left');

    await userEvent.click(screen.getByRole('link', { name: 'Home' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  });

  it('opens the mobile sheet from the end side in rtl', async () => {
    restore = mockMatchMedia(true);
    render(
      <div dir="rtl">
        <Sidebar.Provider dir="rtl" defaultOpen>
          <Sidebar>
            <Sidebar.Content />
          </Sidebar>
          <Sidebar.Inset>
            <Sidebar.Trigger />
          </Sidebar.Inset>
        </Sidebar.Provider>
      </div>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Toggle sidebar' }));
    expect(await screen.findByRole('dialog')).toHaveAttribute('data-side', 'right');
  });

  it('toggles with the keyboard shortcut only when one is given', async () => {
    const { unmount } = render(<Shell />);
    await userEvent.keyboard('{Control>}b{/Control}');
    expect(sidebarRoot()).toHaveAttribute('data-state', 'expanded');
    unmount();

    render(<Shell shortcut="mod+b" />);
    await userEvent.keyboard('{Control>}b{/Control}');
    expect(sidebarRoot()).toHaveAttribute('data-state', 'collapsed');
    await userEvent.keyboard('b');
    expect(sidebarRoot()).toHaveAttribute('data-state', 'collapsed');
    await userEvent.keyboard('{Control>}b{/Control}');
    expect(sidebarRoot()).toHaveAttribute('data-state', 'expanded');
  });

  it('toggles from the rail', async () => {
    render(<Shell />);
    const rail = document.querySelector('[data-slot="sidebar-rail"]') as HTMLElement;
    expect(rail).toHaveAttribute('tabindex', '-1');
    await userEvent.click(rail);
    expect(sidebarRoot()).toHaveAttribute('data-state', 'collapsed');
  });

  it('exposes its state through useSidebar', async () => {
    function Status() {
      const { state, toggleSidebar } = useSidebar();
      return (
        <button type="button" onClick={toggleSidebar}>
          {state}
        </button>
      );
    }
    render(
      <Sidebar.Provider>
        <Sidebar>
          <Sidebar.Content />
        </Sidebar>
        <Sidebar.Inset>
          <Status />
        </Sidebar.Inset>
      </Sidebar.Provider>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'expanded' }));
    expect(screen.getByRole('button', { name: 'collapsed' })).toBeInTheDocument();
  });

  it('throws when used outside the provider', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    expect(() => render(<Sidebar.Trigger />)).toThrow(/Sidebar.Provider/);
    spy.mockRestore();
  });

  it('wraps a router link with asChild', () => {
    render(
      <Sidebar.Provider>
        <Sidebar>
          <Sidebar.Menu>
            <Sidebar.Item asChild active icon={<HomeGlyph />}>
              <a href="/settings" className="custom">
                Settings
              </a>
            </Sidebar.Item>
          </Sidebar.Menu>
        </Sidebar>
      </Sidebar.Provider>,
    );
    const link = screen.getByRole('link', { name: 'Settings' });
    expect(link).toHaveAttribute('aria-current', 'page');
    expect(link).toHaveAttribute('data-slot', 'sidebar-menu-button');
    expect(link).toHaveClass('custom');
  });

  it('sets the width variables and lets style override them', () => {
    render(<Shell style={{ '--sidebar-width': '20rem' } as React.CSSProperties} />);
    const wrapper = document.querySelector('[data-slot="sidebar-wrapper"]') as HTMLElement;
    expect(wrapper.style.getPropertyValue('--sidebar-width')).toBe('20rem');
    expect(wrapper.style.getPropertyValue('--sidebar-width-icon')).toBe('3.5rem');
  });

  it('has no axe violations expanded or collapsed to icons', async () => {
    const { container, unmount } = render(<Shell />);
    await expectNoAxeViolations(container);
    unmount();
    const collapsed = render(<Shell collapsible="icon" defaultOpen={false} />);
    await expectNoAxeViolations(collapsed.container);
  });
});

import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { expectNoAxeViolations } from '../../test-utils/axe';
import { SearchCommand, type SearchItem } from './search-command';

const ITEMS: SearchItem[] = [
  { id: 'docs', label: 'Documentation', group: 'Pages', keywords: ['guide'] },
  { id: 'button', label: 'Button', group: 'Components', description: 'Clickable thing' },
  { id: 'dialog', label: 'Dialog', group: 'Components' },
  { id: 'archived', label: 'Archived page', group: 'Pages', disabled: true },
];

describe('SearchCommand', () => {
  it('opens the palette from the trigger', async () => {
    render(<SearchCommand items={ITEMS} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Search' }));
    expect(await screen.findByRole('dialog')).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('opens on the hotkey', async () => {
    render(<SearchCommand items={ITEMS} />);
    fireEvent.keyDown(window, { key: 'k', metaKey: true });
    expect(await screen.findByRole('dialog')).toBeInTheDocument();
  });

  it('filters items by label, description and keywords', async () => {
    render(<SearchCommand items={ITEMS} defaultOpen />);
    const input = await screen.findByRole('combobox');
    await userEvent.type(input, 'guide');
    expect(screen.getByRole('option', { name: /Documentation/ })).toBeInTheDocument();
    expect(screen.queryByRole('option', { name: /Button/ })).not.toBeInTheDocument();
    await userEvent.clear(input);
    await userEvent.type(input, 'clickable');
    expect(screen.getByRole('option', { name: /Button/ })).toBeInTheDocument();
  });

  it('selects the highlighted item on Enter and closes', async () => {
    const onSelect = vi.fn();
    const onItemSelect = vi.fn();
    const items = ITEMS.map((item) =>
      item.id === 'dialog' ? { ...item, onSelect: onItemSelect } : item,
    );
    render(<SearchCommand items={items} defaultOpen onSelect={onSelect} />);
    const input = await screen.findByRole('combobox');
    await userEvent.type(input, 'dia{Enter}');
    expect(onItemSelect).toHaveBeenCalledTimes(1);
    expect(onSelect).toHaveBeenCalledWith(expect.objectContaining({ id: 'dialog' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  });

  it('moves the highlight with the arrow keys', async () => {
    render(<SearchCommand items={ITEMS} defaultOpen />);
    const input = await screen.findByRole('combobox');
    expect(screen.getByRole('option', { name: /Documentation/ })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    await userEvent.type(input, '{ArrowDown}');
    expect(screen.getByRole('option', { name: /Button/ })).toHaveAttribute('aria-selected', 'true');
  });

  it('shows the empty text when nothing matches', async () => {
    render(<SearchCommand items={ITEMS} defaultOpen emptyText="Nothing here" />);
    await userEvent.type(await screen.findByRole('combobox'), 'zzz');
    expect(screen.getByRole('status')).toHaveTextContent('Nothing here');
  });

  it('does not select a disabled item', async () => {
    const onSelect = vi.fn();
    render(<SearchCommand items={ITEMS} defaultOpen onSelect={onSelect} />);
    await screen.findByRole('combobox');
    await userEvent.click(screen.getByRole('option', { name: /Archived page/ }));
    expect(onSelect).not.toHaveBeenCalled();
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('follows the link of an href item on Enter', async () => {
    const onSelect = vi.fn();
    const items: SearchItem[] = [{ id: 'guide', label: 'Guide', href: '#guide' }];
    render(<SearchCommand items={items} defaultOpen onSelect={onSelect} />);
    const input = await screen.findByRole('combobox');
    const link = screen.getByRole('option', { name: 'Guide' });
    const click = vi.fn((event: MouseEvent) => event.preventDefault());
    link.addEventListener('click', click);
    await userEvent.type(input, '{Enter}');
    expect(click).toHaveBeenCalledTimes(1);
    expect(onSelect).toHaveBeenCalledWith(expect.objectContaining({ id: 'guide' }));
  });

  it('names the combobox', async () => {
    render(<SearchCommand items={ITEMS} defaultOpen labels={{ trigger: 'Search docs' }} />);
    expect(await screen.findByRole('combobox', { name: 'Search docs' })).toBeInTheDocument();
  });

  it('ignores the hotkey with Shift, inside fields, or when already handled', () => {
    render(
      <>
        <input aria-label="Other field" />
        <SearchCommand items={ITEMS} />
      </>,
    );
    fireEvent.keyDown(window, { key: 'k', metaKey: true, shiftKey: true });
    fireEvent.keyDown(screen.getByRole('textbox', { name: 'Other field' }), {
      key: 'k',
      ctrlKey: true,
    });
    const handled = new KeyboardEvent('keydown', { key: 'k', ctrlKey: true, cancelable: true });
    handled.preventDefault();
    window.dispatchEvent(handled);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('skips disabled options and supports Home and End', async () => {
    const items: SearchItem[] = [
      { id: 'one', label: 'One' },
      { id: 'two', label: 'Two', disabled: true },
      { id: 'three', label: 'Three' },
    ];
    render(<SearchCommand items={items} defaultOpen />);
    const input = await screen.findByRole('combobox');
    const option = (name: string) => screen.getByRole('option', { name });
    await userEvent.type(input, '{ArrowDown}');
    expect(option('Three')).toHaveAttribute('aria-selected', 'true');
    await userEvent.type(input, '{ArrowUp}');
    expect(option('One')).toHaveAttribute('aria-selected', 'true');
    await userEvent.type(input, '{End}');
    expect(option('Three')).toHaveAttribute('aria-selected', 'true');
    await userEvent.type(input, '{Home}');
    expect(option('One')).toHaveAttribute('aria-selected', 'true');
    expect(input).toHaveAttribute('aria-activedescendant', option('One').id);
  });

  it('announces the empty state outside the listbox', async () => {
    render(<SearchCommand items={ITEMS} defaultOpen />);
    const input = await screen.findByRole('combobox');
    const status = screen.getByRole('status');
    expect(status).toBeEmptyDOMElement();
    await userEvent.type(input, 'zzz');
    expect(screen.getByRole('status')).toBe(status);
    expect(status).toHaveTextContent('No results.');
    expect(status.closest('[role="listbox"]')).toBeNull();
  });

  it('has no axe violations while open', async () => {
    render(<SearchCommand items={ITEMS} defaultOpen />);
    await screen.findByRole('combobox');
    await expectNoAxeViolations(document.body);
  });
});

import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
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
});

import { act, fireEvent, render, screen } from '@testing-library/react';
import * as React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { expectNoAxeViolations } from '../../test-utils/axe';
import { Combobox } from './combobox';
import { Label } from './label';

const frameworks = [
  { value: 'react', label: 'React' },
  { value: 'vue', label: 'Vue' },
  { value: 'svelte', label: 'Svelte' },
  { value: 'solid', label: 'Solid' },
];

type RootProps = Omit<
  Extract<React.ComponentProps<typeof Combobox>, { multiple?: false }>,
  'children'
>;

function Frameworks(props: RootProps) {
  return (
    <>
      <Label htmlFor="framework">Framework</Label>
      <Combobox {...props}>
        <Combobox.Input id="framework" placeholder="Search framework" />
        <Combobox.Content>
          <Combobox.Empty>No results</Combobox.Empty>
          {frameworks.map((framework) => (
            <Combobox.Item key={framework.value} value={framework.value}>
              {framework.label}
            </Combobox.Item>
          ))}
        </Combobox.Content>
      </Combobox>
    </>
  );
}

function input() {
  return screen.getByRole('combobox');
}

function option(name: string) {
  const match = screen
    .getAllByRole('option', { hidden: true })
    .find((element) => element.textContent === name);
  if (!match) throw new Error(`No option named ${name}`);
  return match;
}

function focusInput() {
  act(() => input().focus());
}

function visibleOptions() {
  return screen
    .queryAllByRole('option', { hidden: true })
    .filter((option) => !option.closest('[hidden]'))
    .map((option) => option.textContent);
}

function activeOption() {
  const id = input().getAttribute('aria-activedescendant');
  return id ? document.getElementById(id)?.textContent : null;
}

function type(text: string) {
  fireEvent.change(input(), { target: { value: text } });
}

function key(name: string, init: Partial<KeyboardEventInit> = {}) {
  fireEvent.keyDown(input(), { key: name, ...init });
}

describe('Combobox', () => {
  it('exposes the combobox pattern on the input', () => {
    render(<Frameworks />);
    const field = input();
    expect(field.tagName).toBe('INPUT');
    expect(field).toHaveAttribute('aria-autocomplete', 'list');
    expect(field).toHaveAttribute('aria-expanded', 'false');
    expect(field).not.toHaveAttribute('aria-controls');
  });

  it('opens on focus and names the listbox after the input label', () => {
    render(<Frameworks />);
    fireEvent.focus(input());
    expect(input()).toHaveAttribute('aria-expanded', 'true');
    const listbox = screen.getByRole('listbox', { hidden: true });
    expect(input()).toHaveAttribute('aria-controls', listbox.id);
    expect(listbox).toHaveAttribute('aria-label', 'Framework');
    expect(listbox).not.toHaveAttribute('aria-multiselectable');
  });

  it('does not open on focus when openOnFocus is false', () => {
    render(<Frameworks openOnFocus={false} />);
    fireEvent.focus(input());
    expect(input()).toHaveAttribute('aria-expanded', 'false');
    key('ArrowDown');
    expect(input()).toHaveAttribute('aria-expanded', 'true');
  });

  it('filters by substring ignoring case and accents', () => {
    render(
      <Combobox>
        <Combobox.Input aria-label="Drink" />
        <Combobox.Content>
          <Combobox.Item value="cafe">Café con leche</Combobox.Item>
          <Combobox.Item value="tea">Green tea</Combobox.Item>
        </Combobox.Content>
      </Combobox>,
    );
    type('CAFE');
    expect(visibleOptions()).toEqual(['Café con leche']);
    expect(screen.getByText('Café')).toHaveAttribute('data-slot', 'combobox-item-match');
    type('tea');
    expect(visibleOptions()).toEqual(['Green tea']);
  });

  it('accepts a custom filter', () => {
    render(<Frameworks filter={(text, query) => text.startsWith(query)} />);
    type('S');
    expect(visibleOptions()).toEqual(['Svelte', 'Solid']);
    type('v');
    expect(visibleOptions()).toEqual([]);
  });

  it('shows Empty when nothing matches', () => {
    render(<Frameworks />);
    type('angular');
    expect(visibleOptions()).toEqual([]);
    expect(screen.getByText('No results')).toBeInTheDocument();
    type('vu');
    expect(screen.queryByText('No results')).not.toBeInTheDocument();
  });

  it('moves aria-activedescendant with the arrows and wraps', () => {
    render(<Frameworks />);
    focusInput();
    expect(input()).not.toHaveAttribute('aria-activedescendant');
    key('ArrowDown');
    expect(activeOption()).toBe('React');
    expect(option('React')).toHaveAttribute('data-highlighted');
    key('ArrowDown');
    expect(activeOption()).toBe('Vue');
    key('ArrowUp');
    key('ArrowUp');
    expect(activeOption()).toBe('Solid');
    key('ArrowDown');
    expect(activeOption()).toBe('React');
    expect(input()).toHaveFocus();
  });

  it('opens on ArrowUp at the last option and on Alt+ArrowDown without moving', () => {
    render(<Frameworks openOnFocus={false} />);
    focusInput();
    key('ArrowDown', { altKey: true });
    expect(input()).toHaveAttribute('aria-expanded', 'true');
    expect(input()).not.toHaveAttribute('aria-activedescendant');
    key('Escape');
    key('ArrowUp');
    expect(activeOption()).toBe('Solid');
  });

  it('leaves Home and End to the text cursor', () => {
    render(<Frameworks />);
    focusInput();
    key('ArrowDown');
    key('ArrowDown');
    key('End');
    expect(activeOption()).toBe('Vue');
    key('Home');
    expect(activeOption()).toBe('Vue');
  });

  it('skips disabled items', () => {
    render(
      <Combobox>
        <Combobox.Input aria-label="Plan" />
        <Combobox.Content>
          <Combobox.Item value="free">Free</Combobox.Item>
          <Combobox.Item value="team" disabled>
            Team
          </Combobox.Item>
          <Combobox.Item value="pro">Pro</Combobox.Item>
        </Combobox.Content>
      </Combobox>,
    );
    focusInput();
    key('ArrowDown');
    key('ArrowDown');
    expect(activeOption()).toBe('Pro');
  });

  it('selects the active option with Enter and shows its label', () => {
    const onValueChange = vi.fn();
    render(<Frameworks onValueChange={onValueChange} />);
    focusInput();
    type('sv');
    key('ArrowDown');
    key('Enter');
    expect(onValueChange).toHaveBeenCalledWith('svelte');
    expect(input()).toHaveValue('Svelte');
    expect(input()).toHaveAttribute('aria-expanded', 'false');
    expect(input()).toHaveFocus();
  });

  it('lists every option when the text matches the selection', () => {
    render(<Frameworks defaultValue="vue" />);
    expect(input()).toHaveValue('Vue');
    focusInput();
    expect(visibleOptions()).toEqual(['React', 'Vue', 'Svelte', 'Solid']);
    expect(option('Vue')).toHaveAttribute('aria-selected', 'true');
    key('ArrowDown');
    expect(activeOption()).toBe('Vue');
    key('ArrowDown');
    expect(activeOption()).toBe('Svelte');
  });

  it('starts on the selected option when the arrows open the list', () => {
    render(<Frameworks defaultValue="svelte" openOnFocus={false} />);
    focusInput();
    key('ArrowDown');
    expect(activeOption()).toBe('Svelte');
  });

  it('selects on click without moving focus off the input', () => {
    render(<Frameworks />);
    focusInput();
    const solid = option('Solid');
    expect(fireEvent.mouseDown(solid)).toBe(false);
    fireEvent.mouseMove(solid);
    expect(activeOption()).toBe('Solid');
    fireEvent.click(solid);
    expect(input()).toHaveValue('Solid');
    expect(input()).toHaveFocus();
  });

  it('reverts unfinished text on blur', () => {
    render(<Frameworks defaultValue="react" />);
    focusInput();
    type('Sol');
    fireEvent.blur(input());
    expect(input()).toHaveValue('React');
    expect(input()).toHaveAttribute('aria-expanded', 'false');
  });

  it('clears the selection when the text is erased and the input blurs', () => {
    const onValueChange = vi.fn();
    render(<Frameworks defaultValue="react" onValueChange={onValueChange} />);
    focusInput();
    type('');
    fireEvent.blur(input());
    expect(onValueChange).toHaveBeenCalledWith('');
    expect(input()).toHaveValue('');
  });

  it('closes on the first Escape and clears on the second', () => {
    const onValueChange = vi.fn();
    render(<Frameworks defaultValue="react" onValueChange={onValueChange} />);
    focusInput();
    type('so');
    key('Escape');
    expect(input()).toHaveAttribute('aria-expanded', 'false');
    expect(input()).toHaveValue('so');
    key('Escape');
    expect(input()).toHaveValue('');
    expect(onValueChange).toHaveBeenCalledWith('');
  });

  it('closes when Tab moves on', () => {
    render(<Frameworks />);
    focusInput();
    key('Tab');
    expect(input()).toHaveAttribute('aria-expanded', 'false');
  });

  it('supports a controlled value and input value', () => {
    function Controlled() {
      const [value, setValue] = React.useState('vue');
      const [text, setText] = React.useState('');
      return (
        <>
          <output data-testid="state">{`${value}|${text}`}</output>
          <Frameworks
            value={value}
            onValueChange={setValue}
            inputValue={text}
            onInputValueChange={setText}
          />
          <button type="button" onClick={() => setValue('solid')}>
            Pick Solid
          </button>
        </>
      );
    }
    render(<Controlled />);
    expect(input()).toHaveValue('Vue');
    fireEvent.click(screen.getByRole('button', { name: 'Pick Solid' }));
    expect(input()).toHaveValue('Solid');
    focusInput();
    type('rea');
    key('ArrowDown');
    key('Enter');
    expect(screen.getByTestId('state')).toHaveTextContent('react|React');
  });

  it('keeps a controlled open state', () => {
    const onOpenChange = vi.fn();
    render(<Frameworks open={false} onOpenChange={onOpenChange} />);
    fireEvent.focus(input());
    expect(onOpenChange).toHaveBeenCalledWith(true);
    expect(input()).toHaveAttribute('aria-expanded', 'false');
  });

  it('hides groups without matches and separators while filtering', () => {
    render(
      <Combobox>
        <Combobox.Input aria-label="Language" />
        <Combobox.Content>
          <Combobox.Group>
            <Combobox.Label>Frontend</Combobox.Label>
            <Combobox.Item value="ts">TypeScript</Combobox.Item>
          </Combobox.Group>
          <Combobox.Separator />
          <Combobox.Group>
            <Combobox.Label>Backend</Combobox.Label>
            <Combobox.Item value="go">Go</Combobox.Item>
          </Combobox.Group>
        </Combobox.Content>
      </Combobox>,
    );
    focusInput();
    const [frontend, backend] = screen.getAllByRole('group', { hidden: true });
    const labelId = frontend?.getAttribute('aria-labelledby') ?? '';
    expect(document.getElementById(labelId)).toHaveTextContent('Frontend');
    expect(frontend).not.toHaveAttribute('hidden');
    expect(screen.getByRole('separator', { hidden: true })).toBeInTheDocument();
    type('go');
    expect(frontend).toHaveAttribute('hidden');
    expect(backend).not.toHaveAttribute('hidden');
    expect(screen.queryByRole('separator')).not.toBeInTheDocument();
  });

  describe('multiple', () => {
    function Tags(props: { defaultValue?: string[]; onValueChange?: (value: string[]) => void }) {
      return (
        <Combobox multiple name="tags" {...props}>
          <Combobox.Input aria-label="Tags" placeholder="Add tags" />
          <Combobox.Content>
            {frameworks.map((framework) => (
              <Combobox.Item key={framework.value} value={framework.value}>
                {framework.label}
              </Combobox.Item>
            ))}
          </Combobox.Content>
        </Combobox>
      );
    }

    it('adds chips, keeps the list open and clears the text', () => {
      const onValueChange = vi.fn();
      render(<Tags onValueChange={onValueChange} />);
      focusInput();
      expect(screen.getByRole('listbox', { hidden: true })).toHaveAttribute(
        'aria-multiselectable',
        'true',
      );
      type('re');
      key('ArrowDown');
      key('Enter');
      expect(onValueChange).toHaveBeenLastCalledWith(['react']);
      expect(input()).toHaveValue('');
      expect(input()).toHaveAttribute('aria-expanded', 'true');
      expect(screen.getByRole('button', { name: 'Remove React' })).toHaveAttribute(
        'tabindex',
        '-1',
      );
      expect(option('React')).toHaveAttribute('aria-selected', 'true');
      fireEvent.click(option('Vue'));
      expect(onValueChange).toHaveBeenLastCalledWith(['react', 'vue']);
      expect(input()).not.toHaveAttribute('placeholder');
    });

    it('clears leftover text on blur', () => {
      render(<Tags defaultValue={['vue']} />);
      focusInput();
      type('sol');
      fireEvent.blur(input());
      expect(input()).toHaveValue('');
      expect(screen.getByRole('button', { name: 'Remove Vue' })).toBeInTheDocument();
    });

    it('toggles a chosen option off', () => {
      const onValueChange = vi.fn();
      render(<Tags defaultValue={['vue']} onValueChange={onValueChange} />);
      focusInput();
      fireEvent.click(option('Vue'));
      expect(onValueChange).toHaveBeenLastCalledWith([]);
    });

    it('removes the last chip with Backspace on an empty input', () => {
      const onValueChange = vi.fn();
      render(<Tags defaultValue={['react', 'solid']} onValueChange={onValueChange} />);
      focusInput();
      type('s');
      key('Backspace');
      expect(onValueChange).not.toHaveBeenCalled();
      type('');
      key('Backspace');
      expect(onValueChange).toHaveBeenLastCalledWith(['react']);
      expect(screen.queryByRole('button', { name: 'Remove Solid' })).not.toBeInTheDocument();
    });

    it('removes a chip from its button and keeps focus in the input', () => {
      render(<Tags defaultValue={['react', 'solid']} />);
      focusInput();
      const remove = screen.getByRole('button', { name: 'Remove React' });
      expect(fireEvent.mouseDown(remove)).toBe(false);
      fireEvent.click(remove);
      expect(screen.queryByRole('button', { name: 'Remove React' })).not.toBeInTheDocument();
      expect(input()).toHaveFocus();
    });

    it('submits every value under the name', () => {
      let submitted: string[] = [];
      render(
        <form
          onSubmit={(event) => {
            event.preventDefault();
            submitted = new FormData(event.currentTarget).getAll('tags') as string[];
          }}
        >
          <Tags defaultValue={['react', 'svelte']} />
          <button type="submit">Save</button>
        </form>,
      );
      fireEvent.click(screen.getByRole('button', { name: 'Save' }));
      expect(submitted).toEqual(['react', 'svelte']);
    });
  });

  describe('create', () => {
    function Creatable({
      onCreate,
      multiple,
    }: {
      onCreate: (query: string) => string | void;
      multiple?: boolean;
    }) {
      const items = frameworks.map((framework) => (
        <Combobox.Item key={framework.value} value={framework.value}>
          {framework.label}
        </Combobox.Item>
      ));
      const content = (
        <Combobox.Content>
          <Combobox.Empty>No results</Combobox.Empty>
          {items}
          <Combobox.Create onCreate={onCreate} />
        </Combobox.Content>
      );
      return multiple ? (
        <Combobox multiple>
          <Combobox.Input aria-label="Framework" />
          {content}
        </Combobox>
      ) : (
        <Combobox>
          <Combobox.Input aria-label="Framework" />
          {content}
        </Combobox>
      );
    }

    it('offers to create the text when nothing matches it exactly', () => {
      render(<Creatable onCreate={vi.fn()} />);
      focusInput();
      expect(screen.queryByText(/Create/)).not.toBeInTheDocument();
      type('Re');
      expect(option('Create "Re"')).toBeInTheDocument();
      type('react');
      expect(
        screen.queryByRole('option', { name: /Create/, hidden: true }),
      ).not.toBeInTheDocument();
    });

    it('creates with Enter when Create is the only option', () => {
      const onCreate = vi.fn(() => 'qwik');
      render(<Creatable onCreate={onCreate} multiple />);
      focusInput();
      type('  Qwik ');
      expect(screen.queryByText('No results')).not.toBeInTheDocument();
      key('Enter');
      expect(onCreate).toHaveBeenCalledWith('Qwik');
      expect(input()).toHaveValue('');
      expect(screen.getByRole('button', { name: 'Remove Qwik' })).toBeInTheDocument();
    });

    it('can be reached with the arrows and supports custom text', () => {
      const onCreate = vi.fn();
      render(
        <Combobox>
          <Combobox.Input aria-label="Label" />
          <Combobox.Content>
            <Combobox.Item value="bug">Bug</Combobox.Item>
            <Combobox.Create onCreate={onCreate}>{(query) => `Add label ${query}`}</Combobox.Create>
          </Combobox.Content>
        </Combobox>,
      );
      focusInput();
      type('bu');
      key('ArrowDown');
      key('ArrowDown');
      expect(activeOption()).toBe('Add label bu');
      key('Enter');
      expect(onCreate).toHaveBeenCalledWith('bu');
      expect(input()).toHaveAttribute('aria-expanded', 'false');
    });
  });

  describe('async', () => {
    it('shows every item with filter false and announces the count', () => {
      vi.useFakeTimers();
      try {
        const { rerender } = render(
          <Combobox filter={false} loading>
            <Combobox.Input aria-label="City" />
            <Combobox.Content>
              <Combobox.Item value="lima">Lima</Combobox.Item>
            </Combobox.Content>
          </Combobox>,
        );
        focusInput();
        type('zzz');
        expect(visibleOptions()).toEqual(['Lima']);
        expect(document.querySelector('[data-slot="combobox-loading"]')).toHaveTextContent(
          'Searching...',
        );
        act(() => vi.advanceTimersByTime(600));
        const status = document.querySelector('[data-slot="combobox-status"]');
        expect(status).toHaveTextContent('Searching...');
        rerender(
          <Combobox filter={false} resultsLabel={(count) => `${count} cities`}>
            <Combobox.Input aria-label="City" />
            <Combobox.Content>
              <Combobox.Item value="lima">Lima</Combobox.Item>
              <Combobox.Item value="quito">Quito</Combobox.Item>
            </Combobox.Content>
          </Combobox>,
        );
        expect(document.querySelector('[data-slot="combobox-loading"]')).not.toBeInTheDocument();
        act(() => vi.advanceTimersByTime(200));
        expect(status).toHaveTextContent('Searching...');
        act(() => vi.advanceTimersByTime(400));
        expect(status).toHaveTextContent('2 cities');
      } finally {
        vi.useRealTimers();
      }
    });
  });

  it('submits the single value and blocks empty required forms', () => {
    let submitted: FormDataEntryValue | null = null;
    render(
      <form
        onSubmit={(event) => {
          event.preventDefault();
          submitted = new FormData(event.currentTarget).get('framework');
        }}
      >
        <Frameworks name="framework" defaultValue="solid" required />
        <button type="submit">Save</button>
      </form>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));
    expect(submitted).toBe('solid');
    const hidden = document.querySelector<HTMLInputElement>('input[name="framework"]');
    expect(hidden).toBeRequired();
    expect(hidden).toHaveAttribute('tabindex', '-1');
  });

  it('restores the default value when the form resets', () => {
    render(
      <form>
        <Frameworks name="framework" defaultValue="vue" />
        <button type="reset">Reset</button>
      </form>,
    );
    focusInput();
    key('ArrowDown');
    key('ArrowDown');
    key('Enter');
    expect(input()).toHaveValue('Svelte');
    act(() => {
      screen.getByRole('button', { name: 'Reset' }).closest('form')?.reset();
    });
    expect(input()).toHaveValue('Vue');
  });

  it('clears everything from Combobox.Clear', () => {
    const onValueChange = vi.fn();
    render(
      <Combobox defaultValue="react" onValueChange={onValueChange}>
        <Combobox.Input aria-label="Framework">
          <Combobox.Clear />
        </Combobox.Input>
        <Combobox.Content>
          <Combobox.Item value="react">React</Combobox.Item>
        </Combobox.Content>
      </Combobox>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Clear' }));
    expect(onValueChange).toHaveBeenCalledWith('');
    expect(input()).toHaveValue('');
    expect(screen.queryByRole('button', { name: 'Clear' })).not.toBeInTheDocument();
  });

  it('respects disabled', () => {
    render(<Frameworks disabled />);
    expect(input()).toBeDisabled();
    fireEvent.focus(input());
    key('ArrowDown');
    expect(input()).toHaveAttribute('aria-expanded', 'false');
  });

  it('marks every part with data-slot and data-state', () => {
    render(<Frameworks />);
    focusInput();
    expect(document.querySelector('[data-slot="combobox"]')).toBeInTheDocument();
    expect(document.querySelector('[data-slot="combobox-field"]')).toHaveAttribute(
      'data-state',
      'open',
    );
    const listbox = screen.getByRole('listbox', { hidden: true });
    expect(listbox).toHaveAttribute('data-slot', 'combobox-list');
    expect(listbox.closest('[data-slot="combobox-content"]')).toHaveAttribute('data-state', 'open');
    expect(screen.getAllByRole('option', { hidden: true })[0]).toHaveAttribute(
      'data-slot',
      'combobox-item',
    );
  });

  it('has no axe violations closed, open and filtered', async () => {
    const { container } = render(<Frameworks defaultValue="react" />);
    await expectNoAxeViolations(container);
    focusInput();
    key('ArrowDown');
    await expectNoAxeViolations(document.body);
    type('zzz');
    await expectNoAxeViolations(document.body);
  });

  it('has no axe violations with chips and groups', async () => {
    render(
      <Combobox multiple defaultValue={['ts']}>
        <Combobox.Input aria-label="Languages">
          <Combobox.Clear />
        </Combobox.Input>
        <Combobox.Content>
          <Combobox.Group>
            <Combobox.Label>Frontend</Combobox.Label>
            <Combobox.Item value="ts">TypeScript</Combobox.Item>
          </Combobox.Group>
          <Combobox.Separator />
          <Combobox.Create onCreate={vi.fn()} />
        </Combobox.Content>
      </Combobox>,
    );
    focusInput();
    type('rust');
    await expectNoAxeViolations(document.body);
    type('type');
    await expectNoAxeViolations(document.body);
  });
});

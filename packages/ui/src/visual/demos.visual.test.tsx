import type * as React from 'react';
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { Default as ButtonDefault } from '../demos/button/default';
import { Default as InputDefault } from '../demos/input/default';
import { Default as CalendarDefault } from '../demos/calendar/default';
import { Default as ComboboxDefault } from '../demos/combobox/default';
import { Default as DatePickerDefault } from '../demos/date-picker/default';
import { Default as FormDefault } from '../demos/form/default';
import { Default as InputOtpDefault } from '../demos/input-otp/default';
import { Default as MenubarDefault } from '../demos/menubar/default';
import { Default as NumberFieldDefault } from '../demos/number-field/default';
import { Default as SliderDefault } from '../demos/slider/default';
import { Default as ToggleGroupDefault } from '../demos/toggle-group/default';
import { Default as ToolbarDefault } from '../demos/toolbar/default';
import { Default as SelectDefault } from '../demos/select/default';
import { Default as TabsDefault } from '../demos/tabs/default';

const DEMOS: Array<[string, () => React.JSX.Element]> = [
  ['button', ButtonDefault],
  ['input', InputDefault],
  ['select', SelectDefault],
  ['tabs', TabsDefault],
  ['calendar', CalendarDefault],
  ['combobox', ComboboxDefault],
  ['date-picker', DatePickerDefault],
  ['form', FormDefault],
  ['input-otp', InputOtpDefault],
  ['menubar', MenubarDefault],
  ['number-field', NumberFieldDefault],
  ['slider', SliderDefault],
  ['toggle-group', ToggleGroupDefault],
  ['toolbar', ToolbarDefault],
];

const MODES = [
  { theme: 'light', dir: 'ltr' },
  { theme: 'dark', dir: 'ltr' },
  { theme: 'light', dir: 'rtl' },
] as const;

beforeAll(() => {
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.setSystemTime(new Date('2026-11-09T12:00:00Z'));
});

afterAll(() => {
  vi.useRealTimers();
});

afterEach(() => {
  document.documentElement.classList.remove('dark');
});

describe('demos look the same as their baseline', () => {
  for (const [name, Demo] of DEMOS) {
    for (const mode of MODES) {
      it(`${name} ${mode.theme} ${mode.dir}`, async () => {
        document.documentElement.classList.toggle('dark', mode.theme === 'dark');
        const screen = await render(
          <div
            data-testid="demo"
            dir={mode.dir}
            className="bg-background text-foreground flex w-[560px] p-6"
          >
            <Demo />
          </div>,
        );
        await expect.element(screen.getByTestId('demo')).toMatchScreenshot();
      });
    }
  }
});

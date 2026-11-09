import type * as React from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';
import { Default as ButtonDefault } from '../demos/button/default';
import { Default as InputDefault } from '../demos/input/default';
import { Default as SelectDefault } from '../demos/select/default';
import { Default as TabsDefault } from '../demos/tabs/default';

const DEMOS: Array<[string, () => React.JSX.Element]> = [
  ['button', ButtonDefault],
  ['input', InputDefault],
  ['select', SelectDefault],
  ['tabs', TabsDefault],
];

const MODES = [
  { theme: 'light', dir: 'ltr' },
  { theme: 'dark', dir: 'ltr' },
  { theme: 'light', dir: 'rtl' },
] as const;

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
            className="bg-background text-foreground inline-flex p-6"
          >
            <Demo />
          </div>,
        );
        await expect.element(screen.getByTestId('demo')).toMatchScreenshot();
      });
    }
  }
});

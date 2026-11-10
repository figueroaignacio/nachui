import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';
import { StackTrace } from './stack-trace';

const STACK = `TypeError: Cannot read properties of undefined
    at applyDiscount (src/app/api/checkout/handlers/discounts/total.ts:42:11)`;

describe('StackTrace in a real browser', () => {
  it('keeps the file name and line visible when the path does not fit', async () => {
    const screen = await render(
      <div style={{ width: 320 }}>
        <StackTrace stack={STACK}>
          <StackTrace.Header />
          <StackTrace.Frames />
        </StackTrace>
      </div>,
    );
    const tail = screen.getByText('total.ts:42:11').element() as HTMLElement;
    const folder = screen
      .getByText('src/app/api/checkout/handlers/discounts/')
      .element() as HTMLElement;
    expect(tail.scrollWidth).toBeLessThanOrEqual(tail.clientWidth);
    expect(folder.scrollWidth).toBeGreaterThan(folder.clientWidth);
  });
});

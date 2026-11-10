import { Bubble } from '@repo/ui/components/bubble';
import { Message } from '@repo/ui/components/message';

export function LoginPreview() {
  return (
    <div className="flex w-full max-w-[520px] flex-col gap-3" aria-hidden="true">
      <Message align="end">
        <Message.Content>
          <Bubble>
            <Bubble.Content>
              A billing page with the current plan, usage and invoices.
            </Bubble.Content>
          </Bubble>
        </Message.Content>
      </Message>
      <div className="border-border bg-card flex items-center gap-2.5 rounded-lg border px-3 py-2 text-xs">
        <span className="text-muted-foreground font-mono">writeFile</span>
        <span className="flex-1 truncate font-mono">screens/billing-page.tsx</span>
        <span className="text-success-text">Done</span>
      </div>
      <div className="border-border bg-card overflow-hidden rounded-2xl border shadow-lg">
        <div className="border-border bg-surface-muted flex items-center gap-1.5 border-b px-3.5 py-2.5">
          <span className="bg-input size-2 rounded-full" />
          <span className="bg-input size-2 rounded-full" />
          <span className="bg-input size-2 rounded-full" />
          <span className="text-muted-foreground ms-2 font-mono text-[11px]">billing · v3</span>
        </div>
        <div className="flex flex-col gap-3.5 p-5">
          <span className="font-heading text-xl font-semibold">Billing</span>
          <div className="grid grid-cols-2 gap-2.5">
            <div className="border-border flex flex-col gap-1 rounded-xl border p-3.5">
              <span className="text-muted-foreground text-xs">Plan</span>
              <span className="font-semibold">Pro · $24/mo</span>
            </div>
            <div className="border-border flex flex-col gap-2 rounded-xl border p-3.5">
              <span className="text-muted-foreground text-xs">Seats used</span>
              <span className="bg-muted h-1.5 rounded-full">
                <span className="bg-foreground block h-full w-[62%] rounded-full" />
              </span>
            </div>
          </div>
          <div className="border-border rounded-xl border text-xs">
            <div className="text-muted-foreground border-border grid grid-cols-[1fr_1fr_80px] border-b px-3 py-2">
              <span>Invoice</span>
              <span>Date</span>
              <span>Amount</span>
            </div>
            <div className="border-border grid grid-cols-[1fr_1fr_80px] border-b px-3 py-2">
              <span className="font-mono">INV-0142</span>
              <span>Nov 1</span>
              <span>$24.00</span>
            </div>
            <div className="grid grid-cols-[1fr_1fr_80px] px-3 py-2">
              <span className="font-mono">INV-0131</span>
              <span>Oct 1</span>
              <span>$24.00</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

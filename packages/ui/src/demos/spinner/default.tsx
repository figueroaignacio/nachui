import { Spinner } from '../../components/spinner';

export function Default() {
  return (
    <div className="border-border bg-card flex w-full max-w-sm flex-col items-center gap-3 rounded-xl border px-6 py-10">
      <Spinner />
      <div className="text-center">
        <p className="text-sm font-medium">Loading invoices</p>
        <p className="text-muted-foreground text-xs">Pulling the last 12 months from Stripe.</p>
      </div>
    </div>
  );
}

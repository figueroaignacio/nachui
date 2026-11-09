import { Calendar } from '../../components/calendar';

export function Range() {
  return (
    <Calendar mode="range" numberOfMonths={2} className="border-border bg-card rounded-lg border" />
  );
}

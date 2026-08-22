import { Typography } from '../../components/typography';

export function Default() {
  return (
    <div className="w-full max-w-md">
      <Typography variant="p">
        We moved the checkout service off the shared database last quarter. The migration took three
        weekends and one very long Friday, but read latency at the p95 dropped from 340ms to 90ms
        and the on call rotation stopped getting paged about lock contention.
      </Typography>
    </div>
  );
}

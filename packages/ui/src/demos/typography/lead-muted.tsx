import { Typography } from '../../components/typography';

export function LeadMuted() {
  return (
    <article className="flex w-full max-w-md flex-col gap-3">
      <Typography variant="h3">Rebuilding search on a small budget</Typography>
      <Typography variant="muted">By Lucia Mendez, 6 min read, updated Mar 14</Typography>
      <Typography variant="lead">
        Our old search ran on a managed cluster that cost more than the rest of the stack combined.
        We replaced it with Postgres full text search and kept the results people actually clicked.
      </Typography>
      <Typography variant="large">
        Queries got 40ms slower. The bill went from $1,900 a month to $60.
      </Typography>
    </article>
  );
}

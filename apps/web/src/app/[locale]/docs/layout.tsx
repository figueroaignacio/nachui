import { Sidebar } from '@/features/docs/components/sidebar';
import { Grid } from '@repo/ui/layout/grid';

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <Grid
      columns="1"
      gap="3"
      data-docs-grid
      className="relative lg:grid-cols-[260px_minmax(0,1fr)] xl:grid-cols-[260px_minmax(0,1fr)_210px]"
    >
      <Sidebar />
      {children}
    </Grid>
  );
}

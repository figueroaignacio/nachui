import { GallerySidebar } from '@/features/gallery/components/gallery-sidebar';
import { Grid } from '@repo/ui/layout/grid';

export default function ComponentsLayout({ children }: { children: React.ReactNode }) {
  return (
    <Grid columns="1" gap="3" className="relative lg:grid-cols-[260px_minmax(0,1fr)]">
      <GallerySidebar />
      {children}
    </Grid>
  );
}

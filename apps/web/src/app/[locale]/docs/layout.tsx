import { Sidebar } from '@/features/docs/components/sidebar';
import { getSidebarPreviews } from '@/features/docs/lib/sidebar-previews';
import { ContentRepository } from '@/lib/content-repository';
import { Grid } from '@repo/ui/layout/grid';

interface DocsLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function DocsLayout({ children, params }: DocsLayoutProps) {
  const { locale } = await params;
  const previews = getSidebarPreviews(ContentRepository.getDocs(), locale);

  return (
    <Grid
      columns="1"
      gap="3"
      data-docs-grid
      className="relative pt-6 pb-16 lg:grid-cols-[260px_minmax(0,1fr)] lg:pt-8 lg:pb-24 xl:grid-cols-[260px_minmax(0,1fr)_210px]"
    >
      <Sidebar previews={previews} />
      {children}
    </Grid>
  );
}

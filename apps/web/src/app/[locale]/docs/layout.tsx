import { AiChat } from '@/features/chat/containers/ai-chat';
import { Sidebar } from '@/features/docs/components/sidebar';
import { Grid } from '@repo/ui/layout/grid';

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <Grid
      columns="1"
      gap="3"
      className="relative lg:grid-cols-[260px_1fr] xl:grid-cols-[260px_1fr_210px]"
    >
      <Sidebar />
      {children}
      <AiChat />
    </Grid>
  );
}

import { BlurBackdrop } from '@/components/common/blur-backdrop';
import { AiChat } from '@/features/chat/components/ai-chat';
import { Sidebar } from '@/features/docs/components/sidebar';
import { Grid } from '@repo/ui/layout/grid';

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <Grid columns="1" gap="3" className="relative lg:grid-cols-[260px_1fr_210px]">
      <BlurBackdrop className="h-[520px]" />
      <Sidebar />
      {children}
      <div id="toc-container" />
      <AiChat />
    </Grid>
  );
}

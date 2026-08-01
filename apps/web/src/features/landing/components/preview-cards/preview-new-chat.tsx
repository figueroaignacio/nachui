import { Card } from '@repo/ui/components/card';
import { Input } from '@repo/ui/components/input';
import { Kbd } from '@repo/ui/components/kbd';

export function PreviewNewChat() {
  return (
    <Card>
      <Card.Header compact>
        <Card.Title className="text-sm font-semibold">New Chat</Card.Title>
        <Card.Description className="text-xs">How can I help you today?</Card.Description>
      </Card.Header>
      <Card.Content compact className="mt-4 space-y-6">
        <div className="flex flex-col items-center gap-1.5 py-6 text-center">
          <div className="text-foreground text-sm font-bold">Morning, nachui!</div>
          <p className="text-muted-foreground max-w-52 text-[11px] leading-relaxed">
            What are we working on today? Press send to start a new conversation.
          </p>
        </div>
        <Input
          size="sm"
          placeholder="Ask anything..."
          aria-label="Chat message"
          rightIcon={<Kbd size="sm">⏎</Kbd>}
        />
      </Card.Content>
    </Card>
  );
}

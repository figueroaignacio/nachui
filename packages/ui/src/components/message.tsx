import * as React from 'react';
import { cn } from '../lib/cn';

interface MessageProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: 'start' | 'end';
}

type MessageAvatarProps = React.HTMLAttributes<HTMLDivElement>;
type MessageContentProps = React.HTMLAttributes<HTMLDivElement>;
type MessageHeaderProps = React.HTMLAttributes<HTMLDivElement>;
type MessageFooterProps = React.HTMLAttributes<HTMLDivElement>;
type MessageGroupProps = React.HTMLAttributes<HTMLDivElement>;

const MessageRoot = ({
  className,
  align = 'start',
  ref,
  ...props
}: MessageProps & { ref?: React.Ref<HTMLDivElement> }) => {
  return (
    <div
      ref={ref}
      data-align={align}
      className={cn(
        'group/message flex w-full items-end gap-2',
        align === 'end' && 'flex-row-reverse',
        className,
      )}
      {...props}
    />
  );
};

MessageRoot.displayName = 'Message';

const MessageAvatar = ({
  className,
  ref,
  ...props
}: MessageAvatarProps & { ref?: React.Ref<HTMLDivElement> }) => {
  return <div ref={ref} className={cn('shrink-0 self-end', className)} {...props} />;
};

MessageAvatar.displayName = 'MessageAvatar';

const MessageContent = ({
  className,
  ref,
  ...props
}: MessageContentProps & { ref?: React.Ref<HTMLDivElement> }) => {
  return (
    <div
      ref={ref}
      className={cn(
        'flex max-w-[75%] min-w-0 flex-col items-start gap-1',
        'group-data-[align=end]/message:items-end',
        className,
      )}
      {...props}
    />
  );
};

MessageContent.displayName = 'MessageContent';

const MessageHeader = ({
  className,
  ref,
  ...props
}: MessageHeaderProps & { ref?: React.Ref<HTMLDivElement> }) => {
  return (
    <div
      ref={ref}
      className={cn('text-muted-foreground flex items-baseline gap-2 px-1 text-xs', className)}
      {...props}
    />
  );
};

MessageHeader.displayName = 'MessageHeader';

const MessageFooter = ({
  className,
  ref,
  ...props
}: MessageFooterProps & { ref?: React.Ref<HTMLDivElement> }) => {
  return (
    <div
      ref={ref}
      className={cn('text-muted-foreground flex items-center gap-1 px-1 text-[11px]', className)}
      {...props}
    />
  );
};

MessageFooter.displayName = 'MessageFooter';

const MessageGroup = ({
  className,
  ref,
  ...props
}: MessageGroupProps & { ref?: React.Ref<HTMLDivElement> }) => {
  return <div ref={ref} className={cn('flex w-full flex-col gap-1.5', className)} {...props} />;
};

MessageGroup.displayName = 'MessageGroup';

const Message = Object.assign(MessageRoot, {
  Avatar: MessageAvatar,
  Content: MessageContent,
  Header: MessageHeader,
  Footer: MessageFooter,
  Group: MessageGroup,
});

export { Message };
export type {
  MessageAvatarProps,
  MessageContentProps,
  MessageFooterProps,
  MessageGroupProps,
  MessageHeaderProps,
  MessageProps,
};

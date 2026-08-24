import { useCallback, useState } from 'react';

export function useChatInput(onSubmit: (message: string) => void) {
  const [message, setMessage] = useState('');

  const handleSubmit = useCallback(
    (e?: React.FormEvent) => {
      e?.preventDefault();
      if (message.trim()) {
        onSubmit(message);
        setMessage('');
      }
    },
    [message, onSubmit],
  );

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSubmit();
      }
    },
    [handleSubmit],
  );

  return {
    message,
    setMessage,
    handleSubmit,
    handleKeyPress,
  };
}

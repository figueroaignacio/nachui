import { Cancel01Icon, Search02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
  placeholder?: string;
  inputRef?: React.RefObject<HTMLInputElement | null>;
}

export function SearchInput({
  value,
  onChange,
  onClear,
  onKeyDown,
  placeholder = 'Type a command or search...',
  inputRef,
}: SearchInputProps) {
  return (
    <div className="border-border/40 flex items-center gap-3 border-b px-4 py-3">
      <HugeiconsIcon
        icon={Search02Icon}
        className="text-muted-foreground/60 h-4 w-4 shrink-0"
        aria-hidden="true"
      />
      <input
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        className="text-foreground placeholder:text-muted-foreground/50 flex h-10 w-full bg-transparent text-sm focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
        aria-label="Search documentation"
      />
      {value && (
        <button
          onClick={onClear}
          className="text-muted-foreground/50 hover:text-foreground flex h-5 w-5 shrink-0 cursor-pointer items-center justify-center rounded transition-colors"
          aria-label="Clear search"
        >
          <HugeiconsIcon icon={Cancel01Icon} className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}

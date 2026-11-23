import { SearchIcon } from '@repo/ui/icons/search';
import { XIcon } from '@repo/ui/icons/x';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
  placeholder?: string;
  inputRef?: React.RefObject<HTMLInputElement | null>;
  label: string;
  clearLabel: string;
  listboxId: string;
  activeOptionId?: string;
  expanded: boolean;
  /** How many results the query found; shown only while there is a query. */
  count?: number;
}

export function SearchInput({
  value,
  onChange,
  onClear,
  onKeyDown,
  placeholder = 'Type a command or search...',
  inputRef,
  label,
  clearLabel,
  listboxId,
  activeOptionId,
  expanded,
  count,
}: SearchInputProps) {
  return (
    <div className="bg-well focus-within:ring-ring flex h-13 shrink-0 items-center gap-3 rounded-lg px-4 inset-shadow-sm focus-within:ring-2">
      <SearchIcon className="text-muted-foreground size-4.5 shrink-0" aria-hidden="true" />
      <input
        ref={inputRef}
        type="text"
        role="combobox"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        className="text-foreground placeholder:text-muted-foreground flex h-full w-full min-w-0 bg-transparent text-[17px] outline-none"
        aria-label={label}
        aria-autocomplete="list"
        aria-controls={listboxId}
        aria-expanded={expanded}
        aria-activedescendant={activeOptionId}
      />
      {count !== undefined && (
        <span className="text-muted-foreground shrink-0 font-mono text-xs tabular-nums">
          {count}
        </span>
      )}
      {value && (
        <button
          type="button"
          onClick={onClear}
          className="text-muted-foreground hover:text-foreground focus-visible:ring-ring relative flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors outline-none before:absolute before:-inset-2 focus-visible:ring-2"
          aria-label={clearLabel}
        >
          <XIcon className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}

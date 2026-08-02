'use client';

import {
  ArrowRight01Icon,
  File01Icon,
  Folder01Icon,
  Folder02Icon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import React from 'react';
import { cn } from '../lib/cn';

// --- Types ---

export type GitStatus = 'modified' | 'deleted' | 'added' | 'untracked' | 'renamed' | 'ignored';

// --- Constants (module level) ---

const GIT_STATUS_STYLES: Record<GitStatus, { color: string; letter: string }> = {
  modified: { color: 'text-warning', letter: 'M' },
  deleted: { color: 'text-destructive line-through opacity-70', letter: 'D' },
  added: { color: 'text-success', letter: 'A' },
  untracked: { color: 'text-success', letter: 'U' },
  renamed: { color: 'text-foreground', letter: 'R' },
  ignored: { color: 'text-muted-foreground opacity-50', letter: 'I' },
};

// --- Context ---

interface FilesContextValue {
  openFolders: Set<string>;
  toggleFolder: (path: string) => void;
}

const FilesContext = React.createContext<FilesContextValue | null>(null);

const useFiles = () => {
  const context = React.use(FilesContext);
  if (!context) {
    throw new Error('File components must be used within Files');
  }
  return context;
};

const FolderPathContext = React.createContext<string>('');

// --- Components ---

export type FileProps = {
  name: string;
  className?: string;
  onClick?: () => void;
  status?: GitStatus;
};

const File: React.FC<FileProps> = ({ name, className, onClick, status }) => {
  const statusConfig = status ? GIT_STATUS_STYLES[status] : undefined;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick?.();
    }
  };

  return (
    <div
      role="button"
      aria-label={name}
      tabIndex={0}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      className={cn(
        'flex cursor-pointer items-center space-x-2 rounded px-2 py-1 text-sm transition-colors hover:bg-black/5 active:scale-[0.98] dark:hover:bg-white/5',
        className,
      )}
    >
      <span aria-hidden="true" className={cn('text-muted-foreground', statusConfig?.color)}>
        <HugeiconsIcon icon={File01Icon} className="size-4" size={16} />
      </span>

      <span className={cn('flex-1 truncate', statusConfig?.color)}>{name}</span>

      {statusConfig ? (
        <span className={cn('ml-auto w-4 text-center text-xs font-bold', statusConfig.color)}>
          {statusConfig.letter}
        </span>
      ) : null}
    </div>
  );
};

export type FolderProps = {
  name: string;
  children?: React.ReactNode;
  className?: string;
  path?: string;
  status?: GitStatus;
};

const Folder: React.FC<FolderProps> = ({
  name,
  children,
  className,
  path: externalPath,
  status,
}) => {
  const { openFolders, toggleFolder } = useFiles();
  const parentPath = React.use(FolderPathContext);
  const currentPath = externalPath || (parentPath ? `${parentPath}/${name}` : name);
  const isOpen = openFolders.has(currentPath);
  const hasChildren = React.Children.count(children) > 0;

  const statusConfig = status ? GIT_STATUS_STYLES[status] : undefined;

  const handleToggle = () => {
    if (hasChildren) {
      toggleFolder(currentPath);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (hasChildren && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      toggleFolder(currentPath);
    }
  };

  return (
    <div className={className}>
      <div
        role="button"
        tabIndex={0}
        aria-expanded={hasChildren ? isOpen : undefined}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        className={cn(
          'hover:bg-muted flex items-center rounded px-2 py-1 text-sm font-medium transition-colors active:scale-[0.98]',
          hasChildren && 'cursor-pointer',
        )}
      >
        {hasChildren ? (
          <div className={cn('transition-transform duration-200', isOpen && 'rotate-90')}>
            <HugeiconsIcon
              icon={ArrowRight01Icon}
              className="text-muted-foreground mr-1 size-4 shrink-0"
              size={16}
            />
          </div>
        ) : (
          <span className="w-5" />
        )}

        <div aria-hidden="true" className={cn('text-muted-foreground', statusConfig?.color)}>
          {isOpen ? (
            <HugeiconsIcon icon={Folder02Icon} className="size-4" size={16} />
          ) : (
            <HugeiconsIcon icon={Folder01Icon} className="size-4" size={16} />
          )}
        </div>

        <span className={cn('ml-2 flex-1 truncate', statusConfig?.color)}>{name}</span>

        {statusConfig ? (
          <span className={cn('ml-auto w-4 text-center text-xs font-bold', statusConfig.color)}>
            {statusConfig.letter}
          </span>
        ) : null}
      </div>

      {hasChildren && isOpen && (
        <div className="overflow-hidden">
          <div className="border-border mt-1 ml-2 border-l pl-4">
            <FolderPathContext value={currentPath}>{children}</FolderPathContext>
          </div>
        </div>
      )}
    </div>
  );
};

type FilesProps = {
  defaultValue?: string;
  children: React.ReactNode;
  className?: string;
};

const FilesRoot: React.FC<FilesProps> = ({ children, defaultValue, className }) => {
  const [openFolders, setOpenFolders] = React.useState<Set<string>>(() => {
    if (!defaultValue) return new Set();

    const paths = defaultValue.split('/');
    const fullPaths = new Set<string>();
    let currentPath = '';

    paths.forEach((segment) => {
      currentPath = currentPath ? `${currentPath}/${segment}` : segment;
      fullPaths.add(currentPath);
    });

    return fullPaths;
  });

  const toggleFolder = React.useCallback((path: string) => {
    setOpenFolders((prev) => {
      const next = new Set(prev);
      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }
      return next;
    });
  }, []);

  const contextValue = React.useMemo(
    () => ({ openFolders, toggleFolder }),
    [openFolders, toggleFolder],
  );

  return (
    <FilesContext value={contextValue}>
      <div className={cn('w-full min-w-62.5', className)}>{children}</div>
    </FilesContext>
  );
};

const Files = Object.assign(FilesRoot, {
  Folder,
  File,
});

export { Files };

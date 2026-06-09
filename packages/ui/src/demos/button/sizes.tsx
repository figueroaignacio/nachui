import { Plus, Settings } from 'lucide-react';
import { Button } from '../../components/button';

const basicButtons = [
  { size: 'sm' as const, label: 'Small' },
  { size: 'default' as const, label: 'Default' },
  { size: 'lg' as const, label: 'Large' },
];

const iconButtons = [
  { size: 'sm' as const, label: 'Add small', icon: <Plus className="size-4" /> },
  { size: 'default' as const, label: 'Add default', icon: <Plus className="size-4" /> },
  { size: 'lg' as const, label: 'Add large', icon: <Plus className="size-5" /> },
];

export function Sizes() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-4">
        {basicButtons.map((btn) => (
          <Button key={btn.size} size={btn.size}>
            {btn.label}
          </Button>
        ))}
        <Button size="icon" aria-label="Settings">
          <Settings className="size-4" />
        </Button>
      </div>
      <div className="flex flex-wrap items-center gap-4">
        {iconButtons.map((btn) => (
          <Button key={btn.size} size={btn.size} leftIcon={btn.icon}>
            {btn.label}
          </Button>
        ))}
      </div>
    </div>
  );
}

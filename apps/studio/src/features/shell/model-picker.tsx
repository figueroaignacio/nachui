'use client';

import { ModelSelector } from '@repo/ui/ai/model-selector';
import type { StudioModel } from '@/lib/types';

export function ModelPicker({
  value,
  onValueChange,
  disabled,
}: {
  value: StudioModel;
  onValueChange: (value: StudioModel) => void;
  disabled?: boolean;
}) {
  return (
    <ModelSelector
      value={value}
      onValueChange={(next) => onValueChange(next === 'pro' ? 'pro' : 'flash')}
      disabled={disabled}
    >
      <ModelSelector.Trigger aria-label="Model" />
      <ModelSelector.Content>
        <ModelSelector.Item value="flash" description="Fast, good for most screens">
          Gemini Flash
        </ModelSelector.Item>
        <ModelSelector.Item value="pro" description="Slower, better at big or tricky screens">
          Gemini Pro
        </ModelSelector.Item>
      </ModelSelector.Content>
    </ModelSelector>
  );
}

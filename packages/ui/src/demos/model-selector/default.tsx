'use client';

import { ModelSelector } from '../../ai/model-selector';

export function Default() {
  return (
    <div className="flex items-center gap-1">
      <ModelSelector defaultValue="standard">
        <ModelSelector.Trigger aria-label="Model" />
        <ModelSelector.Content>
          <ModelSelector.Item value="pro" description="Best for hard problems, slower">
            Pro
          </ModelSelector.Item>
          <ModelSelector.Item value="standard" description="Balanced for everyday work">
            Standard
          </ModelSelector.Item>
          <ModelSelector.Item value="lite" description="Fastest, for quick answers" badge="New">
            Lite
          </ModelSelector.Item>
        </ModelSelector.Content>
      </ModelSelector>
      <ModelSelector defaultValue="medium">
        <ModelSelector.Trigger aria-label="Effort" />
        <ModelSelector.Content>
          <ModelSelector.Item value="low" description="Answers right away">
            Low
          </ModelSelector.Item>
          <ModelSelector.Item value="medium" description="Thinks when it helps">
            Medium
          </ModelSelector.Item>
          <ModelSelector.Item value="high" description="Thinks through every step">
            High
          </ModelSelector.Item>
        </ModelSelector.Content>
      </ModelSelector>
    </div>
  );
}

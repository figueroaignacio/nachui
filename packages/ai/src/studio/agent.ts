import { isStepCount, ToolLoopAgent, type InferAgentUIMessage } from 'ai';
import { google, GOOGLE_MODELS } from '../providers.js';
import { buildStudioPrompt } from './prompt.js';
import { createStudioTools, type StudioAgentDeps, type StudioTools } from './tools.js';
import type { StudioWorkspace } from './workspace.js';

export const STUDIO_MODELS = {
  flash: GOOGLE_MODELS.geminiFlash,
  pro: GOOGLE_MODELS.geminiPro,
} as const;

export type StudioModel = keyof typeof STUDIO_MODELS;

export const STUDIO_MAX_STEPS = 24;

export type StudioAgent = ToolLoopAgent<never, StudioTools>;

export function createStudioAgent(options: {
  deps: StudioAgentDeps;
  workspace: StudioWorkspace;
  model?: StudioModel;
}): StudioAgent {
  return new ToolLoopAgent({
    model: google(STUDIO_MODELS[options.model ?? 'flash']),
    instructions: buildStudioPrompt(options.workspace.list()),
    tools: createStudioTools(options.deps, options.workspace),
    stopWhen: isStepCount(STUDIO_MAX_STEPS),
  });
}

export type StudioAgentUIMessage = InferAgentUIMessage<StudioAgent>;

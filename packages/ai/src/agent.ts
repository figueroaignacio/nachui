import { isStepCount, ToolLoopAgent, type InferAgentUIMessage } from 'ai';
import { NACHUI_SYSTEM_PROMPT } from './prompts/system-prompt.js';
import { google, GOOGLE_MODELS } from './providers.js';
import {
  createGetComponentCodeTool,
  type GetComponent,
  type GetComponentCodeTool,
} from './tools/get-component-code-tool.js';
import {
  createSearchKnowledgeBaseTool,
  type SearchKnowledgeBase,
  type SearchKnowledgeBaseTool,
} from './tools/search-knowledge-base-tool.js';

export type NachUITools = {
  searchKnowledgeBase: SearchKnowledgeBaseTool;
  getComponentCode: GetComponentCodeTool;
};

/**
 * Data access the agent's tools run against. The host (the API) provides it,
 * so tool calls never loop back over HTTP.
 */
export type NachUIAgentDeps = {
  searchKnowledgeBase: SearchKnowledgeBase;
  getComponent: GetComponent;
};

export type NachUIAgent = ToolLoopAgent<never, NachUITools>;

export function createNachUITools(deps: NachUIAgentDeps): NachUITools {
  return {
    searchKnowledgeBase: createSearchKnowledgeBaseTool(deps.searchKnowledgeBase),
    getComponentCode: createGetComponentCodeTool(deps.getComponent),
  };
}

export function createNachUIAgent(deps: NachUIAgentDeps): NachUIAgent {
  return new ToolLoopAgent({
    model: google(GOOGLE_MODELS.geminiFlash),
    instructions: NACHUI_SYSTEM_PROMPT,
    tools: createNachUITools(deps),
    onEnd: ({ steps, usage }) => {
      console.log(`Agent finished in ${steps.length} steps. Total tokens: ${usage?.totalTokens}`);
    },
    stopWhen: isStepCount(10),
  });
}

export type NachUIAgentUIMessage = InferAgentUIMessage<NachUIAgent>;

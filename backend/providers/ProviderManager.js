// Provider Manager Engine (Fallback Chain & Unified Invocation)

import { ProviderRegistry } from './ProviderRegistry.js';
import { ResponseFormatter } from './ResponseFormatter.js';
import { ProviderHealthMonitor } from './ProviderHealthMonitor.js';

export class ProviderManager {
  constructor() {
    this.fallbackPriority = ['gemini', 'grok', 'openai', 'claude', 'deepseek', 'mistral', 'ollama', 'mock'];
  }

  async executeMethod(methodName, prompt, options = {}) {
    const startTime = Date.now();
    const preferredProvider = (options.provider || 'mock').toLowerCase();

    // Build fallback chain starting with preferred provider
    const chain = [preferredProvider, ...this.fallbackPriority.filter(p => p !== preferredProvider)];

    let lastError = null;

    for (const providerName of chain) {
      try {
        const provider = ProviderRegistry.getProviderInstance(providerName, options);
        if (typeof provider[methodName] === 'function') {
          const rawResult = await provider[methodName](prompt, options);
          const latencyMs = Date.now() - startTime;

          return ResponseFormatter.format({
            providerName: provider.name,
            agentName: options.agent || 'Coordinator Agent',
            responseBody: typeof rawResult === 'string' ? rawResult : JSON.stringify(rawResult),
            latencyMs,
            tokenCount: Math.round(prompt.length / 4) + 120,
            metadata: { model: provider.model, fallbackTriggered: providerName !== preferredProvider }
          });
        }
      } catch (err) {
        console.warn(`[ProviderManager Fallback] ${providerName} failed: ${err.message}. Trying next in chain...`);
        lastError = err;
      }
    }

    // Ultimate mock fallback guarantee
    const fallbackProvider = ProviderRegistry.getProviderInstance('mock', options);
    const rawResult = await fallbackProvider[methodName](prompt, options);
    return ResponseFormatter.format({
      providerName: 'MockProvider (Ultimate Fallback)',
      agentName: options.agent || 'Coordinator Agent',
      responseBody: typeof rawResult === 'string' ? rawResult : JSON.stringify(rawResult),
      latencyMs: Date.now() - startTime,
      tokenCount: 100,
      metadata: { fallbackTriggered: true, error: lastError?.message }
    });
  }

  getHealth() {
    return ProviderHealthMonitor.getHealthStatus();
  }
}

export const globalProviderManager = new ProviderManager();
export default globalProviderManager;

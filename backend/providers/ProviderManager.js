// Provider Manager Engine (Configurable AI Provider Router & Gemini Integration)

import { ProviderRegistry } from './ProviderRegistry.js';
import { ResponseFormatter } from './ResponseFormatter.js';
import { ProviderHealthMonitor } from './ProviderHealthMonitor.js';

export class ProviderManager {
  constructor() {
    this.activeProviderName = (process.env.AI_PROVIDER || 'gemini').toLowerCase();
  }

  /**
   * Get active AI provider instance
   */
  getProvider(providerName = null) {
    const target = (providerName || this.activeProviderName || 'gemini').toLowerCase();
    return ProviderRegistry.getProviderInstance(target);
  }

  /**
   * Execute provider method with fallback safety
   */
  async executeMethod(methodName, prompt, options = {}) {
    const startTime = Date.now();
    const targetProviderName = (options.provider || this.activeProviderName || 'gemini').toLowerCase();

    // Secondary fallback order
    const chain = [targetProviderName, 'gemini', 'mock'];

    let lastError = null;

    for (const pName of chain) {
      try {
        const provider = ProviderRegistry.getProviderInstance(pName, options);
        if (typeof provider[methodName] === 'function') {
          const rawResult = await provider[methodName](prompt, options);
          const latencyMs = Date.now() - startTime;

          return ResponseFormatter.format({
            providerName: provider.name,
            agentName: options.agent || 'Coordinator Agent',
            responseBody: typeof rawResult === 'string' ? rawResult : JSON.stringify(rawResult),
            latencyMs,
            tokenCount: Math.round((typeof prompt === 'string' ? prompt.length : 100) / 4) + 120,
            metadata: { model: provider.model, fallbackTriggered: pName !== targetProviderName }
          });
        }
      } catch (err) {
        console.warn(`[ProviderManager Fallback] ${pName} failed for ${methodName}: ${err.message}. Trying fallback...`);
        lastError = err;
      }
    }

    // Ultimate mock fallback
    const mockProvider = ProviderRegistry.getProviderInstance('mock', options);
    const rawResult = await mockProvider[methodName](prompt, options);
    return ResponseFormatter.format({
      providerName: 'MockProvider (Fallback)',
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

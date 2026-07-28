// Enterprise Multi-Provider Orchestration & Failover Engine (Primary Provider: Grok)

import axios from 'axios';
import { ProviderRegistry } from './ProviderRegistry.js';
import { ResponseFormatter } from './ResponseFormatter.js';
import { ProviderHealthMonitor } from './ProviderHealthMonitor.js';

export class ProviderManager {
  constructor() {
    this.primaryProvider = (process.env.AI_PRIMARY_PROVIDER || process.env.AI_PROVIDER || 'grok').toLowerCase();
    this.metrics = {
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      fallbackCount: 0,
      providerStats: {}
    };
  }

  /**
   * Parse configured priority list from process.env.AI_PROVIDER_PRIORITY
   */
  getPriorityChain(requestedProvider = null) {
    if (requestedProvider && requestedProvider.toLowerCase() !== 'auto') {
      return [...new Set([requestedProvider.toLowerCase(), 'gemini', 'grok', 'ollama', 'mock'])];
    }

    const envPriority = process.env.AI_PROVIDER_PRIORITY;
    if (envPriority) {
      const parsed = envPriority.split(',').map(p => p.trim().toLowerCase()).filter(Boolean);
      if (parsed.length > 0) return [...new Set([...parsed, 'mock'])];
    }

    return ['gemini', 'grok', 'ollama', 'mock'];
  }

  /**
   * Pre-flight provider health check (API keys, endpoint reachability)
   */
  async checkProviderHealth(providerName) {
    const pName = providerName.toLowerCase();

    switch (pName) {
      case 'gemini':
        if (!process.env.GEMINI_API_KEY) {
          return { healthy: false, reason: 'GEMINI_API_KEY missing in .env' };
        }
        return { healthy: true };

      case 'grok':
        if (!process.env.GROK_API_KEY && !process.env.XAI_API_KEY) {
          return { healthy: false, reason: 'GROK_API_KEY missing in .env' };
        }
        return { healthy: true };

      case 'ollama':
        try {
          const ollamaUrl = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
          await axios.get(`${ollamaUrl}/api/tags`, { timeout: 1200 });
          return { healthy: true };
        } catch (err) {
          return { healthy: false, reason: `Ollama endpoint unreachable (${err.message})` };
        }

      case 'openrouter':
        if (!process.env.OPENROUTER_API_KEY) {
          return { healthy: false, reason: 'OPENROUTER_API_KEY missing in .env' };
        }
        return { healthy: true };

      case 'huggingface':
        if (!process.env.HUGGINGFACE_API_KEY && !process.env.HF_API_KEY) {
          return { healthy: false, reason: 'HUGGINGFACE_API_KEY missing in .env' };
        }
        return { healthy: true };

      case 'openai':
        if (!process.env.OPENAI_API_KEY) {
          return { healthy: false, reason: 'OPENAI_API_KEY missing in .env' };
        }
        return { healthy: true };

      case 'claude':
        if (!process.env.CLAUDE_API_KEY) {
          return { healthy: false, reason: 'CLAUDE_API_KEY missing in .env' };
        }
        return { healthy: true };

      case 'deepseek':
        if (!process.env.DEEPSEEK_API_KEY) {
          return { healthy: false, reason: 'DEEPSEEK_API_KEY missing in .env' };
        }
        return { healthy: true };

      case 'mistral':
        if (!process.env.MISTRAL_API_KEY) {
          return { healthy: false, reason: 'MISTRAL_API_KEY missing in .env' };
        }
        return { healthy: true };

      case 'mock':
        return { healthy: true };

      default:
        return { healthy: true };
    }
  }

  /**
   * Determine if an error is transient and retryable
   */
  isRetryableError(error) {
    if (!error) return false;
    const status = error.response?.status;

    // Non-retryable HTTP statuses (Auth/Missing resource)
    if ([401, 403, 404, 400, 422].includes(status)) {
      return false;
    }

    // Non-retryable message patterns
    const msg = String(error.message || '').toLowerCase();
    if (msg.includes('api key') || msg.includes('unauthorized') || msg.includes('not found') || msg.includes('invalid model')) {
      return false;
    }

    // Retryable statuses: 429 (rate limit), 500, 502, 503, 504, or network codes
    if ([429, 500, 502, 503, 504].includes(status)) return true;
    if (error.code && ['ECONNRESET', 'ETIMEDOUT', 'ECONNREFUSED', 'ENOTFOUND'].includes(error.code)) return true;

    return false;
  }

  /**
   * Get instance of provider
   */
  getProvider(providerName = null) {
    const target = (providerName || this.primaryProvider || 'grok').toLowerCase();
    return ProviderRegistry.getProviderInstance(target);
  }

  /**
   * Execute provider method with multi-provider failover and exponential retry
   */
  async executeMethod(methodName, prompt, options = {}) {
    this.metrics.totalRequests++;
    const startTime = Date.now();
    const chain = this.getPriorityChain(options.provider);

    let lastError = null;

    for (let i = 0; i < chain.length; i++) {
      const pName = chain[i];
      const nextProviderName = chain[i + 1] ? chain[i + 1].toUpperCase() : null;

      console.log(`====================================================`);
      console.log(`Trying Provider: ${pName.toUpperCase()}`);

      // 1. Health Pre-Check
      const health = await this.checkProviderHealth(pName);
      if (!health.healthy) {
        console.log(`Result: Failed`);
        console.log(`Reason: ${health.reason}`);
        if (nextProviderName) {
          console.log(`Switching to ${nextProviderName}...`);
        }
        console.log(`====================================================\n`);
        continue;
      }

      const provider = ProviderRegistry.getProviderInstance(pName, options);

      if (typeof provider[methodName] !== 'function') {
        console.log(`Result: Failed`);
        console.log(`Reason: Method ${methodName} not supported by ${pName}`);
        if (nextProviderName) console.log(`Switching to ${nextProviderName}...`);
        console.log(`====================================================\n`);
        continue;
      }

      // 2. Execution Loop with Exponential Retry for Transient Failures
      const maxRetries = 2;
      let attemptSuccess = false;
      let rawResult = null;

      for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
          if (attempt > 0) {
            const backoffMs = Math.pow(2, attempt) * 300;
            console.log(`[Retry Attempt ${attempt}/${maxRetries}] Retrying ${pName} in ${backoffMs}ms...`);
            await new Promise(r => setTimeout(r, backoffMs));
          }

          rawResult = await provider[methodName](prompt, options);
          attemptSuccess = true;
          break;
        } catch (err) {
          lastError = err;
          console.warn(`[${pName} Attempt ${attempt + 1}] Error: ${err.message}`);

          if (!this.isRetryableError(err) || attempt === maxRetries) {
            break; // Skip further retries for non-transient or maxed-out retries
          }
        }
      }

      // 3. Evaluate Provider Result
      if (attemptSuccess && rawResult !== null) {
        const executionSec = ((Date.now() - startTime) / 1000).toFixed(1);
        console.log(`Result: Success`);
        console.log(`Execution Time: ${executionSec} seconds`);
        console.log(`====================================================\n`);

        this.metrics.successfulRequests++;
        if (i > 0) this.metrics.fallbackCount++;

        // Track provider stats
        this.metrics.providerStats[pName] = (this.metrics.providerStats[pName] || 0) + 1;

        const formatted = ResponseFormatter.format({
          providerName: provider.name,
          agentName: options.agent || 'Coordinator Agent',
          responseBody: typeof rawResult === 'string' ? rawResult : JSON.stringify(rawResult),
          latencyMs: Date.now() - startTime,
          tokenCount: Math.round((typeof prompt === 'string' ? prompt.length : 100) / 4) + 120,
          metadata: { model: provider.model, fallbackTriggered: i > 0 }
        });
        formatted.rawResult = rawResult;
        return formatted;
      } else {
        console.log(`Result: Failed`);
        console.log(`Reason: ${lastError?.message || 'Execution returned null response'}`);
        if (nextProviderName) console.log(`Switching to ${nextProviderName}...`);
        console.log(`====================================================\n`);
      }
    }

    // 4. All Priority Providers Failed
    this.metrics.failedRequests++;
    console.error(`[CRITICAL MULTI-PROVIDER FAILURE] Every provider in chain [${chain.join(', ')}] failed.`);

    throw new Error('AI service is temporarily unavailable. Please try again later.');
  }

  getHealth() {
    return {
      status: 'active',
      primaryProvider: this.primaryProvider,
      metrics: {
        totalRequests: this.metrics.totalRequests,
        successfulRequests: this.metrics.successfulRequests,
        failedRequests: this.metrics.failedRequests,
        successRate: this.metrics.totalRequests > 0 ? `${((this.metrics.successfulRequests / this.metrics.totalRequests) * 100).toFixed(1)}%` : '100%',
        fallbackCount: this.metrics.fallbackCount,
        providerUsage: this.metrics.providerStats
      },
      healthMonitor: ProviderHealthMonitor.getHealthStatus()
    };
  }
}

export const globalProviderManager = new ProviderManager();
export default globalProviderManager;

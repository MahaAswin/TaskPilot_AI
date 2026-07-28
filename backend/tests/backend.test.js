// TaskPilot AI Backend Unit & Health Integration Test Suite

import { ProviderManager } from '../providers/ProviderManager.js';
import { IntentAnalyzer } from '../orchestrator/IntentAnalyzer.js';

describe('TaskPilot AI Backend Core Engines', () => {
  test('IntentAnalyzer extracts multi-agent learning intent', () => {
    const result = IntentAnalyzer.analyze('I want to master Java Spring Boot');
    expect(result.intent).toContain('Learning');
    expect(result.agents.length).toBeGreaterThan(3);
  });

  test('ProviderManager executes fallback chain cleanly', async () => {
    const manager = new ProviderManager();
    const response = await manager.executeMethod('generateText', 'Test Prompt', { provider: 'gemini' });
    expect(response.provider).toBeDefined();
    expect(response.latency).toBeDefined();
  });
});

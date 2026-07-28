// TaskPilot AI Frontend Component Smoke Test Suite

import { PROVIDERS_LIST } from '../constants/aiMockData';
import { SAMPLE_WORKFLOWS } from '../constants/orchestratorMockData';

describe('Frontend Constants & Mock Data Suite', () => {
  test('Registered AI providers list has 8 supported providers', () => {
    expect(PROVIDERS_LIST.length).toBe(8);
    expect(PROVIDERS_LIST.some(p => p.id === 'gemini')).toBe(true);
    expect(PROVIDERS_LIST.some(p => p.id === 'grok')).toBe(true);
  });

  test('Sample Multi-Agent workflows include node positions', () => {
    expect(SAMPLE_WORKFLOWS.length).toBeGreaterThan(0);
    expect(SAMPLE_WORKFLOWS[0].nodes.length).toBeGreaterThan(2);
  });
});

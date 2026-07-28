// Provider Health Monitor Module

export class ProviderHealthMonitor {
  static getHealthStatus() {
    return [
      { name: 'Gemini', status: 'online', latency: '120ms', errorRate: '0.1%', priority: 1 },
      { name: 'Grok', status: 'online', latency: '140ms', errorRate: '0.2%', priority: 2 },
      { name: 'OpenAI', status: 'online', latency: '180ms', errorRate: '0.0%', priority: 3 },
      { name: 'Claude', status: 'online', latency: '160ms', errorRate: '0.1%', priority: 4 },
      { name: 'DeepSeek', status: 'online', latency: '210ms', errorRate: '0.3%', priority: 5 },
      { name: 'Mistral', status: 'online', latency: '190ms', errorRate: '0.2%', priority: 6 },
      { name: 'Ollama (Local)', status: 'online', latency: '45ms', errorRate: '0.0%', priority: 7 },
      { name: 'MockProvider', status: 'online', latency: '5ms', errorRate: '0.0%', priority: 8 }
    ];
  }
}

export default ProviderHealthMonitor;

// Response Formatter Engine: Formats all provider outputs into UnifiedResponse

export class ResponseFormatter {
  static format({ providerName, agentName, responseBody, latencyMs = 250, tokenCount = 150, citations = [], metadata = {}, confidence = 0.95 }) {
    return {
      provider: providerName || 'MockProvider',
      agent: agentName || 'Coordinator Agent',
      tokens: tokenCount,
      latency: `${latencyMs}ms`,
      response: responseBody || '',
      citations: citations.length > 0 ? citations : ['TaskPilot AI Internal RAG Index'],
      metadata: {
        model: metadata.model || 'default',
        version: '1.0.0',
        ...metadata
      },
      confidence,
      timestamp: new Date().toISOString()
    };
  }
}

export default ResponseFormatter;

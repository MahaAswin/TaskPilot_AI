import { globalProviderManager } from '../providers/ProviderManager.js';

export class AIService {
  _normalizeResponse(rawResult) {
    if (!rawResult) {
      return {
        content: '',
        response: '',
        text: '',
        rawResult: null
      };
    }

    let textContent = '';
    if (typeof rawResult === 'string') {
      textContent = rawResult;
    } else if (rawResult.response) {
      textContent = rawResult.response;
    } else if (rawResult.content) {
      textContent = rawResult.content;
    } else if (rawResult.rawResult) {
      textContent = typeof rawResult.rawResult === 'string' ? rawResult.rawResult : JSON.stringify(rawResult.rawResult);
    } else {
      textContent = JSON.stringify(rawResult);
    }

    const normalized = typeof rawResult === 'object' ? { ...rawResult } : {};
    normalized.content = textContent;
    normalized.response = textContent;
    normalized.text = textContent;
    normalized.rawResult = rawResult.rawResult !== undefined ? rawResult.rawResult : rawResult;
    return normalized;
  }

  async chat(messages, options = {}) {
    const prompt = Array.isArray(messages)
      ? messages.map(m => typeof m === 'string' ? m : (m.content || m.text || '')).join('\n')
      : String(messages || '');

    const res = await globalProviderManager.executeMethod('chat', prompt, { agent: 'AIService Chat', ...options });
    return this._normalizeResponse(res);
  }

  async generateText(prompt, options = {}) {
    const res = await globalProviderManager.executeMethod('generateText', prompt, { agent: 'AIService Text', ...options });
    return this._normalizeResponse(res);
  }

  async generateStructuredResponse(prompt, schema = {}, options = {}) {
    return await globalProviderManager.generateStructuredResponse(prompt, schema, options);
  }
}

export const aiService = new AIService();
export default aiService;

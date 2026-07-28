// Orchestration Core: Shared Context Manager

export class ContextManager {
  constructor() {
    this.memory = new Map();
  }

  setContext(sessionId, data) {
    this.memory.set(sessionId, {
      ...(this.memory.get(sessionId) || {}),
      ...data,
      updatedAt: new Date().toISOString()
    });
  }

  getContext(sessionId) {
    return this.memory.get(sessionId) || null;
  }
}

export const globalContextManager = new ContextManager();
export default globalContextManager;

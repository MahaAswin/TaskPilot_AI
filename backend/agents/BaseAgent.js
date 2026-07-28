/**
 * Abstract Base Class representing the interface contract for all TaskPilot sub-agents.
 * All specialized agent extensions must implement compile and execution logic.
 */
class BaseAgent {
  constructor(name, role) {
    if (new.target === BaseAgent) {
      throw new Error("Cannot instantiate abstract BaseAgent class directly.");
    }
    this.name = name;
    this.role = role;
  }

  /**
   * Abstract signature for execution loop.
   * @param {string} prompt - User request query
   * @param {object} context - Session metadata variables
   */
  async execute(prompt, context) {
    throw new Error("Method 'execute(prompt, context)' must be implemented by subclass.");
  }
}

export default BaseAgent;

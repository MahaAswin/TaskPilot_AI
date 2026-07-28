import PlannerAgent from './PlannerAgent.js';
import TaskAgent from './TaskAgent.js';
import KnowledgeAgent from './KnowledgeAgent.js';
import CreativeAgent from './CreativeAgent.js';
import ProductivityCoachAgent from './ProductivityCoachAgent.js';

class AgentRegistry {
  constructor() {
    this.agents = {
      PlannerAgent: new PlannerAgent(),
      TaskAgent: new TaskAgent(),
      KnowledgeAgent: new KnowledgeAgent(),
      CreativeAgent: new CreativeAgent(),
      ProductivityCoachAgent: new ProductivityCoachAgent(),
    };
  }

  getAgent(name) {
    return this.agents[name];
  }

  getAgentDescriptions() {
    return Object.keys(this.agents).map((key) => ({
      name: key,
      description: this.agents[key].getDescription(),
    }));
  }
}

export default new AgentRegistry();

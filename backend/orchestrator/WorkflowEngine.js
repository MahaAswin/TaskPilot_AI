// Orchestration Core: Workflow Engine (Generates Node Graph & Step Plan)

export class WorkflowEngine {
  /**
   * Build execution graph from agent list and intent
   * @param {Array<string>} agents 
   * @param {string} intent 
   * @returns {object} Workflow Graph Nodes & Edges
   */
  static buildGraph(agents = [], intent = '') {
    const nodes = agents.map((agentName, idx) => ({
      id: `node-${idx + 1}`,
      agentId: agentName,
      label: `Execute ${agentName}`,
      status: idx === 0 ? 'completed' : 'pending',
      step: idx + 1,
      position: { x: 50 + idx * 170, y: 100 }
    }));

    return {
      nodes,
      edges: nodes.slice(0, -1).map((n, i) => ({
        id: `edge-${i + 1}`,
        source: n.id,
        target: nodes[i + 1].id
      }))
    };
  }
}

export default WorkflowEngine;

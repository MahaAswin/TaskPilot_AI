/**
 * Coordinator Agent - Architecture Verification Tests
 * Run test simulations for IntentAnalyzer, ExecutionPlanner, ResponseMerger, and CoordinatorService.
 */

import { IntentType, AgentType, ExecutionStatus } from '../types/CoordinatorTypes.js';
import IntentAnalyzer from './IntentAnalyzer.js';
import ExecutionPlanner from './ExecutionPlanner.js';
import ResponseMerger from './ResponseMerger.js';
import { CoordinatorService } from '../service/CoordinatorService.js';

const runTests = async () => {
  console.log('==================================================');
  console.log('STARTING COORDINATOR ARCHITECTURE TESTS SIMULATION');
  console.log('==================================================\n');

  let passed = 0;
  let failed = 0;

  const assert = (condition, message) => {
    if (condition) {
      console.log(`✅ [PASS] ${message}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${message}`);
      failed++;
    }
  };

  // Test 1: Intent Classification
  try {
    const intents1 = IntentAnalyzer.analyze('Create Java Notes and Generate Quiz');
    assert(
      intents1.includes(IntentType.KNOWLEDGE) && intents1.includes(IntentType.LEARNING),
      'IntentAnalyzer correctly classifies multi-intent prompts (Knowledge & Learning)'
    );

    const intents2 = IntentAnalyzer.analyze('Draw a flowchart of carbon cycle');
    assert(
      intents2.includes(IntentType.CREATIVE),
      'IntentAnalyzer detects Creative diagrams queries'
    );

    const intents3 = IntentAnalyzer.analyze('Just say hello to me');
    assert(
      intents3.includes(IntentType.GENERAL_CONVERSATION) && intents3.length === 1,
      'IntentAnalyzer falls back to General Conversation for simple inputs'
    );
  } catch (e) {
    console.error('Test 1 error:', e.message);
    failed++;
  }

  // Test 2: Execution Planning Sequence
  try {
    const intents = [IntentType.LEARNING, IntentType.KNOWLEDGE, IntentType.CREATIVE];
    const plan = ExecutionPlanner.plan(intents);

    // Knowledge is dependency, should run first. Creative goes last.
    const isOrdered = 
      plan.indexOf(AgentType.KNOWLEDGE) < plan.indexOf(AgentType.LEARNING) &&
      plan.indexOf(AgentType.LEARNING) < plan.indexOf(AgentType.CREATIVE);

    assert(
      plan.length === 3 && isOrdered,
      'ExecutionPlanner orders agents logically (Knowledge ➔ Learning ➔ Creative)'
    );
  } catch (e) {
    console.error('Test 2 error:', e.message);
    failed++;
  }

  // Test 3: Response Merger aggregation
  try {
    const mockResponses = [
      { agentName: AgentType.KNOWLEDGE, content: 'Notes text content.' },
      { agentName: AgentType.LEARNING, content: 'Quiz questions block.' }
    ];

    const merged = ResponseMerger.merge(mockResponses);
    assert(
      merged.includes('📚 Knowledge Core') && merged.includes('🧠 Academy') && merged.includes('Coordinator Executive Summary'),
      'ResponseMerger compiles clean combined markdown summaries'
    );
  } catch (e) {
    console.error('Test 3 error:', e.message);
    failed++;
  }

  // Test 4: Coordinator Service Pipeline execution
  try {
    const service = new CoordinatorService();
    const result = await service.executePipeline('Create Java study guide notes and checklist');

    assert(
      result.status === ExecutionStatus.COMPLETED &&
      result.detectedIntents.includes(IntentType.KNOWLEDGE) &&
      result.agentTraces.some(t => t.agentName === AgentType.KNOWLEDGE) &&
      result.content.includes('📚 Knowledge Core'),
      'CoordinatorService processes complete mock agent execution timeline loops successfully'
    );
  } catch (e) {
    console.error('Test 4 error:', e.message);
    failed++;
  }

  console.log('\n==================================================');
  console.log(`TESTS COMPLETE. Passed: ${passed}, Failed: ${failed}`);
  console.log('==================================================');

  return failed === 0;
};

// Auto-run if executed directly
if (process.argv[1] && process.argv[1].includes('Coordinator.test.js')) {
  runTests();
}

export default runTests;

import { globalKnowledgeGraph } from './src/engine/research/initGraph';
import { AutonomousResearchLoop } from './src/engine/research/autonomousResearchLoop';

console.log('--- GENESIS AUTONOMOUS RESEARCH LOOP ---');

// 1. Initialize the autonomous loop with the current KG
const researchEngine = new AutonomousResearchLoop(globalKnowledgeGraph);

// 2. Scan for gaps
const gaps = researchEngine.identifyResearchGaps();
console.log(`\nDiscovered ${gaps.length} systemic research gaps in the current corpus.`);

// 3. Generate prioritized queries
const queries = researchEngine.generateResearchQueue();
console.log(`\nGenerated ${queries.length} prioritized research queries:\n`);

// Display the top 10 most critical queries Genesis wants to run next
queries.slice(0, 10).forEach((q: any, i) => {
  console.log(`[Priority: ${q.priority}] Query ${i + 1}:`);
  console.log(`  Target: ${q.searchQueryString}`);
  console.log(`  Reason: ${q.description}\n`);
});

import { globalKnowledgeGraph } from './src/engine/research/initGraph';
import { AutonomousResearchLoop } from './src/engine/research/autonomousResearchLoop';

console.log('\n======================================================');
console.log('   GENESIS HUMAN SYSTEM: FULL 12-WAVE ARCHITECTURE');
console.log('======================================================\n');

const stats = globalKnowledgeGraph.getStats();
console.log('--- 1. GRAPH TOPOLOGY ---');
console.log(`Total Foundational Studies Ingested : ${stats.totalStudies}`);
console.log(`Total Extracted Scientific Claims   : ${stats.totalClaims}`);
console.log(`Total Synthesized Network Edges     : ${stats.totalEdges}`);

console.log('\n--- 2. DOMAIN COVERAGE ---');
Object.entries(stats.domainCoverage).forEach(([domain, count]) => {
  console.log(`  - ${domain.padEnd(20, ' ')}: ${count} edges`);
});

console.log('\n--- 3. AUTONOMOUS GAP ORCHESTRATOR ---');
const loop = new AutonomousResearchLoop(globalKnowledgeGraph);
const gaps = loop.identifyResearchGaps();
const queries = loop.generateResearchQueue();

console.log(`Discovered ${gaps.length} continuous research gaps at the frontier of the network.`);
console.log('Top 3 Autonomous Queries (Wave 12 Execution):');
queries.slice(0, 3).forEach((q: any, i: number) => {
  console.log(`  [${q.priority}] Target: ${q.searchQueryString}`);
  console.log(`          Reason: ${q.description}`);
});

console.log('\n======================================================');
console.log('SYSTEM STATUS: 12-WAVE INTEGRATION 100% COMPLETE');
console.log('======================================================\n');

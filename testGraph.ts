import { globalKnowledgeGraph } from './src/engine/research/initGraph';

console.log('--- GENESIS KNOWLEDGE GRAPH STATS ---');
console.log(JSON.stringify(globalKnowledgeGraph.getStats(), null, 2));

console.log('\n--- CONTRADICTIONS ---');
const contradictions = globalKnowledgeGraph.getContradictions();
console.log(`Found ${contradictions.length} unresolved contradictions.`);
contradictions.forEach(c => console.log(`- ${c.proposedExplanation}`));

console.log('\n--- MISSING VARIABLES ---');
const missing = globalKnowledgeGraph.getMissingVariables().slice(0, 5);
console.log(`Found ${globalKnowledgeGraph.getMissingVariables().length} missing variables (top 5 shown):`);
missing.forEach(m => console.log(`- ${m.variableName} (mentioned in ${m.mentionCount} studies, priority: ${m.priority})`));

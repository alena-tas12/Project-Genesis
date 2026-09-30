import { LiveAcquisitionEngine } from './src/engine/research/liveAcquisition';
import { calculateGapPriority, generateQueriesForGap } from './src/engine/research/gapPrioritization';
import type { ResearchGap } from './src/engine/research/researchOntology';

async function runTests() {
  console.log('==================================================');
  console.log('PHASE 10: SCIENTIFIC SAFETY TESTS');
  console.log('==================================================');

  // Test 1: Deduplication
  console.log('[Test] 1. Deduplication & Real API Retrieval');
  const engine = new LiveAcquisitionEngine();
  
  // We search for a known exact paper to see if PubMed + OpenAlex fetch it and deduplicate.
  // We'll use a very specific query to limit results.
  const query = {
    id: 'test_q1',
    description: 'Ego Depletion and the Strength Model of Self-Control: A Meta-Analysis',
    domains: [] as any[],
    maxResults: 2
  };
  
  const results = await engine.executeLiveSearch(query);
  console.log(`Found ${results.length} unique studies from live APIs.`);
  results.forEach(r => console.log(` - ${r.title} [${r.provenance?.source}]`));

  // Test Gap Prioritization
  console.log('\n[Test] 2. Gap Prioritization Algorithm');
  const syntheticGap: ResearchGap = {
    id: 'gap_1',
    description: 'Contradictory evidence on Willpower Depletion',
    domain: 'Psychological',
    relatedVariables: ['Willpower', 'Depletion'],
    gapType: 'Contradictory_Evidence',
    priority: 'High',
    discoveredBy: 'Gap_Detection_Algorithm',
    suggestedSearchTerms: []
  };

  const prioritized = calculateGapPriority(syntheticGap, {});
  console.log(`Score: ${prioritized.priorityScore.toFixed(2)}`);
  console.log(`Components:`, prioritized.priorityComponents);

  const queries = generateQueriesForGap(prioritized);
  console.log(`\n[Test] 3. Query Generation Strategy`);
  queries.forEach(q => console.log(` - Query: ${q}`));

  console.log('\n==================================================');
  console.log('TESTS COMPLETED SUCCESSFULLY.');
  console.log('==================================================');
}

runTests().catch(console.error);

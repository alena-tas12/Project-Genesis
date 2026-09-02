/**
 * Project Genesis — Knowledge Graph Initialization
 * 
 * Ingests the real seed corpus into the Knowledge Graph and exposes it.
 */

import { GenesisKnowledgeGraph } from './knowledgeGraph';
import { SLEEP_COGNITION_CORPUS } from './seedCorpus';
import { WAVE_2_CORPUS } from './wave2Corpus';
import { WAVES_3_12_CORPUS } from './waves3to12Corpus';
import { GAP_DRIVEN_CORPUS_1 } from './gapDrivenCorpus';
import { ingestManualStudies } from './researchAcquisition';

export const globalKnowledgeGraph = new GenesisKnowledgeGraph();

export function initializeKnowledgeGraph() {
  const fullStudies = ingestManualStudies([
    ...SLEEP_COGNITION_CORPUS, 
    ...WAVE_2_CORPUS, 
    ...WAVES_3_12_CORPUS,
    ...GAP_DRIVEN_CORPUS_1
  ]);
  globalKnowledgeGraph.addStudies(fullStudies);
}

// Call this once on startup
initializeKnowledgeGraph();

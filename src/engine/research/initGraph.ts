/**
 * Project Genesis — Knowledge Graph Initialization
 * 
 * Ingests the real seed corpus into the Knowledge Graph and exposes it.
 */

import { GenesisKnowledgeGraph } from './knowledgeGraph';
import { SLEEP_COGNITION_CORPUS } from './seedCorpus';
import { WAVE_2_CORPUS } from './wave2Corpus';
import { ingestManualStudies } from './researchAcquisition';

export const globalKnowledgeGraph = new GenesisKnowledgeGraph();

export function initializeKnowledgeGraph() {
  const fullStudies = ingestManualStudies([...SLEEP_COGNITION_CORPUS, ...WAVE_2_CORPUS]);
  globalKnowledgeGraph.addStudies(fullStudies);
}

// Call this once on startup
initializeKnowledgeGraph();

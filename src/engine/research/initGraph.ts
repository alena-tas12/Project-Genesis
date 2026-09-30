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

  // Unify the graphs: inject the synthesized knowledge edges into the Canonical State
  import('../core/GenesisCore').then((module) => {
    const core = module.GenesisCore.getInstance();
    // Wait a tick for async load
    setTimeout(() => {
      if (core.activeKnowledgeGraph.length === 0) {
        const edges = Array.from(globalKnowledgeGraph.edges.values());
        core.activeKnowledgeGraph = edges;
        console.log(`[InitGraph] Successfully injected ${edges.length} empirical edges into GenesisCore Canonical State.`);
        core.saveState();
      } else {
        console.log(`[InitGraph] GenesisCore already has ${core.activeKnowledgeGraph.length} edges. Skipping injection.`);
      }
    }, 1000);
  }).catch((err) => {
    console.warn(`[InitGraph] Could not inject into GenesisCore. (May be running in browser without backend).`, err);
  });
}

// Call this once on startup
initializeKnowledgeGraph();

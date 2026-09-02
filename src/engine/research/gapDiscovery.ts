import type { Study, ResearchGap, GapType } from './researchOntology';
import { GenesisCore } from '../core/GenesisCore';
import type { ResearchMemory } from './researchMemory';

export class GapDiscoveryEngine {
  private memory: ResearchMemory;

  constructor(memory: ResearchMemory) {
    this.memory = memory;
  }

  public setupValidationListener() {
    const core = GenesisCore.getInstance();
    core.eventBus.subscribe('VALIDATION_FAILED', async (event) => {
      const { modelId, failures } = event.payload;
      console.log(`[GapDiscoveryEngine] Received VALIDATION_FAILED for ${modelId}. Translating to research gap...`);
      
      // Instead of an LLM call, we generate a gap heuristically based on the failure
      const response = {
        id: `gap_auto_${Date.now()}`,
        description: `Investigate missing moderators or non-linear effects to explain why ${modelId} failed: ${failures[0]}`,
        domain: 'Interdisciplinary',
        relatedVariables: [],
        gapType: 'Contradiction_Resolution',
        priority: 'High',
        discoveredBy: 'Validation_Falsification_Cascade',
        status: 'UNADDRESSED',
        dateIdentified: new Date().toISOString()
      };

      try {
        // We will just queue it via EventBus so the Sync Engine can pick it up
        await core.eventBus.publish({
          id: `gap_${Date.now()}`,
          type: 'RESEARCH_GAP_QUEUED',
          timestamp: new Date().toISOString(),
          payload: { reason: `Validation falsified model: ${failures[0]}`, generatedGap: response }
        });
      } catch (err) {
        console.error('[GapDiscoveryEngine] Failed to generate gap from validation failure', err);
      }
    });
  }

  discoverGapsFromCorpus(corpus: Study[]): ResearchGap[] {
    const gaps: ResearchGap[] = [];
    let gapCounter = 1;

    // A real implementation would run graph algorithms or LLM over the nodes.
    // For this bounded autonomy test, we use heuristics on the actual study data.

    // 1. Weak Evidence / Causal Insufficiency
    corpus.forEach(study => {
      // If study is observational but makes a claim about two variables without mediators
      if ((study.studyDesign?.toLowerCase().includes('observational')) && study.variablesStudied && study.variablesStudied.length >= 2) {
        gaps.push({
          id: `gap_auto_${gapCounter++}`,
          description: `Identify causal mechanisms or randomized trials linking ${study.variablesStudied[0]} and ${study.variablesStudied[1]} (currently limited by observational design).`,
          domain: 'Cognitive',
          relatedVariables: [study.variablesStudied[0], study.variablesStudied[1]],
          gapType: 'Weak_Evidence',
          priority: 'Medium',
          discoveredBy: 'Gap_Detection_Algorithm',
          suggestedSearchTerms: [`${study.variablesStudied[0]} AND ${study.variablesStudied[1]} AND (RCT OR experimental)`]
        });
      }

      // 2. Missing Moderators 
      // If a study has mixed results or mentions "variance"
      if (study.effectDescription?.toLowerCase().includes('varies') || study.effectDescription?.toLowerCase().includes('individual differences')) {
         gaps.push({
          id: `gap_auto_${gapCounter++}`,
          description: `Identify missing moderators for ${study.variablesStudied.join(' - ')} causing variance in outcomes.`,
          domain: 'Cognitive',
          relatedVariables: study.variablesStudied,
          gapType: 'Missing_Moderator',
          priority: 'High',
          discoveredBy: 'Gap_Detection_Algorithm',
          suggestedSearchTerms: [...study.variablesStudied, 'moderator OR individual differences']
        });
      }
    });

    // 3. Cross-Domain Integration
    // Find variables across different domains (e.g. Physiological and Cognitive)
    const physioVars = corpus.filter(s => s.domain === 'Physiological').flatMap(s => s.variablesStudied);
    const cogVars = corpus.filter(s => s.domain === 'Cognitive').flatMap(s => s.variablesStudied);
    
    if (physioVars.length > 0 && cogVars.length > 0) {
       // Just taking the first unique ones as an example
       const p = physioVars.find(v => v);
       const c = cogVars.find(v => v);
       if (p && c) {
         gaps.push({
            id: `gap_auto_${gapCounter++}`,
            description: `Cross-domain integration required: explore the physiological mechanism of ${p} on cognitive construct ${c}.`,
            domain: 'Complex_Systems',
            relatedVariables: [p, c],
            gapType: 'Cross_Domain_Integration',
            priority: 'High',
            discoveredBy: 'Gap_Detection_Algorithm',
            suggestedSearchTerms: [`${p} AND ${c} AND mechanism`]
         });
       }
    }

    // Return unique gaps
    const uniqueGaps = Array.from(new Map(gaps.map(g => [g.description, g])).values());
    return uniqueGaps;
  }
}

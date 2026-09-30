import { GenesisCore } from '../core/GenesisCore';
import { LlmExtractionEngine } from './LlmExtractionEngine';
import { ResearchMemory } from './ResearchMemory';
import { Edge } from '../types';

export class AutonomousResearchEngine {
  private core: GenesisCore;
  private memory: ResearchMemory;

  constructor() { 
      this.core = GenesisCore.getInstance(); 
      this.memory = new ResearchMemory();
  }

  private async fetchEuropePMC(query: string) {
    const url = 'https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=' + encodeURIComponent(query) + '&format=json&resultType=core';
    const response = await fetch(url, { signal: AbortSignal.timeout(30000) });
    if (!response.ok) throw new Error('HTTP ' + response.status);
    const data = await response.json();
    
    for (const res of data.resultList.result) {
        if (res.abstractText && res.abstractText.length > 100 && /\b\d+(\.\d+)?\b/.test(res.abstractText)) {
            return { doi: res.doi || res.id, title: res.title, abstract: res.abstractText };
        }
    }
    throw new Error('No works found with valid numeric abstracts for query: ' + query);
  }

  private adaptStrategy(failedQuery: string, failureReason: string): string {
      console.log(`[STRATEGY ENGINE] Diagnosing failure: ${failureReason}`);
      
      let newQuery = failedQuery;
      if (failureReason.includes('LLM could not extract valid baseline mean and standard deviation')) {
          console.log(`[STRATEGY ENGINE] Adaptation: Forcing explicit statistical terms in search.`);
          newQuery = failedQuery + ' "mean" "standard deviation"';
      } else if (failureReason.includes('No works found with valid numeric abstracts')) {
          console.log(`[STRATEGY ENGINE] Adaptation: Broadening search, removing strict constraints.`);
          newQuery = failedQuery.split(' ').slice(0, 3).join(' ') + ' meta-analysis';
      } else if (failureReason.includes('SOURCE_VERIFICATION_FAILED')) {
          console.log(`[STRATEGY ENGINE] Adaptation: AI hallucinated due to complex abstract. Searching for simpler empirical RCTs.`);
          newQuery = failedQuery + ' "randomized controlled trial" "results showed"';
      } else {
          newQuery = failedQuery + ' empirical study';
      }
      return newQuery;
  }

  public async executeAutonomousLoop() {
    console.log('\n=============================================================');
    console.log(' ?? GENESIS AUTONOMOUS RESEARCH ENGINE - LIVE CYCLE');
    console.log('=============================================================\n');

    await this.core.loadStateAsync();
    
    // Check if there are active gaps to research, else create a default one
    let targetConcept = 'baseline_psychomotor_vigilance';
    let baseQuery = 'psychomotor vigilance reaction time healthy adults';
    
    if (this.core.activeGaps.length > 0) {
        const gap = this.core.activeGaps[0];
        targetConcept = gap.targetNodeId || gap.id;
        baseQuery = gap.description || targetConcept.replace(/_/g, ' ');
        console.log(`[AUTONOMY] Detected Research Gap: ${targetConcept}`);
    } else {
        console.log(`[AUTONOMY] No active gaps. Generating hypothetical gap to test engine...`);
        this.core.activeGaps.push({ id: 'gap_auto_1', type: 'Missing_Parameter', description: baseQuery, targetNodeId: targetConcept, severity: 'HIGH' });
    }

    let activeQuery = this.memory.getBestStrategy(targetConcept, baseQuery);
    
    let retries = 0;
    let maxRetries = 2;
    let controlDoc: any = null;
    let baselineData: any = null;
    let finalStatus = 'BLOCKED';
    let lastError = '';

    while (retries <= maxRetries) {
        console.log(`\n? ATTEMPT ${retries + 1}: Querying EuropePMC for [${targetConcept}]`);
        console.log(`  [Query Strategy]: "${activeQuery}"`);
        
        try {
            controlDoc = await this.fetchEuropePMC(activeQuery);
            console.log('  [?] Retrieved Source: ' + controlDoc.title);
            
            console.log('  [+] Attempting LLM extraction...');
            const claims = await LlmExtractionEngine.extractClaims(controlDoc.doi, controlDoc.abstract, 'Baseline', 'Reaction_Time', 'BASELINE');
            baselineData = claims[0];
            
            if (baselineData.mean === null || baselineData.sd === null) {
                throw new Error('LLM could not extract valid baseline mean and standard deviation from the source text.');
            }

            console.log('  [?] Validated Extraction: Mean = ' + baselineData.mean + ', SD = ' + baselineData.sd);
            
            console.log('  [MEMORY] Persisting successful strategy to knowledge base.');
            this.memory.recordAttempt(targetConcept, baseQuery, activeQuery, null, true);
            
            console.log('  [KNOWLEDGE UPDATE] Injecting extracted parameter into GenesisCore Knowledge Graph...');
            const newEdge: Edge = {
                id: 'edge_auto_' + Date.now(),
                source: 'Baseline_State',
                target: targetConcept,
                type: 'CAUSES',
                weight: baselineData.mean,
                evidence: {
                    type: 'EMPIRICAL',
                    sources: [controlDoc.doi],
                    confidence: 0.9,
                    description: baselineData.statement
                }
            };
            this.core.activeKnowledgeGraph.push(newEdge);
            if (this.core.persistStateAsync) await this.core.persistStateAsync(); // Save graph
            
            // Resolve the gap
            this.core.activeGaps = this.core.activeGaps.filter(g => g.targetNodeId !== targetConcept);
            
            finalStatus = 'VALIDATED';
            break; 
            
        } catch (e: any) {
            lastError = e.message;
            console.log(`  [?] Attempt ${retries + 1} Failed: ${lastError}`);
            
            if (retries < maxRetries) {
                const adaptedQuery = this.adaptStrategy(activeQuery, lastError);
                this.memory.recordAttempt(targetConcept, baseQuery, activeQuery, lastError, false);
                activeQuery = adaptedQuery;
                console.log(`  [?] Retrying with new strategy...`);
            } else {
                console.log('  [!] Max retries reached. Halting to prevent infinite loop.');
                this.memory.recordAttempt(targetConcept, baseQuery, activeQuery, lastError, false);
            }
        }
        retries++;
    }

    return {
        status: finalStatus,
        trace: {
            concept: targetConcept,
            finalQueryUsed: activeQuery,
            sourceRetrieved: controlDoc ? controlDoc.doi : null,
            failureReason: finalStatus === 'VALIDATED' ? null : lastError,
            attempts: retries + (finalStatus === 'VALIDATED' ? 1 : 0),
            extractedData: baselineData
        }
    };
  }
}




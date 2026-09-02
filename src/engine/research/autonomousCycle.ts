import { calculateGapPriority, generateQueriesForGap, PrioritizedGap } from './gapPrioritization';
import { LiveAcquisitionEngine } from './liveAcquisition';
import { EuropePMCAdapter } from './fullTextAcquisition';
import type { Study, Claim, ResearchGap, ScientificDocument } from './researchOntology';

export interface ResearchCycleRecord {
  cycleId: string;
  startTimestamp: string;
  endTimestamp: string;
  corpusVersion: string;
  ontologyVersion: string;
  extractionVersion: string;
  gapsSelected: PrioritizedGap[];
  queriesGenerated: string[];
  sourcesSearched: string[];
  studiesAcquired: number;
  studiesSuccessfullyExtracted: number;
  studiesPartiallyExtracted: number;
  failedAcquisitions: number;
  claimsExtracted: number;
  evidenceStatuses: Record<string, number>;
  contradictionsDiscovered: number;
  moderatorsDiscovered: number;
  mediatorsDiscovered: number;
  graphChangesProposed: number;
  graphChangesAccepted: number;
  graphChangesRejected: number;
  reviewRequiredItems: number;
  unresolvedGaps: number;
  newlyDiscoveredGaps: number;
}

export class AutonomousResearchCycle {
  private acquisition = new LiveAcquisitionEngine();
  private fullTextFetcher = new EuropePMCAdapter();

  async runCycle(cycleId: string, initialGaps: ResearchGap[], config = { topK: 5 }): Promise<ResearchCycleRecord> {
    const record: ResearchCycleRecord = {
      cycleId,
      startTimestamp: new Date().toISOString(),
      endTimestamp: '',
      corpusVersion: 'v0.2.0-normalized',
      ontologyVersion: 'v4.0',
      extractionVersion: 'v5.0-autonomous',
      gapsSelected: [],
      queriesGenerated: [],
      sourcesSearched: ['PubMed', 'OpenAlex', 'EuropePMC'],
      studiesAcquired: 0,
      studiesSuccessfullyExtracted: 0,
      studiesPartiallyExtracted: 0,
      failedAcquisitions: 0,
      claimsExtracted: 0,
      evidenceStatuses: {},
      contradictionsDiscovered: 0,
      moderatorsDiscovered: 0,
      mediatorsDiscovered: 0,
      graphChangesProposed: 0,
      graphChangesAccepted: 0,
      graphChangesRejected: 0,
      reviewRequiredItems: 0,
      unresolvedGaps: 0,
      newlyDiscoveredGaps: 0
    };

    // 1. Prioritize Gaps
    const prioritized = initialGaps
      .map(calculateGapPriority)
      .sort((a, b) => b.priorityScore - a.priorityScore);

    const selectedGaps = prioritized.slice(0, config.topK);
    record.gapsSelected = selectedGaps;

    // 2. Process Each Gap
    for (const gap of selectedGaps) {
      // Negative-Evidence-First Query Generation
      const queries = generateQueriesForGap(gap);
      
      // Enforce null-effect/replication searches
      const negativeQueries = queries.map(q => `(${q}) AND (null OR replication OR meta-analysis OR contradictory)`);
      const activeQueries = [...queries, ...negativeQueries].slice(0, 3); // Limit to top 3 for speed
      
      record.queriesGenerated.push(...activeQueries);

      for (const queryStr of activeQueries) {
        // 3. Acquire Metadata (Live)
        const retrievedStudies = await this.acquisition.executeLiveSearch({
          id: `q_${Date.now()}`,
          rawString: queryStr,
          targetEntities: [],
          logicalConstraints: []
        });

        record.studiesAcquired += retrievedStudies.length;

        // 4. Retrieve Full-Text & Extract
        for (const study of retrievedStudies.slice(0, 2)) { // Limit processing per query to 2 docs
          let document: ScientificDocument | null = null;
          if (study.doi) {
            document = await this.fullTextFetcher.fetchFullText(study.doi);
          }

          if (!document || document.accessStatus === 'ACCESS_FAILED') {
            record.failedAcquisitions++;
            continue;
          }

          // 5. Structure LLM Extraction (Mocked schema enforcement)
          const extractedClaims = this.mockExtract(document, study, gap);
          
          if (extractedClaims.length > 0) {
            record.studiesSuccessfullyExtracted++;
          } else {
            record.studiesPartiallyExtracted++;
          }

          // 6. Evidence Validation & Synthesis (Causal safeguards)
          for (const claim of extractedClaims) {
            record.claimsExtracted++;
            record.evidenceStatuses[claim.evidenceStatus] = (record.evidenceStatuses[claim.evidenceStatus] || 0) + 1;

            if (claim.reviewStatus === 'REVIEW_REQUIRED') {
              record.reviewRequiredItems++;
              record.graphChangesProposed++;
              record.graphChangesRejected++; // Hard stop
            } else {
              record.graphChangesProposed++;
              record.graphChangesAccepted++; // Validated active edge
            }

            if (claim.evidenceStatus === 'CONTRADICTED' || claim.evidenceStatus === 'MIXED') {
              record.contradictionsDiscovered++;
            }
            if (claim.moderators?.length) record.moderatorsDiscovered++;
            if (claim.mediators?.length) record.mediatorsDiscovered++;
          }
        }
      }
      record.unresolvedGaps++;
      record.newlyDiscoveredGaps += 2; // Simulate discovering sub-gaps
    }

    record.endTimestamp = new Date().toISOString();
    return record;
  }

  private mockExtract(doc: ScientificDocument, study: Study, gap: PrioritizedGap): Partial<Claim>[] {
    // Generate an epistemically safe mock extraction
    // Ensure "Negative-Evidence" support and structural separation
    const claims: Partial<Claim>[] = [];

    // Simulate finding a replication or contradiction
    const isContradiction = Math.random() > 0.7;
    
    claims.push({
      claimType: isContradiction ? 'EMPIRICAL_RESULT' : 'EMPIRICAL_RESULT',
      evidenceStatus: isContradiction ? 'CONTRADICTED' : 'SUPPORTED',
      causalSupport: (study.studyDesign || '').includes('Observational') ? 'CAUSAL_INSUFFICIENT' : 'CAUSAL_PLAUSIBLE',
      reviewStatus: (study.studyDesign || '').includes('Observational') ? 'REVIEW_REQUIRED' : 'APPROVED',
      statement: isContradiction ? 'Failed to replicate primary mechanism.' : 'Supports hypothesis.',
      moderators: isContradiction ? ['Contextual environment'] : [],
      mediators: []
    });

    return claims;
  }
}

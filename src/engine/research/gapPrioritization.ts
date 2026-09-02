import type { ResearchGap } from './researchOntology';

export interface PriorityComponents {
  scientificImportance: number;     // e.g., how central is this domain?
  evidenceUncertainty: number;      // e.g., is there highly mixed/contradicted evidence?
  crossDomainCentrality: number;    // e.g., does this bridge two disparate fields?
  downstreamImpact: number;         // e.g., does resolving this clarify many other edges?
  novelty: number;                  // e.g., is this a completely unexplored relationship?
}

export interface PrioritizedGap extends ResearchGap {
  priorityComponents: PriorityComponents;
  priorityScore: number;
  status: 'DISCOVERED' | 'QUEUED' | 'RESEARCHING' | 'EVIDENCE_FOUND' | 'INSUFFICIENT_EVIDENCE' | 'RESOLVED' | 'REOPENED';
  candidateMechanisms?: string[];
  candidateModerators?: string[];
}

/**
 * Calculates a MULTI-FACTOR RESEARCH PRIORITY SCORE.
 * (This is a weighted heuristic, NOT an empirical probability).
 */
export function calculateGapPriority(gap: ResearchGap): PrioritizedGap {
  // We use heuristics based on the gap type and domain centrality
  let importance = 0.5;
  let uncertainty = 0.5;
  let centrality = 0.5;
  let impact = 0.5;
  let novelty = 0.5;

  if (gap.gapType === 'Cross_Domain_Integration' || gap.gapType === 'Complexity_Gap') {
    centrality = 0.9;
    impact = 0.8;
  }
  
  if (gap.gapType === 'Contradictory_Evidence') {
    uncertainty = 1.0;
    importance = 0.9;
  }

  if (gap.gapType === 'No_Studies') {
    novelty = 1.0;
    uncertainty = 0.8;
  }

  // Weightings for the final score
  const wImportance = 0.3;
  const wUncertainty = 0.2;
  const wCentrality = 0.2;
  const wImpact = 0.2;
  const wNovelty = 0.1;

  const score = 
    (importance * wImportance) + 
    (uncertainty * wUncertainty) + 
    (centrality * wCentrality) + 
    (impact * wImpact) + 
    (novelty * wNovelty);

  return {
    ...gap,
    priorityComponents: {
      scientificImportance: importance,
      evidenceUncertainty: uncertainty,
      crossDomainCentrality: centrality,
      downstreamImpact: impact,
      novelty: novelty
    },
    priorityScore: score,
    status: 'QUEUED'
  };
}

export function generateQueriesForGap(gap: PrioritizedGap): string[] {
  const queries: string[] = [];
  const baseVariables = gap.relatedVariables.join(' AND ');

  queries.push(`"${baseVariables}"`);

  if (gap.gapType === 'Contradictory_Evidence') {
    queries.push(`"${baseVariables}" AND (moderator OR mediator OR context)`);
    queries.push(`"${baseVariables}" AND (replication OR meta-analysis)`);
  } else if (gap.gapType === 'Missing_Moderators') {
    queries.push(`"${baseVariables}" AND (individual differences OR susceptibility OR resilience)`);
  } else if (gap.gapType === 'Mechanism_Unknown') {
    queries.push(`"${baseVariables}" AND (mechanism OR pathway OR longitudinal)`);
  } else {
    // Standard broad exploration
    queries.push(`"${baseVariables}" AND review`);
  }

  return queries;
}

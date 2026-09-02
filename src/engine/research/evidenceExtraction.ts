/**
 * Project Genesis — Evidence Extraction
 * 
 * Extracts structured claims from study metadata.
 * Converts raw study information into typed Claim objects
 * with full provenance chains.
 */

import type {
  Study,
  Claim,
  ClaimDirection,
  EpistemicCategory,
} from './researchOntology';

// ─────────────────────────────────────────────────────────────
// CLAIM EXTRACTION
// ─────────────────────────────────────────────────────────────

let claimCounter = 0;

/**
 * Extracts claims from a study's metadata. In the current implementation,
 * this creates a single primary claim from the study's effect description.
 * 
 * Future versions can use NLP / LLM extraction on full-text abstracts
 * to produce multiple claims per study.
 */
export function extractClaims(study: Study): Claim[] {
  if (!study.effectDescription || study.effectDescription === 'Requires extraction') {
    return [];
  }

  claimCounter++;

  const direction = inferDirection(study.effectDescription);
  const epistemicCategory = inferEpistemicCategory(study);

  const variables = extractVariables(study);

  const primaryClaim: Claim = {
    id: `claim_${claimCounter}_${study.id}`,
    studyId: study.id,
    statement: study.effectDescription,
    sourceVariable: variables.independent[0] ?? 'unknown',
    targetVariable: variables.dependent[0] ?? 'unknown',
    direction,
    effectSize: study.effectSize,
    effectSizeUnit: study.effectSize !== undefined ? 'Cohen\'s d (assumed)' : undefined,
    population: study.population,
    context: study.methodology,
    measurementMethod: study.measurements.join(', ') || 'Not specified',
    timescale: inferTimescale(study),
    moderators: [],
    mediators: [],
    confounders: [],
    limitations: study.limitations,
    epistemicCategory,
  };

  return [primaryClaim];
}

// ─────────────────────────────────────────────────────────────
// VARIABLE EXTRACTION
// ─────────────────────────────────────────────────────────────

interface ExtractedVariables {
  independent: string[];
  dependent: string[];
  control: string[];
}

/**
 * Identifies independent, dependent, and control variables from a study.
 * Uses the study's variablesStudied array and heuristics from the
 * effect description.
 */
export function extractVariables(study: Study): ExtractedVariables {
  const vars = study.variablesStudied;

  if (vars.length === 0) {
    return { independent: ['unknown'], dependent: ['unknown'], control: [] };
  }

  if (vars.length === 1) {
    return { independent: [vars[0]], dependent: ['outcome'], control: [] };
  }

  // Heuristic: first variable is independent, second is dependent,
  // remaining are controls/covariates.
  return {
    independent: [vars[0]],
    dependent: [vars[1]],
    control: vars.slice(2),
  };
}

// ─────────────────────────────────────────────────────────────
// RELATIONSHIP EXTRACTION
// ─────────────────────────────────────────────────────────────

export interface CandidateRelationship {
  sourceVariable: string;
  targetVariable: string;
  direction: ClaimDirection;
  strength: number;       // Normalized -1.0 to 1.0
  confidence: number;     // 0.0 to 1.0
  claimId: string;
  studyId: string;
}

/**
 * Converts extracted claims into candidate relationships that can be
 * synthesized into KnowledgeEdges.
 */
export function extractRelationships(claims: Claim[]): CandidateRelationship[] {
  return claims.map(claim => ({
    sourceVariable: claim.sourceVariable,
    targetVariable: claim.targetVariable,
    direction: claim.direction,
    strength: normalizeEffectSize(claim.effectSize, claim.direction),
    confidence: inferConfidence(claim),
    claimId: claim.id,
    studyId: claim.studyId,
  }));
}

// ─────────────────────────────────────────────────────────────
// PROVENANCE TAGGING
// ─────────────────────────────────────────────────────────────

export interface ProvenanceChain {
  studyId: string;
  claimId: string;
  extractionMethod: 'Manual' | 'Heuristic' | 'NLP' | 'LLM';
  extractionConfidence: number;
  timestamp: string;
}

/**
 * Attaches a full provenance chain to a claim, recording how and when
 * the claim was extracted from its source study.
 */
export function tagProvenance(claim: Claim, study: Study): ProvenanceChain {
  return {
    studyId: study.id,
    claimId: claim.id,
    extractionMethod: 'Heuristic',
    extractionConfidence: 0.6, // Conservative default for heuristic extraction
    timestamp: new Date().toISOString(),
  };
}

// ─────────────────────────────────────────────────────────────
// INTERNAL INFERENCE HELPERS
// ─────────────────────────────────────────────────────────────

function inferDirection(effectDescription: string): ClaimDirection {
  const desc = effectDescription.toLowerCase();
  if (desc.includes('no effect') || desc.includes('no significant') || desc.includes('null')) {
    return 'No_Effect';
  }
  if (desc.includes('decrease') || desc.includes('reduce') || desc.includes('negative') || desc.includes('impair') || desc.includes('inhibit')) {
    return 'Negative';
  }
  if (desc.includes('increase') || desc.includes('enhance') || desc.includes('positive') || desc.includes('improve') || desc.includes('facilitat')) {
    return 'Positive';
  }
  if (desc.includes('depend') || desc.includes('moderat') || desc.includes('conditional') || desc.includes('only when')) {
    return 'Conditional';
  }
  if (desc.includes('u-shaped') || desc.includes('inverted') || desc.includes('curvilinear')) {
    return 'Nonlinear';
  }
  return 'Positive'; // Conservative default
}

function inferEpistemicCategory(study: Study): EpistemicCategory {
  switch (study.studyDesign) {
    case 'RCT':
    case 'Longitudinal':
    case 'Meta_Analysis':
    case 'Systematic_Review':
      return 'EMPIRICAL';
    case 'Computational':
      return 'COMPUTATIONAL';
    case 'Qualitative':
      return 'PHENOMENOLOGICAL';
    case 'Case_Study':
      return 'PERSONAL_OBSERVATION';
    default:
      return 'THEORETICAL';
  }
}

function inferTimescale(study: Study): string {
  const text = [study.title, study.abstract ?? '', study.methodology].join(' ').toLowerCase();
  if (text.includes('longitudinal') || text.includes('years') || text.includes('follow-up')) return 'Years';
  if (text.includes('month')) return 'Months';
  if (text.includes('week')) return 'Days';
  if (text.includes('session') || text.includes('hour')) return 'Hours';
  if (text.includes('trial') || text.includes('millisecond') || text.includes('reaction time')) return 'Milliseconds';
  return 'Not specified';
}

function normalizeEffectSize(effectSize: number | undefined, direction: ClaimDirection): number {
  if (effectSize === undefined) return 0;
  const sign = direction === 'Negative' ? -1 : 1;
  // Clamp to [-1, 1] using a sigmoid-like transform for very large effects
  const clamped = Math.tanh(effectSize);
  return sign * Math.abs(clamped);
}

function inferConfidence(claim: Claim): number {
  let confidence = 0.5; // Base

  if (claim.epistemicCategory === 'EMPIRICAL') confidence += 0.2;
  if (claim.epistemicCategory === 'PERSONAL_OBSERVATION') confidence -= 0.2;
  if (claim.effectSize !== undefined) confidence += 0.1;
  if (claim.limitations.length === 0) confidence += 0.05;
  if (claim.limitations.length > 3) confidence -= 0.1;

  return Math.max(0.1, Math.min(1.0, confidence));
}

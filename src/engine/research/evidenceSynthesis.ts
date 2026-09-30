/**
 * Project Genesis — Evidence Synthesis
 * 
 * The core intelligence of the Research Engine. Takes multiple claims
 * about the same phenomenon and produces synthesized knowledge,
 * detecting contradictions and identifying missing variables.
 */

import type {
  Claim,
  ClaimSet,
  ContradictionReport,
  ContradictionDimension,
  KnowledgeEdge,
  MissingVariable,
  ResearchDomain,
  TheoryLifecycleStage,
} from './researchOntology';

// ─────────────────────────────────────────────────────────────
// CLAIM GROUPING
// ─────────────────────────────────────────────────────────────

let claimSetCounter = 0;

/**
 * Groups claims that address the same source → target relationship.
 * Claims about "sleep → attention" from different studies are clustered
 * into a single ClaimSet.
 */
export function groupClaimsByRelationship(claims: Claim[]): ClaimSet[] {
  const groups = new Map<string, Claim[]>();

  for (const claim of claims) {
    const key = `${claim.sourceVariable}::${claim.targetVariable}`;
    const existing = groups.get(key) ?? [];
    existing.push(claim);
    groups.set(key, existing);
  }

  const claimSets: ClaimSet[] = [];

  for (const [key, groupClaims] of groups) {
    const [source, target] = key.split('::');
    claimSetCounter++;

    const supportCount = groupClaims.filter(c => c.direction === 'Positive').length;
    const contradictCount = groupClaims.filter(c => c.direction === 'Negative').length;
    const noEffectCount = groupClaims.filter(c => c.direction === 'No_Effect').length;
    const mixedCount = groupClaims.filter(c => c.direction === 'Conditional' || c.direction === 'Nonlinear').length;

    claimSets.push({
      id: `claimset_${claimSetCounter}`,
      sourceVariable: source,
      targetVariable: target,
      claims: groupClaims,
      supportCount,
      contradictCount,
      mixedCount,
      noEffectCount,
    });
  }

  return claimSets;
}

// ─────────────────────────────────────────────────────────────
// CONTRADICTION DETECTION
// ─────────────────────────────────────────────────────────────

let contradictionCounter = 0;

/**
 * Identifies cases where claims within a ClaimSet conflict in direction,
 * magnitude, or existence of effect.
 * 
 * A contradiction exists when:
 * - Some claims say Positive and others say Negative
 * - Some claims say an effect exists and others say No_Effect
 */
export function detectContradictions(claimSet: ClaimSet): ContradictionReport | null {
  const hasPositive = claimSet.supportCount > 0;
  const hasNegative = claimSet.contradictCount > 0;
  const hasNoEffect = claimSet.noEffectCount > 0;

  const isContradictory = (hasPositive && hasNegative) ||
                          (hasPositive && hasNoEffect) ||
                          (hasNegative && hasNoEffect);

  if (!isContradictory) return null;

  contradictionCounter++;

  const conflictingIds = claimSet.claims.map(c => c.id);
  const dimensions = investigateContradiction(claimSet);

  return {
    id: `contradiction_${contradictionCounter}`,
    claimSetId: claimSet.id,
    conflictingClaimIds: conflictingIds,
    investigatedDimensions: dimensions,
    proposedExplanation: generateExplanation(claimSet, dimensions),
    resolutionStatus: dimensions.length > 0 ? 'Partially_Resolved' : 'Unresolved',
  };
}

/**
 * Examines dimensions that might explain why claims conflict:
 * population, age, context, measurement, design, timescale,
 * dose, moderator, confound, replication.
 */
function investigateContradiction(claimSet: ClaimSet): ContradictionDimension[] {
  const dimensions: ContradictionDimension[] = [];
  const claims = claimSet.claims;

  // Check if populations differ
  const populations = new Set(claims.map(c => c.population.description));
  if (populations.size > 1) dimensions.push('Population');

  // Check if age ranges differ
  const ages = new Set(claims.map(c => c.population.ageRange).filter(Boolean));
  if (ages.size > 1) dimensions.push('Age');

  // Check if contexts differ
  const contexts = new Set(claims.map(c => c.context));
  if (contexts.size > 1) dimensions.push('Context');

  // Check if measurement methods differ
  const measurements = new Set(claims.map(c => c.measurementMethod));
  if (measurements.size > 1) dimensions.push('Measurement');

  // Check if timescales differ
  const timescales = new Set(claims.map(c => c.timescale));
  if (timescales.size > 1) dimensions.push('Timescale');

  // Check for moderators
  const allModerators = claims.flatMap(c => c.moderators);
  if (allModerators.length > 0) dimensions.push('Moderator');

  // Check for confounders
  const allConfounders = claims.flatMap(c => c.confounders);
  if (allConfounders.length > 0) dimensions.push('Confound');

  if (dimensions.length === 0) dimensions.push('Unknown');

  return dimensions;
}

function generateExplanation(claimSet: ClaimSet, dimensions: ContradictionDimension[]): string {
  if (dimensions.includes('Unknown')) {
    return `Contradiction in ${claimSet.sourceVariable} → ${claimSet.targetVariable}: ` +
           `${claimSet.supportCount} support, ${claimSet.contradictCount} contradict, ` +
           `${claimSet.noEffectCount} no effect. Cause of disagreement is unknown.`;
  }

  return `Contradiction in ${claimSet.sourceVariable} → ${claimSet.targetVariable} ` +
         `may be explained by differences in: ${dimensions.join(', ')}. ` +
         `${claimSet.supportCount} support, ${claimSet.contradictCount} contradict, ` +
         `${claimSet.noEffectCount} no effect.`;
}

// ─────────────────────────────────────────────────────────────
// EVIDENCE SYNTHESIS
// ─────────────────────────────────────────────────────────────

let edgeCounter = 0;

/**
 * Produces a synthesized KnowledgeEdge from a ClaimSet.
 * This is the core synthesis operation: multiple studies → one edge.
 */
export function synthesizeEvidence(
  claimSet: ClaimSet,
  contradictionReport: ContradictionReport | null,
  domains: ResearchDomain[] = ['Complex_Systems']
): KnowledgeEdge {
  edgeCounter++;

  // Synthesize direction: majority vote with uncertainty
  const netDirection = claimSet.supportCount - claimSet.contradictCount;
  const totalClaims = claimSet.claims.length;

  let synthesizedStrength: number;
  if (totalClaims === 0) {
    synthesizedStrength = 0;
  } else {
    // Average the normalized effect sizes of claims that have them
    const effectSizes = claimSet.claims
      .filter(c => c.effectSize !== undefined)
      .map(c => {
        const sign = c.direction === 'Negative' ? -1 : 1;
        return sign * Math.abs(Math.tanh(c.effectSize!));
      });

    if (effectSizes.length > 0) {
      synthesizedStrength = effectSizes.reduce((a, b) => a + b, 0) / effectSizes.length;
    } else {
      synthesizedStrength = netDirection > 0 ? 0.3 : (netDirection < 0 ? -0.3 : 0);
    }
  }

  // Confidence: higher when claims agree, lower when they conflict
  const agreementRatio = totalClaims > 0
    ? Math.max(claimSet.supportCount, claimSet.contradictCount, claimSet.noEffectCount) / totalClaims
    : 0;
  const confidence = Math.min(1.0, agreementRatio * 0.7 + (totalClaims > 5 ? 0.2 : totalClaims * 0.04));

  // Evidence quality: based on study designs in the claim set
  const qualityScore = claimSet.claims.reduce((sum, c) => {
    if (c.epistemicCategory === 'EMPIRICAL') return sum + 3;
    if (c.epistemicCategory === 'COMPUTATIONAL') return sum + 2;
    if (c.epistemicCategory === 'THEORETICAL') return sum + 1;
    return sum;
  }, 0) / Math.max(totalClaims, 1);

  const evidenceQuality: KnowledgeEdge['evidenceQuality'] =
    qualityScore >= 2.5 ? 'Very_High' :
    qualityScore >= 2.0 ? 'High' :
    qualityScore >= 1.0 ? 'Moderate' : 'Low';

  // Aggregate moderators and mediators
  const allModerators = [...new Set(claimSet.claims.flatMap(c => c.moderators))];
  const allMediators = [...new Set(claimSet.claims.flatMap(c => c.mediators))];

  // Determine lifecycle stage
  const lifecycleStage = inferLifecycleStage(claimSet, contradictionReport);

  // Publication year range
  const years = claimSet.claims
    .map(c => parseInt(c.studyId.match(/\d{4}/)?.[0] ?? '2000'))
    .filter(y => !isNaN(y));
  const earliestEvidence = years.length > 0 ? Math.min(...years) : 2000;
  const latestEvidence = years.length > 0 ? Math.max(...years) : 2000;

  // Relationship type
  let relationshipType: KnowledgeEdge['relationshipType'] = 'Associational';
  const empiricalCausal = claimSet.claims.some(c =>
    c.epistemicCategory === 'EMPIRICAL' && c.context.toLowerCase().includes('rct')
  );
  if (empiricalCausal) relationshipType = 'Causal';
  if (contradictionReport) relationshipType = 'Conditional';

  return {
    id: `edge_${edgeCounter}`,
    sourceVariable: claimSet.sourceVariable,
    targetVariable: claimSet.targetVariable,
    relationshipType,
    direction: 'Unidirectional',
    synthesizedStrength,
    confidence,
    supportingClaimSetId: claimSet.id,
    contradictionReportIds: contradictionReport ? [contradictionReport.id] : [],
    conditions: contradictionReport?.conditionalModel
      ? [contradictionReport.conditionalModel]
      : [],
    moderators: allModerators,
    mediators: allMediators,
    timescale: inferDominantTimescale(claimSet),
    domains,
    evidenceQuality,
    studyCount: totalClaims,
    earliestEvidence,
    latestEvidence,
    lifecycleStage,
    evidenceStatus: 'UNKNOWN',
    epistemicCategory: 'EMPIRICAL',
  };
}

function inferLifecycleStage(
  claimSet: ClaimSet,
  contradictionReport: ContradictionReport | null
): TheoryLifecycleStage {
  if (contradictionReport && contradictionReport.resolutionStatus === 'Unresolved') {
    return 'Criticized';
  }
  if (claimSet.claims.length >= 5 && claimSet.supportCount > claimSet.contradictCount * 2) {
    return 'Current_Consensus';
  }
  if (claimSet.claims.length >= 3) {
    return 'Replicated';
  }
  if (claimSet.claims.length >= 2) {
    return 'Subsequent_Evidence';
  }
  return 'Original_Theory';
}

function inferDominantTimescale(claimSet: ClaimSet): string {
  const timescales = claimSet.claims.map(c => c.timescale).filter(t => t !== 'Not specified');
  if (timescales.length === 0) return 'Not specified';

  // Return the most common timescale
  const counts = new Map<string, number>();
  for (const ts of timescales) {
    counts.set(ts, (counts.get(ts) ?? 0) + 1);
  }
  let max = 0;
  let dominant = timescales[0];
  for (const [ts, count] of counts) {
    if (count > max) {
      max = count;
      dominant = ts;
    }
  }
  return dominant;
}

// ─────────────────────────────────────────────────────────────
// MISSING VARIABLE DISCOVERY
// ─────────────────────────────────────────────────────────────

/**
 * Compares the variables in the current model against variables
 * repeatedly mentioned in the evidence base. Returns potentially
 * relevant variables that are absent from the model.
 */
export function identifyMissingVariables(
  currentModelVariables: string[],
  allClaims: Claim[],
  domains: ResearchDomain[] = []
): MissingVariable[] {
  const currentSet = new Set(currentModelVariables.map(v => v.toLowerCase()));
  const mentionCounts = new Map<string, { studyIds: Set<string>; domains: Set<ResearchDomain> }>();

  for (const claim of allClaims) {
    const variables = [
      claim.sourceVariable,
      claim.targetVariable,
      ...claim.moderators,
      ...claim.mediators,
    ];

    for (const v of variables) {
      const normalized = v.toLowerCase();
      if (currentSet.has(normalized)) continue;
      if (normalized === 'unknown' || normalized === 'outcome') continue;

      if (!mentionCounts.has(normalized)) {
        mentionCounts.set(normalized, { studyIds: new Set(), domains: new Set() });
      }
      const entry = mentionCounts.get(normalized)!;
      entry.studyIds.add(claim.studyId);
      // Add domains from the claim context if available
      for (const d of domains) entry.domains.add(d);
    }
  }

  const missing: MissingVariable[] = [];

  for (const [variableName, info] of mentionCounts) {
    const mentionCount = info.studyIds.size;
    if (mentionCount < 2) continue; // Only flag variables mentioned by multiple studies

    missing.push({
      variableName,
      mentionedInStudyIds: [...info.studyIds],
      mentionCount,
      domains: [...info.domains],
      suggestedRelationships: [],
      priority: mentionCount >= 10 ? 'Critical' :
                mentionCount >= 5 ? 'High' :
                mentionCount >= 3 ? 'Medium' : 'Low',
    });
  }

  // Sort by priority (critical first)
  const priorityOrder = { Critical: 0, High: 1, Medium: 2, Low: 3 };
  missing.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  return missing;
}

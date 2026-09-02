/**
 * Project Genesis — Causal Inference Layer
 * 
 * Enforces the architectural rule: correlation ≠ causation.
 * Every relationship entering the knowledge graph must declare
 * its causal design and remaining confounds.
 */

import type { Claim } from './researchOntology';

// ─────────────────────────────────────────────────────────────
// CAUSAL DESIGN TYPES
// ─────────────────────────────────────────────────────────────

export type CausalDesign =
  | 'RCT'
  | 'Natural_Experiment'
  | 'Instrumental_Variable'
  | 'Difference_in_Differences'
  | 'Regression_Discontinuity'
  | 'Longitudinal_Causal'
  | 'Mediation_Analysis'
  | 'Causal_Graph'
  | 'Counterfactual'
  | 'Quasi_Experimental'
  | 'Observational_Only';

export type CausalStrength = 'Strong' | 'Moderate' | 'Weak' | 'Correlational_Only';

// ─────────────────────────────────────────────────────────────
// CAUSAL CLAIM (extends Claim)
// ─────────────────────────────────────────────────────────────

export interface CausalClaim extends Claim {
  causalDesign: CausalDesign;
  causalStrength: CausalStrength;
  confoundsAddressed: string[];
  confoundsRemaining: string[];
  alternativeExplanations: string[];
}

// ─────────────────────────────────────────────────────────────
// CAUSAL ASSESSMENT
// ─────────────────────────────────────────────────────────────

/**
 * Assesses the causal strength of a claim based on study design.
 * This is a heuristic hierarchy, not a definitive judgment.
 */
export function assessCausalStrength(studyDesign: string, methodology: string): CausalStrength {
  const design = studyDesign.toLowerCase();
  const method = methodology.toLowerCase();

  // Strong causal evidence
  if (design.includes('rct') || design === 'rct' || method.includes('randomized controlled') || method.includes('random assignment')) {
    return 'Strong';
  }

  // Moderate causal evidence
  if (design.includes('natural_experiment') || design.includes('quasi') ||
      method.includes('instrumental variable') || method.includes('difference-in-difference') ||
      method.includes('regression discontinuity') || method.includes('natural experiment')) {
    return 'Moderate';
  }

  // Weak causal evidence
  if (design.includes('longitudinal') || method.includes('longitudinal') ||
      method.includes('mediation') || method.includes('causal') ||
      method.includes('granger') || method.includes('propensity')) {
    return 'Weak';
  }

  // Correlational only
  return 'Correlational_Only';
}

/**
 * Infers the causal design from study metadata.
 */
export function inferCausalDesign(studyDesign: string, methodology: string): CausalDesign {
  const design = studyDesign.toLowerCase();
  const method = methodology.toLowerCase();

  if (design === 'rct' || method.includes('randomized controlled') || method.includes('random assignment')) return 'RCT';
  if (method.includes('natural experiment')) return 'Natural_Experiment';
  if (method.includes('instrumental variable')) return 'Instrumental_Variable';
  if (method.includes('difference-in-difference')) return 'Difference_in_Differences';
  if (method.includes('regression discontinuity')) return 'Regression_Discontinuity';
  if (method.includes('mediation')) return 'Mediation_Analysis';
  if (method.includes('causal graph') || method.includes('dag') || method.includes('structural equation')) return 'Causal_Graph';
  if (method.includes('counterfactual')) return 'Counterfactual';
  if (design.includes('quasi') || method.includes('quasi-experimental')) return 'Quasi_Experimental';
  if (design.includes('longitudinal') && (method.includes('causal') || method.includes('panel'))) return 'Longitudinal_Causal';

  return 'Observational_Only';
}

// ─────────────────────────────────────────────────────────────
// CAUSAL HIERARCHY (Bradford Hill Criteria inspired)
// ─────────────────────────────────────────────────────────────

export interface CausalEvidenceAssessment {
  relationship: string;            // e.g., "sleep → attention"
  strength: boolean;               // Large effect size?
  consistency: boolean;            // Replicated across studies?
  specificity: boolean;            // Specific to this relationship?
  temporality: boolean;            // Cause precedes effect?
  doseResponse: boolean;           // Gradient exists?
  plausibility: boolean;           // Biologically/psychologically plausible?
  coherence: boolean;              // Consistent with existing knowledge?
  experiment: boolean;             // Experimental evidence exists?
  analogy: boolean;                // Similar relationships established?
  overallAssessment: CausalStrength;
}

/**
 * Evaluates a relationship against Bradford Hill-inspired criteria
 * for causal inference. Returns a structured assessment.
 */
export function evaluateCausalEvidence(
  relationship: string,
  criteria: Partial<CausalEvidenceAssessment>
): CausalEvidenceAssessment {
  const assessment: CausalEvidenceAssessment = {
    relationship,
    strength: criteria.strength ?? false,
    consistency: criteria.consistency ?? false,
    specificity: criteria.specificity ?? false,
    temporality: criteria.temporality ?? false,
    doseResponse: criteria.doseResponse ?? false,
    plausibility: criteria.plausibility ?? false,
    coherence: criteria.coherence ?? false,
    experiment: criteria.experiment ?? false,
    analogy: criteria.analogy ?? false,
    overallAssessment: 'Correlational_Only',
  };

  const trueCount = [
    assessment.strength,
    assessment.consistency,
    assessment.specificity,
    assessment.temporality,
    assessment.doseResponse,
    assessment.plausibility,
    assessment.coherence,
    assessment.experiment,
    assessment.analogy,
  ].filter(Boolean).length;

  if (assessment.experiment && assessment.temporality && trueCount >= 6) {
    assessment.overallAssessment = 'Strong';
  } else if (assessment.temporality && trueCount >= 4) {
    assessment.overallAssessment = 'Moderate';
  } else if (trueCount >= 2) {
    assessment.overallAssessment = 'Weak';
  }

  return assessment;
}

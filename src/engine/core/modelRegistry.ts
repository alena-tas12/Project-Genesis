import type { Mechanism, Hypothesis } from './ontology';

/**
 * Project Genesis - Scientific Model Registry
 * 
 * Defines the advanced theories discovered during the SIH sandbox phase 
 * and explicit personal observations. Importantly, preserves source, assumptions, 
 * parameters, timescale mismatches, and uncertainty.
 */

export const SCIENTIFIC_MODELS: Mechanism[] = [
  {
    id: 'mech_bkt',
    name: 'Bayesian Knowledge Tracing (BKT)',
    description: 'Models the probability that a student has mastered a specific knowledge component based on observed performance.',
    formulaType: 'Exact',
    evidence: {
      source: 'Corbett & Anderson (1994)',
      type: 'Theoretical',
      validationState: 'Pending', // Marked pending because parameters are synthetic/uncalibrated
    }
  },
  {
    id: 'mech_power_law_forgetting',
    name: 'Power-Law Forgetting',
    description: 'Memory decay over time without practice. R(t) = a * t^(-b)',
    formulaType: 'Heuristic',
    evidence: {
      source: 'Wixted & Ebbesen (1991)',
      type: 'Theoretical',
      validationState: 'Unsupported', // Needs clarification on procedural vs declarative decay
    }
  },
  {
    id: 'mech_sdt',
    name: 'Self-Determination Theory (SDT) Motivation',
    description: 'Intrinsic motivation driven by Autonomy, Competence, and Relatedness.',
    formulaType: 'Placeholder', // Using an arbitrary exponential saturation function
    evidence: {
      source: 'Deci & Ryan (2000)',
      type: 'Synthetic_Assumption',
      validationState: 'Falsified', // The exact quantitative combination is a synthetic assumption
    }
  },
  {
    id: 'mech_sacerdote_peer',
    name: 'Linear-in-Means Peer Effects',
    description: 'Influence of peer achievement on individual achievement.',
    formulaType: 'Exact',
    evidence: {
      source: 'Sacerdote (2011)',
      type: 'Theoretical',
      validationState: 'Pending', // Valid theory, but beta parameters need calibration (~0.1 SD)
    }
  },
  {
    id: 'mech_chetty_mobility',
    name: 'Intergenerational Mobility Update',
    description: 'Probability of moving up the income distribution.',
    formulaType: 'Exact',
    evidence: {
      source: 'Chetty et al. (2014)',
      type: 'Theoretical',
      validationState: 'Timescale_Mismatch', // Generational timescale applied to daily tick loop
    }
  }
];

export const PERSONAL_HYPOTHESES: Hypothesis[] = [
  {
    id: 'hyp_alena_integration',
    statement: 'The ALENA baseline state represents a fully integrated, low-rumination operating mode that prevents cognitive fatigue.',
    evidence: {
      source: "Alena's Personal Observation Log (August 2026)",
      type: 'Personal_Observation',
      validationState: 'Pending'
    },
    uncertainty: {
      confidence: 0.85,
      notes: 'Experientially highly stable, but not empirically measured via external physiological sensors (e.g., fMRI or blood cortisol levels).'
    }
  },
  {
    id: 'hyp_institutional_friction',
    statement: 'Rigid institutional environments (Control-first) trigger hyper-awareness and physiological drain in embodied individuals, rather than dissociation.',
    evidence: {
      source: "Alena's Personal Observation Log (August 2026)",
      type: 'Personal_Observation',
      validationState: 'Pending'
    },
    uncertainty: {
      confidence: 0.90,
      notes: 'Strongly aligns with Bronfenbrenner meso-system friction and Allostatic Load theory, but remains an observational hypothesis here.'
    }
  }
];

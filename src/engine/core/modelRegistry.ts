import type { Mechanism, PhilosophicalConstruct, Study, EvidenceSet } from './ontology';

/**
 * Project Genesis - Scientific Knowledge Graph & Registry
 * 
 * Separates raw empirical studies from synthesized mechanisms and philosophical constructs.
 */

export const PHILOSOPHICAL_CONSTRUCTS: PhilosophicalConstruct[] = [
  {
    id: 'phil_agency',
    name: 'Agency',
    type: 'Concept',
    description: 'The capacity of an actor to act in a given environment, heavily tied to meaning and autonomy.',
    relatedMechanisms: ['mech_sdt_autonomy']
  },
  {
    id: 'phil_meaning',
    name: 'Meaning',
    type: 'Interpretation',
    description: 'Subjective valuation of experience. Not a physiological variable, but acts as a modulatory condition for psychological resilience.',
  }
];

export const STUDIES: Study[] = [
  {
    id: 'study_corbett_1994',
    title: 'Knowledge Tracing: Modeling the Acquisition of Procedural Knowledge',
    authors: 'Corbett & Anderson',
    publicationYear: 1994,
    methodology: 'Computational modelling of student performance on LISP cognitive tutors.',
    population: {
      description: 'College students learning LISP programming',
    },
    variablesStudied: ['Performance', 'Latent Knowledge State'],
    measurements: ['Correct/Incorrect step completion'],
    effectDescription: 'HMM accurately predicts future correct responses based on past history.',
    uncertainty: {
      confidence: 0.85,
      notes: 'Highly predictive for procedural tasks, unknown transfer to conceptual learning.'
    },
    limitations: ['Assumes binary knowledge state', 'Does not model forgetting'],
    replicationStatus: 'Replicated',
    evidenceQuality: 'High'
  }
];

export const EVIDENCE_SETS: EvidenceSet[] = [
  {
    id: 'evset_bkt',
    targetMechanismId: 'mech_bkt',
    studies: [STUDIES[0]],
    synthesizedConfidence: 0.8,
    conflicts: ['Does not account for memory decay over long timescales.']
  }
];

export const SCIENTIFIC_MECHANISMS: Mechanism[] = [
  {
    id: 'mech_bkt',
    name: 'Bayesian Knowledge Tracing (BKT)',
    description: 'Probability updating of latent knowledge state.',
    epistemicCategory: 'COMPUTATIONAL',
    validationState: 'Supported',
    evidenceSetId: 'evset_bkt'
  },
  {
    id: 'mech_allostatic_load',
    name: 'Allostatic Load accumulation',
    description: 'Physiological wear and tear on the body from chronic stress.',
    epistemicCategory: 'EMPIRICAL',
    validationState: 'Established'
  },
  {
    id: 'mech_alena_integration',
    name: 'ALENA Baseline Integration',
    description: 'Low-rumination embodied state preserving cognitive bandwidth.',
    epistemicCategory: 'PERSONAL_OBSERVATION',
    validationState: 'Hypothesized'
  }
];

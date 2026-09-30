/**
 * Project Genesis — Measurement Ontology
 * 
 * Prevents Genesis from treating different operationalizations of the
 * same construct as interchangeable. "Perceived stress" ≠ "cortisol level."
 */

// ─────────────────────────────────────────────────────────────
// MEASUREMENT TYPES
// ─────────────────────────────────────────────────────────────

export type MeasurementType =
  | 'Self_Report'
  | 'Physiological'
  | 'Behavioural'
  | 'Neural'
  | 'Observational'
  | 'Ecological_Momentary'
  | 'Experimental_Manipulation'
  | 'Computational'
  | 'Performance_Based'
  | 'Archival';

export type ValidityLevel = 'Established' | 'Moderate' | 'Contested' | 'Unknown';

// ─────────────────────────────────────────────────────────────
// OPERATIONAL DEFINITIONS
// ─────────────────────────────────────────────────────────────

export interface OperationalDefinition {
  id: string;
  constructId: string;
  definition: string;
  measurementType: MeasurementType;
  instrument?: string;
  reliability?: number;
  validity: ValidityLevel;
  population: string;
  limitations: string[];
  notInterchangeableWith: string[];
}

// ─────────────────────────────────────────────────────────────
// CONSTRUCTS
// ─────────────────────────────────────────────────────────────

export interface Construct {
  id: string;
  name: string;
  description: string;
  domain: string;
  operationalDefinitions: OperationalDefinition[];
  commonConfusions: string[];
}

// ─────────────────────────────────────────────────────────────
// FOUNDATIONAL CONSTRUCTS
// ─────────────────────────────────────────────────────────────

export const CONSTRUCTS: Construct[] = [
  {
    id: 'construct_stress',
    name: 'Stress',
    description: 'A multidimensional construct spanning subjective experience, physiological response, and behavioural indicators.',
    domain: 'Psychological',
    operationalDefinitions: [
      {
        id: 'opdef_pss',
        constructId: 'construct_stress',
        definition: 'Perceived Stress Scale (PSS-10): Self-report measure of the degree to which situations in life are appraised as stressful.',
        measurementType: 'Self_Report',
        instrument: 'PSS-10 (Cohen, Kamarck & Mermelstein, 1983)',
        reliability: 0.85,
        validity: 'Established',
        population: 'General adult population',
        limitations: ['Subjective; does not measure physiological stress', 'Recall bias', 'Cultural variation in stress appraisal'],
        notInterchangeableWith: ['opdef_cortisol', 'opdef_stress_behavioural'],
      },
      {
        id: 'opdef_cortisol',
        constructId: 'construct_stress',
        definition: 'Salivary cortisol: Physiological biomarker of HPA axis activation.',
        measurementType: 'Physiological',
        instrument: 'Salivary cortisol assay (immunoassay)',
        validity: 'Established',
        population: 'General (with diurnal variation controls)',
        limitations: ['Diurnal variation requires timed sampling', 'Affected by food, exercise, medications', 'Single timepoint ≠ chronic stress', 'Cortisol is not "the stress hormone" — it has many functions'],
        notInterchangeableWith: ['opdef_pss', 'opdef_stress_behavioural'],
      },
      {
        id: 'opdef_stress_behavioural',
        constructId: 'construct_stress',
        definition: 'Behavioural stress indicators: Observable changes in behaviour under demanding conditions (e.g., error rate increase, avoidance behaviour).',
        measurementType: 'Behavioural',
        validity: 'Moderate',
        population: 'Context-dependent',
        limitations: ['Requires operational definition of "demanding conditions"', 'Individual differences in stress expression'],
        notInterchangeableWith: ['opdef_pss', 'opdef_cortisol'],
      },
    ],
    commonConfusions: [
      'Treating PSS scores and cortisol levels as measuring the same thing',
      'Assuming cortisol = stress (cortisol has many non-stress functions)',
      'Confusing acute stress response with chronic stress',
    ],
  },
  {
    id: 'construct_attention',
    name: 'Attention',
    description: 'The cognitive process of selectively concentrating on relevant information while ignoring irrelevant stimuli.',
    domain: 'Cognitive',
    operationalDefinitions: [
      {
        id: 'opdef_sustained_attention',
        constructId: 'construct_attention',
        definition: 'Sustained attention: Ability to maintain focus over prolonged periods. Measured by Continuous Performance Tasks (CPT), Psychomotor Vigilance Task (PVT).',
        measurementType: 'Performance_Based',
        instrument: 'PVT (Dinges & Powell, 1985)',
        reliability: 0.88,
        validity: 'Established',
        population: 'General adult population',
        limitations: ['Lab-based; may not generalize to real-world attention', 'Sensitive to motivation and fatigue'],
        notInterchangeableWith: ['opdef_selective_attention', 'opdef_self_report_attention'],
      },
      {
        id: 'opdef_selective_attention',
        constructId: 'construct_attention',
        definition: 'Selective attention: Ability to attend to relevant stimuli while filtering distractors. Measured by Stroop, Flanker, or visual search tasks.',
        measurementType: 'Performance_Based',
        instrument: 'Eriksen Flanker Task',
        validity: 'Established',
        population: 'General',
        limitations: ['Specific to the task paradigm', 'Ceiling effects in healthy adults'],
        notInterchangeableWith: ['opdef_sustained_attention'],
      },
      {
        id: 'opdef_self_report_attention',
        constructId: 'construct_attention',
        definition: 'Self-reported attention difficulties (e.g., ADHD rating scales, mind-wandering questionnaires).',
        measurementType: 'Self_Report',
        validity: 'Moderate',
        population: 'General',
        limitations: ['Poor correlation with objective attention measures', 'Social desirability bias'],
        notInterchangeableWith: ['opdef_sustained_attention', 'opdef_selective_attention'],
      },
    ],
    commonConfusions: [
      'Treating sustained and selective attention as the same construct',
      'Assuming self-reported attention problems correlate with objective performance',
      'Conflating attention with motivation or interest',
    ],
  },
  {
    id: 'construct_learning',
    name: 'Learning',
    description: 'A relatively permanent change in behaviour or knowledge resulting from experience.',
    domain: 'Cognitive',
    operationalDefinitions: [
      {
        id: 'opdef_test_performance',
        constructId: 'construct_learning',
        definition: 'Test/exam performance: Knowledge demonstration through standardized assessments.',
        measurementType: 'Performance_Based',
        validity: 'Moderate',
        population: 'Educational settings',
        limitations: ['Tests measure recall/recognition, not necessarily deep understanding', 'Culturally biased', 'Test anxiety affects performance'],
        notInterchangeableWith: ['opdef_skill_acquisition', 'opdef_transfer'],
      },
      {
        id: 'opdef_skill_acquisition',
        constructId: 'construct_learning',
        definition: 'Skill acquisition: Observable improvement in task performance over practice trials.',
        measurementType: 'Performance_Based',
        validity: 'Established',
        population: 'General',
        limitations: ['Domain-specific', 'Speed-accuracy tradeoffs'],
        notInterchangeableWith: ['opdef_test_performance', 'opdef_transfer'],
      },
      {
        id: 'opdef_transfer',
        constructId: 'construct_learning',
        definition: 'Transfer of learning: Ability to apply learned knowledge/skills to novel contexts.',
        measurementType: 'Performance_Based',
        validity: 'Contested',
        population: 'General',
        limitations: ['Difficult to measure', 'Near vs far transfer distinction', 'Transfer is often weak or absent'],
        notInterchangeableWith: ['opdef_test_performance', 'opdef_skill_acquisition'],
      },
    ],
    commonConfusions: [
      'Treating test scores as direct measures of learning',
      'Assuming learning in one domain transfers to another',
      'Confusing performance (observed) with learning (latent)',
    ],
  },
];

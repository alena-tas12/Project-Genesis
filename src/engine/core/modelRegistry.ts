import type { Mechanism } from './ontology';
import type { Study } from '../research/researchOntology';

/**
 * Project Genesis — Model Registry
 * 
 * Registers the scientific models discovered during SIH research
 * and carries the audit findings as structured metadata.
 * 
 * Each model entry preserves: source, population, timescale,
 * parameter provenance, assumptions, validation status, limitations,
 * and compatible/conflicting models — exactly as specified by the
 * Scientific Model Audit.
 */

export interface RegisteredModel {
  mechanism: Mechanism;
  originalConstruct: string;
  source: string;
  population: string;
  timescale: string;
  mathematicalFormulation: string;
  parameterProvenance: string;
  assumptions: string[];
  validationStatus: string;
  limitations: string[];
  compatibleModels: string[];
  conflictingModels: string[];
  auditClassification: 'Supported' | 'Theoretically_Motivated' | 'Synthetic_Assumption' | 'Inappropriate' | 'Timescale_Mismatch';
}

export const REGISTERED_MODELS: RegisteredModel[] = [
  {
    mechanism: {
      id: 'mech_bkt',
      name: 'Bayesian Knowledge Tracing (BKT)',
      description: 'Probability that a student has mastered a specific knowledge component.',
      formulaType: 'Exact',
      limitations: ['Assumes binary mastery', 'Does not model forgetting', 'Parameters must be empirically fitted per domain'],
    },
    originalConstruct: 'Latent knowledge state estimation',
    source: 'Corbett & Anderson (1994)',
    population: 'Middle/high-school students using LISP and geometry cognitive tutors',
    timescale: 'Minutes to Hours (within-session)',
    mathematicalFormulation: 'P(Ln|obs) = standard 4-parameter HMM update',
    parameterProvenance: 'P(L0)=0.1, P(T)=0.15, P(G)=0.25, P(S)=0.1 — ARBITRARY, must be fitted',
    assumptions: ['All knowledge nodes have the same learning difficulty and guessability', 'Binary mastery state'],
    validationStatus: 'Validated for procedural tasks; unknown transfer to conceptual learning',
    limitations: ['Parameters are hardcoded constants for all knowledge nodes', 'Combines with continuous mastery percentages creating theoretical dissonance'],
    compatibleModels: ['mech_irt'],
    conflictingModels: ['mech_power_law_forgetting'],
    auditClassification: 'Supported',
  },
  {
    mechanism: {
      id: 'mech_power_law_forgetting',
      name: 'Power-Law Forgetting',
      description: 'Memory decay over time without practice.',
      formulaType: 'Heuristic',
      limitations: ['Decay rates vary wildly by knowledge type', 'Parameters are synthetic'],
    },
    originalConstruct: 'Memory retention curve',
    source: 'Wixted & Ebbesen (1991)',
    population: 'Broad experimental psychology subjects (mostly college students)',
    timescale: 'Hours to Months',
    mathematicalFormulation: 'R(t) = a * t^(-b)',
    parameterProvenance: 'a and b derived arbitrarily — SYNTHETIC',
    assumptions: ['Single decay function applies to all knowledge types'],
    validationStatus: 'Empirical fit to decay curves, but parameters need per-domain calibration',
    limitations: ['Does not distinguish procedural vs declarative decay'],
    compatibleModels: ['mech_spaced_repetition'],
    conflictingModels: ['mech_bkt'],
    auditClassification: 'Theoretically_Motivated',
  },
  {
    mechanism: {
      id: 'mech_cognitive_load',
      name: 'Cognitive Load Theory (CLT)',
      description: 'Working memory constraints on learning. Total Load = Intrinsic + Extraneous + Germane ≤ WMC.',
      formulaType: 'Placeholder',
      limitations: ['No established formula converting excess load into precise probability drop', 'Intrinsic load mapping is arbitrary'],
    },
    originalConstruct: 'Working memory capacity constraints',
    source: 'Sweller (1994), Cowan (2001)',
    population: 'Broad educational experiments',
    timescale: 'Minutes (within-task)',
    mathematicalFormulation: 'P(learn) = exp(-(TotalLoad - WMC)) if Load > WMC — SYNTHETIC',
    parameterProvenance: 'Intrinsic load mapped 1-10 arbitrarily. WMC ~ N(4, 1) — SYNTHETIC',
    assumptions: ['Exponential drop is an arbitrary functional form', 'All intrinsic load is comparable across domains'],
    validationStatus: 'Framework is well-established; exact mathematical translation is synthetic',
    limitations: ['The specific exponential function was invented for this codebase'],
    compatibleModels: ['mech_bkt', 'mech_power_law_forgetting'],
    conflictingModels: [],
    auditClassification: 'Synthetic_Assumption',
  },
  {
    mechanism: {
      id: 'mech_sdt',
      name: 'Self-Determination Theory (SDT)',
      description: 'Intrinsic motivation driven by Autonomy, Competence, and Relatedness.',
      formulaType: 'Placeholder',
      limitations: ['Quantitative combination formula is entirely invented', 'SDT is qualitative, not a 0-100 scale'],
    },
    originalConstruct: 'Motivational orientation',
    source: 'Deci & Ryan (2000)',
    population: 'Universal human psychology',
    timescale: 'Days to Years',
    mathematicalFormulation: '100 * (1 - exp(-k * (waA + wcC + wrR) / 300)) — SYNTHETIC',
    parameterProvenance: 'Weights (wa, wc, wr) and k=3.0 are entirely invented — SYNTHETIC',
    assumptions: ['Needs aggregate linearly inside an exponential', 'Produces a 0-100 score from a qualitative theory'],
    validationStatus: 'Theory is well-established; exact quantitative formula is synthetic',
    limitations: ['SDT literature rarely quantifies this exact functional form', 'Should be rethought as qualitative state'],
    compatibleModels: ['mech_self_efficacy'],
    conflictingModels: [],
    auditClassification: 'Synthetic_Assumption',
  },
  {
    mechanism: {
      id: 'mech_peer_effects',
      name: 'Linear-in-Means Peer Effects',
      description: 'Influence of peer achievement on individual achievement.',
      formulaType: 'Exact',
      limitations: ['Beta parameter set to ~0.3 SD; empirical estimates are typically 0.05-0.15 SD'],
    },
    originalConstruct: 'Social influence on academic achievement',
    source: 'Sacerdote (2011)',
    population: 'College roommates, primary school classrooms',
    timescale: 'Months to Years',
    mathematicalFormulation: 'Ai = β0 + β1*Xi + β2*X̄_(-i) + εi',
    parameterProvenance: 'β2 ~ N(0.3, ...) — OVERESTIMATED',
    assumptions: ['Linear relationship', 'Homogeneous peer influence across contexts'],
    validationStatus: 'Causal evidence from random assignment; parameter calibration needed',
    limitations: ['Effect size likely overestimated in current implementation'],
    compatibleModels: ['mech_sdt'],
    conflictingModels: [],
    auditClassification: 'Supported',
  },
  {
    mechanism: {
      id: 'mech_chetty_mobility',
      name: 'Intergenerational Mobility (Chetty)',
      description: 'Probability of moving up the income distribution.',
      formulaType: 'Exact',
      limitations: ['TIMESCALE MISMATCH: operates over decades, was applied to daily simulation ticks'],
    },
    originalConstruct: 'Intergenerational economic mobility',
    source: 'Chetty et al. (2014)',
    population: 'US tax records, millions of parent-child pairs',
    timescale: 'GENERATIONAL (decades)',
    mathematicalFormulation: 'Mobility index from parent-child income rank correlations',
    parameterProvenance: 'Empirically derived from US tax data — VALID for generational timescale',
    assumptions: ['Daily updates are inappropriate', 'Cannot be computed from daily student mastery fluctuations'],
    validationStatus: 'Strong empirical evidence at generational timescale; invalid at daily timescale',
    limitations: ['Categorical mismatch of timescales when applied to daily simulation loop'],
    compatibleModels: [],
    conflictingModels: [],
    auditClassification: 'Timescale_Mismatch',
  },
];

/**
 * The SIH audit studies formatted for ingestion into the Knowledge Graph.
 */
export const SIH_AUDIT_STUDIES: Partial<Study>[] = [
  {
    id: 'study_corbett_anderson_1994',
    title: 'Knowledge Tracing: Modeling the Acquisition of Procedural Knowledge',
    authors: 'Corbett & Anderson',
    publicationYear: 1994,
    methodology: 'Computational modelling of student performance on LISP cognitive tutors',
    studyDesign: 'Computational',
    population: { description: 'College students learning LISP programming' },
    variablesStudied: ['Performance', 'Latent Knowledge State'],
    measurements: ['Correct/Incorrect step completion'],
    effectDescription: 'HMM accurately predicts future correct responses based on past history',
    limitations: ['Assumes binary knowledge state', 'Does not model forgetting'],
    replicationStatus: 'Replicated',
    evidenceQuality: 'High',
    domains: ['Educational', 'Cognitive'],
    subDomains: ['learning', 'assessment'],
  },
  {
    id: 'study_wixted_ebbesen_1991',
    title: 'On the Form of Forgetting',
    authors: 'Wixted & Ebbesen',
    publicationYear: 1991,
    methodology: 'Experimental psychology, memory retention experiments',
    studyDesign: 'Cross_Sectional',
    population: { description: 'College students', demographics: 'US undergraduate' },
    variablesStudied: ['Time since learning', 'Retention'],
    measurements: ['Recall accuracy'],
    effectDescription: 'Memory retention follows a power-law decay function over time',
    limitations: ['Mostly declarative memory', 'Lab conditions'],
    replicationStatus: 'Replicated',
    evidenceQuality: 'High',
    domains: ['Cognitive', 'Neuroscience'],
    subDomains: ['long_term_memory', 'learning'],
  },
  {
    id: 'study_deci_ryan_2000',
    title: 'The "What" and "Why" of Goal Pursuits: Human Needs and the Self-Determination of Behavior',
    authors: 'Deci & Ryan',
    publicationYear: 2000,
    methodology: 'Theoretical framework with extensive empirical support',
    studyDesign: 'Systematic_Review',
    population: { description: 'Universal human psychology' },
    variablesStudied: ['Autonomy', 'Competence', 'Relatedness', 'Intrinsic Motivation'],
    measurements: ['Self-report scales', 'Behavioural observation'],
    effectDescription: 'Satisfaction of autonomy, competence, and relatedness increases intrinsic motivation',
    limitations: ['Qualitative theory often inappropriately quantified'],
    replicationStatus: 'Replicated',
    evidenceQuality: 'Very_High',
    domains: ['Psychological'],
    subDomains: ['motivation', 'self_concept'],
  },
  {
    id: 'study_sacerdote_2011',
    title: 'Peer Effects in Education: How Might They Work, How Big Are They and How Much Do We Know Thus Far?',
    authors: 'Sacerdote',
    publicationYear: 2011,
    methodology: 'Review of quasi-experimental and experimental studies of peer effects',
    studyDesign: 'Systematic_Review',
    population: { description: 'K-12 and college students' },
    variablesStudied: ['Peer achievement', 'Individual achievement'],
    measurements: ['Test scores', 'GPA'],
    effectDescription: 'Peer achievement has a positive but modest effect on individual achievement (0.05-0.15 SD)',
    effectSize: 0.1,
    limitations: ['Effect size often smaller than implementations assume', 'Mechanisms unclear'],
    replicationStatus: 'Replicated',
    evidenceQuality: 'High',
    domains: ['Social', 'Educational'],
    subDomains: ['peers', 'educational_inequality'],
  },
  {
    id: 'study_sweller_1994',
    title: 'Cognitive Load Theory, Learning Difficulty, and Instructional Design',
    authors: 'Sweller',
    publicationYear: 1994,
    methodology: 'Theoretical framework derived from experimental cognitive psychology',
    studyDesign: 'Other',
    population: { description: 'Educational settings, broad' },
    variablesStudied: ['Intrinsic Load', 'Extraneous Load', 'Germane Load', 'Working Memory Capacity', 'Learning'],
    measurements: ['Task performance', 'Error rates'],
    effectDescription: 'Excess cognitive load reduces learning effectiveness',
    limitations: ['Exact quantification of load types remains contested'],
    replicationStatus: 'Replicated',
    evidenceQuality: 'High',
    domains: ['Cognitive', 'Educational'],
    subDomains: ['working_memory', 'learning', 'pedagogy'],
  },
  {
    id: 'study_chetty_2014',
    title: 'Where is the Land of Opportunity? The Geography of Intergenerational Mobility in the United States',
    authors: 'Chetty, Hendren, Kline, Saez',
    publicationYear: 2014,
    methodology: 'Analysis of millions of US tax records tracking parent-child income mobility',
    studyDesign: 'Longitudinal',
    population: { description: 'US tax filers', sampleSize: 40000000, demographics: 'US national' },
    variablesStudied: ['Parent Income Rank', 'Child Income Rank', 'Geographic Factors'],
    measurements: ['Tax returns', 'Income percentile rank'],
    effectDescription: 'Intergenerational mobility varies substantially by geography and is associated with school quality, social capital, and family structure',
    effectSize: 0.34,
    limitations: ['US-specific', 'Income ≠ wellbeing', 'Cannot be applied at daily timescales'],
    replicationStatus: 'Replicated',
    evidenceQuality: 'Very_High',
    domains: ['Economic', 'Educational', 'Social'],
    subDomains: ['inequality', 'mobility', 'educational_inequality'],
  },
];

/**
 * Project Genesis — Research Engine Ontology
 * 
 * Defines the full type system for scientific research acquisition,
 * evidence extraction, synthesis, contradiction detection, and
 * knowledge graph construction across all human-system domains.
 */

// ─────────────────────────────────────────────────────────────
// DOMAIN TAXONOMY
// ─────────────────────────────────────────────────────────────

export type ResearchDomain =
  | 'Biological'
  | 'Neuroscience'
  | 'Cognitive'
  | 'Psychological'
  | 'Emotional'
  | 'Behavioural'
  | 'Social'
  | 'Developmental'
  | 'Educational'
  | 'Environmental'
  | 'Cultural'
  | 'Economic'
  | 'Institutional'
  | 'Digital_Technological'
  | 'Philosophical'
  | 'Temporal'
  | 'Complex_Systems'
  | 'Physiological'
  | 'Methodological'
  | 'Life_History';

export const DOMAIN_SUBDOMAIN_MAP: Record<ResearchDomain, string[]> = {
  Biological: [
    'genetics', 'epigenetics', 'gene_x_environment', 'developmental_biology',
    'neurobiology', 'endocrinology', 'immunology', 'inflammation', 'metabolism',
    'microbiome', 'nutrition', 'reproductive_biology', 'aging', 'neuroplasticity',
    'autonomic_nervous_system', 'hpa_axis', 'circadian_biology', 'sleep_physiology',
    'homeostasis_allostasis'
  ],
  Neuroscience: [
    'neural_networks', 'brain_regions', 'neurotransmission', 'reward_systems',
    'threat_processing', 'salience', 'executive_control', 'memory_systems',
    'predictive_processing', 'interoception', 'consciousness', 'neural_plasticity',
    'neurodevelopment'
  ],
  Cognitive: [
    'perception', 'attention', 'working_memory', 'long_term_memory', 'learning',
    'reasoning', 'problem_solving', 'decision_making', 'metacognition',
    'cognitive_biases', 'predictive_processing', 'mental_models', 'language',
    'intelligence', 'creativity'
  ],
  Psychological: [
    'personality', 'motivation', 'self_concept', 'self_efficacy', 'attachment',
    'coping', 'stress', 'resilience', 'identity', 'psychological_development',
    'psychopathology', 'individual_differences'
  ],
  Emotional: [
    'appraisal_theories', 'dimensional_models', 'discrete_emotions',
    'emotion_regulation', 'emotional_memory', 'affect', 'mood',
    'emotional_development', 'alexithymia'
  ],
  Behavioural: [
    'habits', 'reinforcement', 'avoidance', 'approach_behaviour',
    'behavioural_adaptation', 'decision_patterns', 'risk_taking',
    'self_regulation', 'behavioural_economics'
  ],
  Social: [
    'family', 'peers', 'attachment_relationships', 'social_identity', 'status',
    'belonging', 'cooperation', 'conflict', 'social_networks', 'social_cognition',
    'theory_of_mind', 'empathy'
  ],
  Developmental: [
    'childhood', 'adolescence', 'adulthood', 'aging', 'sensitive_periods',
    'developmental_transitions', 'accumulated_experience', 'epigenetic_programming',
    'intergenerational_transmission'
  ],
  Educational: [
    'pedagogy', 'assessment', 'learning_trajectories', 'curriculum', 'teachers',
    'institutions', 'educational_inequality', 'spaced_repetition', 'testing_effects',
    'feedback', 'tutoring', 'self_regulated_learning'
  ],
  Environmental: [
    'temperature', 'light', 'noise', 'air_quality', 'pollution', 'crowding',
    'architecture', 'housing', 'transportation', 'food_availability', 'technology',
    'geography', 'climate', 'resource_availability'
  ],
  Cultural: [
    'norms', 'values', 'language', 'collective_behaviour', 'institutions',
    'cultural_psychology', 'cross_cultural_differences', 'acculturation'
  ],
  Economic: [
    'socioeconomic_status', 'income', 'employment', 'resource_constraints',
    'inequality', 'mobility', 'poverty', 'economic_stress'
  ],
  Institutional: [
    'schools', 'universities', 'healthcare', 'governments', 'organizations',
    'policies', 'bureaucracy', 'surveillance', 'compliance', 'autonomy_constraints'
  ],
  Digital_Technological: [
    'screens', 'algorithms', 'social_media', 'ai', 'information_environments',
    'digital_behaviour', 'attention_economy', 'online_social_dynamics'
  ],
  Philosophical: [
    'agency', 'identity', 'meaning', 'ethics', 'consciousness', 'free_will',
    'epistemology', 'phenomenology', 'philosophy_of_mind', 'philosophy_of_science'
  ],
  Temporal: [
    'milliseconds', 'seconds', 'hours', 'days', 'years', 'generations',
    'developmental_time', 'historical_time', 'evolutionary_time'
  ],
  Complex_Systems: [
    'feedback_loops', 'emergence', 'nonlinearities', 'adaptation', 'cascades',
    'tipping_points', 'self_organization', 'network_dynamics', 'resilience',
    'regime_shifts'
  ],
  Physiological: [
    'heart_rate', 'hrv', 'cortisol', 'glucose', 'temperature', 'fatigue',
    'arousal', 'homeostasis', 'allostatic_load', 'sleep', 'circadian_rhythms',
    'endocrine_function'
  ],
  Methodological: [
    'measurement_error', 'validity', 'reliability', 'causal_inference',
    'bayesian_modelling', 'mixed_effects', 'latent_variables', 'reproducibility',
    'p_hacking', 'publication_bias', 'epistemology', 'instrumentation'
  ],
  Life_History: [
    'cumulative_experience', 'sensitive_periods', 'habit_formation',
    'adaptation', 'cumulative_disadvantage', 'path_dependence', 'hysteresis',
    'critical_transitions', 'developmental_trajectories'
  ]
};

// ─────────────────────────────────────────────────────────────
// TEMPORAL EVIDENCE HIERARCHY
// ─────────────────────────────────────────────────────────────

export type TemporalEvidenceEra =
  | 'Foundational'    // Pre-2000: Pavlov, Bowlby, Piaget, Skinner, etc.
  | 'EarlyModern'     // 2000–2010
  | '2010_2020'
  | '2020_Present'
  | 'Current';        // Last 12 months

export type TheoryLifecycleStage =
  | 'Original_Theory'
  | 'Subsequent_Evidence'
  | 'Replicated'
  | 'Criticized'
  | 'Revised'
  | 'Current_Consensus';

export function classifyEra(year: number): TemporalEvidenceEra {
  if (year < 2000) return 'Foundational';
  if (year < 2010) return 'EarlyModern';
  if (year < 2020) return '2010_2020';
  const currentYear = new Date().getFullYear();
  if (year >= currentYear - 1) return 'Current';
  return '2020_Present';
}

// ─────────────────────────────────────────────────────────────
// EPISTEMIC CATEGORIES
// ─────────────────────────────────────────────────────────────

export type EpistemicCategory =
  | 'EMPIRICAL'
  | 'THEORETICAL'
  | 'COMPUTATIONAL'
  | 'PHENOMENOLOGICAL'
  | 'PHILOSOPHICAL'
  | 'PERSONAL_OBSERVATION'
  | 'HYPOTHESIS';

export type ValidationState =
  | 'Established'
  | 'Supported'
  | 'Mixed_Evidence'
  | 'Preliminary'
  | 'Theoretical'
  | 'Hypothesized'
  | 'Unknown'
  | 'Falsified';

// ─────────────────────────────────────────────────────────────
// STUDY & CLAIM STRUCTURES
// ─────────────────────────────────────────────────────────────

export interface Population {
  description: string;
  demographics?: string;
  ageRange?: string;
  sampleSize?: number;
  country?: string;
}

export interface Study {
  id: string;
  title: string;
  authors: string;
  publicationYear: number;
  doi?: string;
  journal?: string;
  abstract?: string;
  methodology: string;
  studyDesign: 'RCT' | 'Longitudinal' | 'Cross_Sectional' | 'Meta_Analysis'
    | 'Systematic_Review' | 'Case_Study' | 'Quasi_Experimental'
    | 'Observational' | 'Computational' | 'Qualitative' | 'Other';
  population: Population;
  variablesStudied: string[];
  measurements: string[];
  effectDescription: string;
  effectSize?: number;
  confidenceInterval?: [number, number];
  pValue?: number;
  limitations: string[];
  replicationStatus: 'Unreplicated' | 'Replicated' | 'Partial' | 'Failed' | 'N/A';
  validationState?: ValidationState; // Explict tracking of theory settledness
  evidenceQuality: 'Low' | 'Moderate' | 'High' | 'Very_High' | 'N/A';
  domains: ResearchDomain[];
  subDomains?: string[];
  era?: TemporalEvidenceEra;
  keywords?: string[];
}

export type ClaimDirection = 'Positive' | 'Negative' | 'No_Effect' | 'Nonlinear' | 'Conditional';

export interface Claim {
  id: string;
  studyId: string;
  statement: string;
  sourceVariable: string;
  targetVariable: string;
  direction: ClaimDirection;
  effectSize?: number;
  effectSizeUnit?: string;
  population: Population;
  context: string;
  measurementMethod: string;
  timescale: string;
  moderators: string[];
  mediators: string[];
  confounders: string[];
  limitations: string[];
  epistemicCategory: EpistemicCategory;
}

export interface ClaimSet {
  id: string;
  sourceVariable: string;
  targetVariable: string;
  claims: Claim[];
  supportCount: number;
  contradictCount: number;
  mixedCount: number;
  noEffectCount: number;
}

// ─────────────────────────────────────────────────────────────
// COMPETING MODELS & EXPLANATIONS
// ─────────────────────────────────────────────────────────────

export interface CompetingModel {
  id: string;
  name: string;
  description: string;
  predictions: string[];
  supportingEvidenceIds: string[];
  contradictingEvidenceIds: string[];
  confidenceScore: number; // dynamically updated
}

export interface ModelComparison {
  phenomenon: string;
  models: CompetingModel[];
  bestFitConditions: Record<string, string>; // Maps modelId to condition string
  resolutionStatus: 'Unresolved' | 'Conditionally_Resolved' | 'Consensus';
}

// ─────────────────────────────────────────────────────────────
// CONTRADICTION DETECTION
// ─────────────────────────────────────────────────────────────

export type ContradictionDimension =
  | 'Population'
  | 'Age'
  | 'Context'
  | 'Measurement'
  | 'Experimental_Design'
  | 'Timescale'
  | 'Dose'
  | 'Moderator'
  | 'Confound'
  | 'Replication'
  | 'Unknown';

export type ResolutionStatus = 'Unresolved' | 'Partially_Resolved' | 'Resolved' | 'Irreconcilable';

export interface ContradictionReport {
  id: string;
  claimSetId: string;
  conflictingClaimIds: string[];
  investigatedDimensions: ContradictionDimension[];
  proposedExplanation: string;
  resolutionStatus: ResolutionStatus;
  conditionalModel?: string; // e.g. "X → Y under conditions A, B; X ↛ Y under conditions C"
}

// ─────────────────────────────────────────────────────────────
// KNOWLEDGE EDGE (SYNTHESIZED RELATIONSHIP)
// ─────────────────────────────────────────────────────────────

export type RelationshipType =
  | 'Causal'
  | 'Associational'
  | 'Modulatory'
  | 'Feedback_Dampening'
  | 'Feedback_Amplifying'
  | 'Emergent'
  | 'Conditional';

export interface KnowledgeEdge {
  id: string;
  sourceVariable: string;
  targetVariable: string;
  relationshipType: RelationshipType;
  direction: 'Unidirectional' | 'Bidirectional';
  synthesizedStrength: number;       // -1.0 to 1.0
  confidence: number;                // 0.0 to 1.0
  supportingClaimSetId: string;
  contradictionReportIds: string[];
  conditions: string[];              // Under what conditions this holds
  moderators: string[];
  mediators: string[];
  timescale: string;
  domains: ResearchDomain[];
  evidenceQuality: 'Low' | 'Moderate' | 'High' | 'Very_High';
  studyCount: number;
  earliestEvidence: number;          // Year
  latestEvidence: number;            // Year
  lifecycleStage: TheoryLifecycleStage;
}

// ─────────────────────────────────────────────────────────────
// RESEARCH QUERY
// ─────────────────────────────────────────────────────────────

export interface ResearchQuery {
  id: string;
  description: string;
  domains: ResearchDomain[];
  subDomains?: string[];
  variables?: string[];
  relationshipType?: RelationshipType;
  eraFilter?: TemporalEvidenceEra[];
  minEvidenceQuality?: 'Low' | 'Moderate' | 'High' | 'Very_High';
  maxResults?: number;
  searchQueryString?: string;
  priority?: string;
}

// ─────────────────────────────────────────────────────────────
// MISSING VARIABLE DISCOVERY
// ─────────────────────────────────────────────────────────────

export interface MissingVariable {
  variableName: string;
  mentionedInStudyIds: string[];
  mentionCount: number;
  domains: ResearchDomain[];
  suggestedRelationships: string[];  // e.g. "sleep → this variable → attention"
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
}

// ─────────────────────────────────────────────────────────────
// NEGATIVE EVIDENCE
// ─────────────────────────────────────────────────────────────

export type NegativeEvidenceType =
  | 'Null_Result'
  | 'Failed_Replication'
  | 'Insufficient_Evidence'
  | 'Effect_Smaller_Than_Claimed'
  | 'Opposite_Direction';

export interface NegativeEvidence {
  id: string;
  claimId: string;
  type: NegativeEvidenceType;
  originalClaimId?: string;
  studyId: string;
  description: string;
}

// ─────────────────────────────────────────────────────────────
// RESEARCH GAP GRAPH
// ─────────────────────────────────────────────────────────────

export type GapType =
  | 'No_Studies'
  | 'Insufficient_Replication'
  | 'Population_Gap'
  | 'Timescale_Gap'
  | 'Mechanism_Unknown'
  | 'Measurement_Gap'
  | 'Contradictory_Evidence'
  | 'Missing_Moderators'
  | 'Missing_Mediators'
  | 'Causal_Design_Missing'
  | 'Cross_Domain_Integration'
  | 'Coupling_Gap'
  | 'Philosophical_Empirical_Gap'
  | 'Complexity_Gap'
  | 'Causal_Synthesis_Gap';

export interface ResearchGap {
  id: string;
  description: string;
  domain: ResearchDomain;
  relatedVariables: string[];
  gapType: GapType;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  discoveredBy: 'Manual' | 'Gap_Detection_Algorithm';
  suggestedSearchTerms: string[];
}

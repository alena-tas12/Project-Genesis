/**
 * Project Genesis - Scientific Knowledge Architecture (Phase 2)
 * 
 * Defines the comprehensive epistemic and structural ontology for 
 * a general human-system research model.
 */

export type LayerType = 
  | 'Biological' 
  | 'Physiological'
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
  | 'Complex_Systems';

export type TimeScale = 'Milliseconds' | 'Seconds' | 'Minutes' | 'Hours' | 'Days' | 'Months' | 'Years' | 'Generational';

export type EpistemicCategory = 
  | 'EMPIRICAL' 
  | 'THEORETICAL' 
  | 'COMPUTATIONAL' 
  | 'PHENOMENOLOGICAL' 
  | 'PHILOSOPHICAL' 
  | 'PERSONAL_OBSERVATION' 
  | 'HYPOTHESIS';

export type ValidationState = 'Established' | 'Supported' | 'Mixed_Evidence' | 'Preliminary' | 'Theoretical' | 'Hypothesized' | 'Unknown' | 'Falsified';

export interface Uncertainty {
  confidence: number; // 0.0 (pure guess) to 1.0 (physical law)
  variance?: number;
  notes: string;
}

export interface Population {
  description: string;
  demographics?: string;
  sampleSize?: number;
}

export interface Study {
  id: string;
  title: string;
  authors: string;
  publicationYear: number;
  methodology: string;
  population: Population;
  variablesStudied: string[];
  measurements: string[];
  effectDescription: string;
  effectSize?: number;
  uncertainty: Uncertainty;
  limitations: string[];
  replicationStatus: 'Unreplicated' | 'Replicated' | 'Mixed' | 'Falsified' | 'N/A';
  evidenceQuality: 'Low' | 'Moderate' | 'High' | 'N/A';
}

export interface EvidenceSet {
  id: string;
  targetMechanismId: string;
  studies: Study[];
  synthesizedConfidence: number;
  conflicts: string[];
}

export type PhilosophicalType = 'Concept' | 'Argument' | 'Assumption' | 'Position' | 'Interpretation' | 'Implication';

export interface PhilosophicalConstruct {
  id: string;
  name: string;
  type: PhilosophicalType;
  description: string;
  relatedMechanisms?: string[]; // Links abstract concepts (e.g., 'Agency') to empirical mechanisms
}

export interface Variable {
  id: string;
  name: string;
  type: 'Continuous' | 'Categorical' | 'Binary' | 'NetworkState';
  layer: LayerType;
  measurementModel?: string; // How this is operationalized in reality
}

export interface Mechanism {
  id: string;
  name: string;
  description: string;
  epistemicCategory: EpistemicCategory;
  validationState: ValidationState;
  evidenceSetId?: string; // Links to the EvidenceSet synthesizing the literature
}

export interface Relationship {
  id: string;
  sourceId: string; // ID of Variable or Mechanism
  targetId: string; // ID of Variable or Mechanism
  type: 'Causal' | 'Associational' | 'Modulatory' | 'Feedback_Dampening' | 'Feedback_Amplifying' | 'Emergent';
  direction: 'Unidirectional' | 'Bidirectional';
  strength: number; // -1.0 to 1.0
  timeScale: TimeScale;
  conditions: string[]; // e.g., 'Only under high allostatic load'
  mechanismId?: string;
  uncertainty: Uncertainty;
}

export interface Model {
  id: string;
  name: string;
  description: string;
  variables: Variable[];
  relationships: Relationship[];
  mechanisms: Mechanism[];
  philosophicalConstructs?: PhilosophicalConstruct[];
  limitations: string[];
}
